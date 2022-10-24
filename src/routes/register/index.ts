import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { Connection, ResultSetHeader } from "mysql2/promise";

import { UserModel } from "../../models/UserModel";
import { getRepository } from "../../repository";
import { errorLog, warningLog } from "../../utils";

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
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const db: Connection = req.app.get("db");
    const { users } = getRepository(db);
    const [oldUser] = await users.getAllByField({
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

    const result: ResultSetHeader = await users.add({
      email,
      password: encryptedPassword,
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
  } catch (err) {
    errorLog(err);
  }
});

export { router as registerRouter };
