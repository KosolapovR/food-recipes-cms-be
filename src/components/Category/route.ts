import express, { Request, Response } from "express";

import { isAdmin, protectedRoute } from "../../middlewares";
import { createRouteGenerator } from "../../route_generator";
import { ICategoryCreateDTO, ICategoryGroupDTO } from "./interface";
import { categoryRepo as repo } from "./repo";
import { ICategorySingleDTO, ICategoryUpdateDTO } from "../Category/interface";

const router = express.Router();

const generatorParams = { router, repo, entityName: "category" };
const { get, post, put } = createRouteGenerator<
  ICategoryCreateDTO,
  ICategoryUpdateDTO,
  ICategorySingleDTO,
  ICategoryGroupDTO
>(generatorParams);
/**
 * @route POST /category/Create
 * @group Category - Operations about category
 * @param {CategoryCreateDtoModel.model} data.body.required
 * @returns {CategorySingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
post({
  constraintFields: ["name"],
  middleware: isAdmin,
});

/**
 * @route PUT /category/Update
 * @group Category - Operations about category
 * @param {CategoryUpdateDtoModel.model} data.body.required
 * @returns {CategorySingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
put({
  constraintFields: ["name"],
  middleware: isAdmin,
});

/**
 * @route GET /category
 * @group Category - Operations about category
 * @returns {Array.<CategoryGroupDtoModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
get();

/**
 * @route GET /category/{id}
 * @group Category - Operations about category
 * @param {string} id.params.required
 * @returns {CategorySingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.get("/:id", async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send(`Cannot get category by id ${req.params.id}`);
    }
    const result = await repo.getById(id);
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
 * @returns {Error}  401 - Wrong credentials
 */
router.post("/Delete", isAdmin, async function (req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send("All input is required");
    }

    const result = await repo.removeById({ id });
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
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/BatchDelete",
  isAdmin,
  async function (req: Request, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
        return res.status(400).send("All input is required");
      }

      const result = await repo.removeAllByIds({ ids });
      if (!result) {
        return res.status(400).send("Cannot delete categories");
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as categoryRouter };
