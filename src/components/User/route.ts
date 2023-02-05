import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { protectedRoute, isAdmin } from "../../middlewares";
import { CommonDeleteDTOType, IRequest, IRequestWithToken } from "../../types";
import { IRecipeSingleDTO } from "../Recipe/interface";
import { IUserSingleDTO, IUserUpdateDTO } from "./interface";
import { userRepo } from "./repo";

const router = express.Router();

router.use(protectedRoute).use(isAdmin);

/**
 * @route PUT /user/Update
 * @group User - Operations about user
 * @param {UserUpdateDtoModel.model} data.body.required
 * @returns {UserSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.put(
  "/Update",
  async function (
    req: IRequest<IUserUpdateDTO, IUserSingleDTO>,
    res: Response
  ) {
    try {
      const { id, email, password, isAdmin, status } = req.body;

      if (!email && !password && typeof isAdmin === "undefined") {
        return res.status(400).send("All input is required");
      }

      //Encrypt user password
      let encryptedPassword;
      if (password) {
        encryptedPassword = (await bcrypt.hash(password, 10)) as string;
      }

      const user = await userRepo.update({
        id,
        email,
        isAdmin,
        password: encryptedPassword,
        status,
      });
      if (!user) {
        return res.status(400).send("Cannot update user");
      }

      return res.status(200).send({ data: user });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route GET /user
 * @group User - Operations about user
 * @returns {Array.<UserGroupDtoModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.get(
  "/",
  async function (req: IRequest<void, IUserSingleDTO>, res: Response) {
    const { status } = req.query;
    try {
      let result;
      if (status) {
        result = await userRepo.getByField({
          fieldName: "status",
          fieldValue: status as string,
        });
      } else {
        result = await userRepo.getAll();
      }
      if (!result) {
        return res.status(400).send("Cannot get users");
      }

      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route GET /user/{id}
 * @group User - Operations about user
 * @param {string} id.params.required
 * @returns {UserSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
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
 * @returns {Error}  401 - Wrong credentials
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
 * @returns {Error}  401 - Wrong credentials
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
 * @returns {UserSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Activate",
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, IRecipeSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
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
 * @returns {UserSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Deactivate",
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, IUserSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
      }

      const deactivatedUser = await userRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "inactive",
      });

      if (!deactivatedUser) {
        return res.status(400).send("Cannot deactivate user");
      }

      return res.status(200).send({ data: deactivatedUser });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as userRouter };
