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
 * @route POST /recipe
 * @group Recipe - Operations about recipe
 * @param {string} title.body.required
 * @param {string} image.body
 * @param {Array.<RecipeStepModel>} steps.body.required
 * @returns {RecipeModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/",
  body("title").not().isEmpty().trim(),
  async function (req: Request, res: Response) {
    try {
      const { title, steps, imagePath } = req.body;

      if (!(title && steps)) {
        res.status(400).send("All input is required");
      }

      const db: Connection = req.app.get("db");
      const { recipes } = getRepository(db);
      const recipe = await recipes.add({
        title,
        steps,
        previewImagePath: imagePath,
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
 * @route GET /recipe
 * @group Recipe - Operations about recipe
 * @returns {Array.<RecipeModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/", async function (req: Request, res: Response) {
  try {
    const db: Connection = req.app.get("db");
    const { recipes } = getRepository(db);
    const result = await recipes.getAll();
    if (!res) {
      errorLog("Cannot add recipe", result);
      res.status(400).send("Cannot add recipe");
    }

    res.status(201).send({ data: result });
  } catch (err) {
    errorLog(err);
  }
});

export { router as recipeRouter };
