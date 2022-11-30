import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { IUser } from "../../interfaces";
import { userRepo } from "../../repository";

const router = express.Router();

/**
 * @route POST /auth
 * @group Auth - Operations about auth
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {UserModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  404 - Wrong credentials
 */
router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim(),
  async function (req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.status(400).send("All input is required");
      }

      const [user]: IUser[] = await userRepo.getByField({
        fieldName: "email",
        fieldValue: email,
      });
      if (!user) {
        return res.status(404).send();
      }

      bcrypt.compare(
        password,
        user.password,
        (err: Error, isValid: boolean) => {
          if (err || !isValid) {
            return res.status(404).send("Wrong credentials");
          }

          // save user token
          user.token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          // return authorized user
          return res.status(201).json(user);
        }
      );
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as authRouter };
