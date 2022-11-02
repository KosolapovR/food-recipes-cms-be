import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { errorLog, warningLog } from "../../utils";
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
        res.status(400).send("All input is required");
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
          if (err) {
            errorLog(err);
          }

          if (!isValid) {
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

          warningLog(`user ${user.email} was authorized`);
          // return authorized user
          res.status(201).json(user);
        }
      );
    } catch (err) {
      errorLog(err);
    }
  }
);

export { router as authRouter };
