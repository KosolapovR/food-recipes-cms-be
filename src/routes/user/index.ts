import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { userRepo } from "../../repository";
import { errorLog } from "../../utils";
import { IRequestWithToken } from "../../types";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route PUT /user/Update
 * @group User - Operations about user
 * @param {number} id.body.required
 * @param {string} email.body.required
 * @param {string} password.body
 * @param {status} status.body
 * @returns {UserModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.put("/Update", async function (req: Request, res: Response) {
  try {
    const { id, email, password, isAdmin, status } = req.body;

    if (!email && !password && typeof isAdmin === "undefined") {
      return res.status(400).send("All input is required");
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
      status,
    });
    if (!user) {
      errorLog("Cannot update user", user);
      return res.status(400).send("Cannot update user");
    }

    return res.status(200).send({ data: user });
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send("Cannot get users");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send(`Cannot get user by id ${req.params.id}`);
    }
    const result = await userRepo.getById(id);
    if (!result) {
      return res.status(400).send("Cannot get user");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send("All input is required");
    }

    const result = await userRepo.removeById({ id });
    if (!result) {
      return res.status(400).send("Cannot delete user");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send("All input is required");
    }

    const result = await userRepo.removeAllByIds({ ids });
    if (!result) {
      return res.status(400).send("Cannot delete users");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /user/Activate
 * @group User - Operations about user
 * @param {number} id.body.required
 * @returns {UserModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Activate",
  async function (req: IRequestWithToken, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).send("All input is required");
      }

      const { email } = jwt.decode(req.token) as JwtPayload;

      const [currentUser] = await userRepo.getByField({
        fieldName: "email",
        fieldValue: email,
      });

      if (!currentUser.isAdmin) {
        return res.status(401).send("Not enough rights for operation");
      }

      const activatedUser = await userRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "active",
      });

      if (!activatedUser) {
        return res.status(400).send("Cannot activate user");
      }

      return res.status(200).send({ data: activatedUser });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route POST /user/Deactivate
 * @group User - Operations about user
 * @param {number} id.body.required
 * @returns {UserModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Deactivate",
  async function (req: IRequestWithToken, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).send("All input is required");
      }

      const { email } = jwt.decode(req.token) as JwtPayload;

      const [currentUser] = await userRepo.getByField({
        fieldName: "email",
        fieldValue: email,
      });

      if (!currentUser.isAdmin) {
        return res.status(401).send("Not enough rights for operation");
      }

      const activatedUser = await userRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "inactive",
      });

      if (!activatedUser) {
        return res.status(400).send("Cannot deactivate user");
      }

      return res.status(200).send({ data: activatedUser });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as userRouter };
