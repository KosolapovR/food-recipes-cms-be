import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { userRepo } from "../User/repo";
import { AppJwtPayload, IRequestWithToken } from "../../types";
import { IUserSingleDTO } from "../User/interface";
import { pino } from "../../index";
import { protectedRoute } from "../../middlewares";

const router = express.Router();

/**
 * @route POST /auth
 * @group Auth - Operations about auth
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {UserSingleDtoModel.model} 201
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

      const [user] = await userRepo.getByField({
        fieldName: "email",
        fieldValue: email,
      });
      if (!user) {
        return res.status(404).send();
      }

      const secret: Secret = process.env.TOKEN_KEY || "";
      bcrypt.compare(
        password,
        user.password || "",
        (err: Error, isValid: boolean) => {
          if (err || !isValid) {
            return res.status(404).send("Wrong credentials");
          }

          // save user token
          user.token = jwt.sign({ user_id: user.id }, secret, {
            expiresIn: "2h",
          });

          delete user.password;

          // return authorized user
          return res.status(201).json({ data: user });
        }
      );
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route GET /auth/me
 * @group Auth - Operations about auth
 *  @returns {Array.<UserSingleDtoModel>} 200
 *  @returns {Error}  401 - Wrong credentials
 **/
router.get(
  "/me",
  protectedRoute,
  async (req: IRequestWithToken<any, IUserSingleDTO>, res: Response) => {
    pino.logger.info(`Request`, req);
    const jwtPayload = jwt.decode(req.token) as AppJwtPayload;
    if (!jwtPayload) return res.status(404).send({});

    const { user_id } = jwtPayload;
    const user = await userRepo.getById(user_id);

    if (!user) return res.status(404).send({});

    return res.status(200).json({ data: user });
  }
);

export { router as authRouter };
