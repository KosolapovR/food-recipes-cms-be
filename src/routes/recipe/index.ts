// @ts-ignore
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { protectedRoute } from "../../middlewares/protectedRoute";
import { Connection } from "mysql2/promise";

import { getRepository } from "../../repository";
import { errorLog } from "../../utils";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /recipe/Create
 * @group Recipe - Operations about recipe
 * @param {string} title.body.required
 * @param {string} previewImagePath.body
 * @param {Array.<RecipeStepModel>} steps.body.required
 * @returns {RecipeModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Create",
  body("title").not().isEmpty().trim(),
  async function (req: Request, res: Response) {
    try {
      const { title, steps, previewImagePath } = req.body;

      if (!(title && steps)) {
        res.status(400).send("All input is required");
      }

      const db: Connection = req.app.get("db");
      const { recipes } = getRepository(db);
      const recipe = await recipes.add({
        title,
        steps,
        previewImagePath,
      });
      if (!recipe) {
        errorLog("Cannot add recipe", recipe);
        res.status(400).send("Cannot add recipe");
      }

      res.status(201).send({ data: recipe });
    } catch (err) {
      errorLog(err);
    }
  }
);

/**
 * @route PUT /recipe/Update
 * @group Recipe - Operations about recipe
 * @param {number} id.body.required
 * @param {string} title.body.required
 * @param {string} image.body
 * @param {Array.<RecipeStepModel>} steps.body.required
 * @returns {RecipeModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.put(
  "/Update",
  body("title").not().isEmpty().trim(),
  async function (req: Request, res: Response) {
    try {
      const { id, title, steps, previewImagePath } = req.body;

      if (!(title && steps)) {
        res.status(400).send("All input is required");
      }

      const db: Connection = req.app.get("db");
      const { recipes } = getRepository(db);
      const recipe = await recipes.update({
        id,
        title,
        steps,
        previewImagePath,
      });
      if (!recipe) {
        errorLog("Cannot update recipe", recipe);
        res.status(400).send("Cannot update recipe");
      }

      res.status(200).send({ data: recipe });
    } catch (err) {
      errorLog(err);
    }
  }
);

/**
 * @route GET /recipe/GetPage
 * @group Recipe - Operations about recipe
 * @returns {Array.<RecipeModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/GetPage", async function (req: Request, res: Response) {
  try {
    const db: Connection = req.app.get("db");
    const { recipes } = getRepository(db);
    const result = await recipes.getAll();
    if (!result) {
      errorLog("Cannot get recipes", result);
      res.status(400).send("Cannot get recipes");
    }

    res.status(201).send({ data: result });
  } catch (err) {
    errorLog(err);
  }
});

/**
 * @route POST /recipe/Delete
 * @group Recipe - Operations about recipe
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

    const db: Connection = req.app.get("db");
    const { recipes } = getRepository(db);
    const result = await recipes.removeById({ id });
    if (!result) {
      res.status(400).send("Cannot delete recipe");
    }

    res.status(204).send();
  } catch (err) {
    errorLog(err);
  }
});

/**
 * @route POST /recipe/BatchDelete
 * @group Recipe - Operations about recipe
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

    const db: Connection = req.app.get("db");
    const { recipes } = getRepository(db);
    errorLog("ids", ids);
    console.log("ids", ids);
    const result = await recipes.removeAllByIds({ ids });
    if (!result) {
      res.status(400).send("Cannot delete recipes");
    }

    res.status(204).send();
  } catch (err) {
    errorLog(err);
  }
});

export { router as recipeRouter };
