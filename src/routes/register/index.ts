import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { ResultSetHeader } from "mysql2/promise";

import { UserModel } from "../../models/UserModel";
import { errorLog, warningLog } from "../../utils";
import { userRepo } from "../../repository";

const router = express.Router();

/**
 * @route POST /register
 * @group Register - Operations about register
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {UserModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post("/", async function (req: Request, res: Response) {
  try {
    const { email, password, isAdmin } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const [oldUser] = await userRepo.getByField({
      fieldName: "email",
      fieldValue: email,
    });

    if (oldUser) {
      return res
        .status(409)
        .send("User with same email already exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const result: ResultSetHeader = await userRepo.add({
      email,
      password: encryptedPassword,
      isAdmin,
    });
    if (!result.insertId) {
      errorLog("User not created", result);
      return res.status(400).send("User not created");
    }

    warningLog("created user ", email);

    // Create token
    const token = jwt.sign(
      { user_id: result.insertId, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    const user = { id: result.insertId, email, token };

    // return new user
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

export { router as registerRouter };
