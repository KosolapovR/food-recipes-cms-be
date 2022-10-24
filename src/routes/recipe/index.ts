// @ts-ignore
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { protectedRoute } from "../../middlewares/protectedRoute";

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
  body("steps").not().isEmpty().trim(),
  async function (req: Request, res: Response) {}
);

export { router as recipeRouter };
