import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import express, { Request, Response } from "express";
import { ResultSetHeader } from "mysql2/promise";
import { userRepo } from "../User/repo";

const router = express.Router();

/**
 * @route POST /register
 * @group Register - Operations about register
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {UserSingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post("/", async function (req: Request, res: Response) {
  try {
    const { email, password, isAdmin } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
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
      status: "inactive",
    });
    if (!result.insertId) {
      return res.status(400).send("User not created");
    }

    const secret: Secret = process.env.TOKEN_KEY || "";
    // Create token
    const token = jwt.sign({ user_id: result.insertId }, secret, {
      expiresIn: "2h",
    });
    // save user token
    const user = { id: result.insertId, email, token };

    // return new user
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export { router as registerRouter };
