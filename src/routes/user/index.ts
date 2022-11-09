import express, { Request, Response } from "express";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { userRepo } from "../../repository";
import { errorLog } from "../../utils";
import bcrypt from "bcryptjs";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route PUT /user/Update
 * @group User - Operations about user
 * @param {number} id.body.required
 * @param {string} email.body.required
 * @param {string} password.body
 * @returns {UserModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.put("/Update", async function (req: Request, res: Response) {
  try {
    const { id, email, password, isAdmin } = req.body;

    if (!email && !password && typeof isAdmin === "undefined") {
      res.status(400).send("All input is required");
    }

    const [oldUser] = await userRepo.getByField({
      fieldName: "email",
      fieldValue: email,
    });

    if (oldUser) {
      return res.status(409).send("User with same email already exist");
    }

    //Encrypt user password
    let encryptedPassword;
    if (password) {
      encryptedPassword = await bcrypt.hash(password, 10);
    }

    const user = await userRepo.update({
      id,
      email,
      isAdmin,
      password: encryptedPassword,
    });
    if (!user) {
      errorLog("Cannot update user", user);
      res.status(400).send("Cannot update user");
    }

    res.status(200).send({ data: user });
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

/**
 * @route GET /user
 * @group User - Operations about user
 * @returns {Array.<UserModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/", async function (req: Request, res: Response) {
  try {
    const result = await userRepo.getAll();
    if (!result) {
      errorLog("Cannot get users", result);
      res.status(400).send("Cannot get users");
    }

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

/**
 * @route GET /user/{id}
 * @param {string} id.params.required
 * @group User - Operations about user
 * @returns {UserModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (!id || Number.isNaN(id)) {
      errorLog("Cannot get user by id", req.params.id);
      res.status(400).send(`Cannot get user by id ${req.params.id}`);
    }
    const result = await userRepo.getById(id);
    if (!result) {
      errorLog("Cannot get user", result);
      res.status(400).send("Cannot get user");
    }

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

/**
 * @route POST /user/Delete
 * @group User - Operations about user
 *  @param {number} id.body.required
 * @returns {} 204
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post("/Delete", async function (req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).send("All input is required");
    }

    const result = await userRepo.removeById({ id });
    if (!result) {
      res.status(400).send("Cannot delete user");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

/**
 * @route POST /user/BatchDelete
 * @group User - Operations about user
 * @param {Array<number>} ids.body.required
 * @returns {} 204
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post("/BatchDelete", async function (req: Request, res: Response) {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      res.status(400).send("All input is required");
    }

    const result = await userRepo.removeAllByIds({ ids });
    if (!result) {
      res.status(400).send("Cannot delete users");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

export { router as userRouter };
