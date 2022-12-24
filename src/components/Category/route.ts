import express, { Request, Response } from "express";
import { body } from "express-validator";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { categoryRepo } from "./repo";
import {
  ICategoryCreateDTO,
  ICategorySingleDTO,
  ICategoryUpdateDTO,
} from "./interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userRepo } from "../User/repo";
import { IRequest, IRequestWithToken } from "../../types";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /category/Create
 * @group Category - Operations about category
 * @param {CategoryCreateDtoModel.model} data.body.required
 * @returns {CategorySingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Create",
  body("name").not().isEmpty().trim(),
  async function (
    req: IRequestWithToken<ICategoryCreateDTO, ICategorySingleDTO>,
    res: Response
  ) {
    try {
      const { name, parentId } = req.body;

      if (!name) {
        return res.status(400).send("Required fields: name");
      }
      //TODO extract permission checking logic
      const { email } = jwt.decode(req.token) as JwtPayload;

      const [currentUser] = await userRepo.getByField({
        fieldName: "email",
        fieldValue: email,
      });

      if (!currentUser.isAdmin) {
        return res.status(401).send("Not enough rights for operation");
      }

      const category = await categoryRepo.add({
        name,
        parentId,
      });
      if (!category) {
        return res.status(400).send("Cannot add category");
      }

      return res.status(201).send({ data: category });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route PUT /category/Update
 * @group Category - Operations about category
 * @param {CategoryUpdateDtoModel.model} data.body.required
 * @returns {CategorySingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.put(
  "/Update",
  async function (
    req: IRequest<ICategoryUpdateDTO, ICategorySingleDTO>,
    res: Response
  ) {
    try {
      const { id, name, parentId } = req.body;

      if (!name) {
        return res.status(400).send("All input is required");
      }

      const category = await categoryRepo.update({
        id,
        name,
        parentId,
      });

      if (!category) {
        return res.status(400).send("Cannot update category");
      }

      return res.status(200).send({ data: category });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route GET /category
 * @group Category - Operations about category
 * @returns {Array.<CategoryGroupDtoModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/", async function (req: Request, res: Response) {
  try {
    const result = await categoryRepo.getAll();
    if (!result) {
      return res.status(400).send("Cannot get categories");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route GET /category/{id}
 * @group Category - Operations about category
 * @param {string} id.params.required
 * @returns {CategorySingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).send(`Cannot get category by id ${req.params.id}`);
    }
    const result = await categoryRepo.getById(id);
    if (!result) {
      return res.status(400).send("Cannot get category");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /category/Delete
 * @group Category - Operations about category
 * @param {number} id.body.required
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

    const result = await categoryRepo.removeById({ id });
    if (!result) {
      return res.status(400).send("Cannot delete category");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /category/BatchDelete
 * @group Category - Operations about category
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

    const result = await categoryRepo.removeAllByIds({ ids });
    if (!result) {
      return res.status(400).send("Cannot delete categories");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export { router as categoryRouter };
