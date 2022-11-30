import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { IRequestWithToken } from "../../types";
import { recipeRepo } from "./repo";
import { userRepo } from "../User/repo";

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
        return res.status(400).send("Required fields: title, steps");
      }

      const recipe = await recipeRepo.add({
        title,
        steps,
        previewImagePath,
        status: "inactive",
      });
      if (!recipe) {
        return res.status(400).send("Cannot add recipe");
      }

      return res.status(201).send({ data: recipe });
    } catch (error) {
      return res.status(500).json({ error: error });
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
      const { id, title, steps, status, previewImagePath } = req.body;

      if (!(title && steps && status)) {
        return res.status(400).send("All input is required");
      }

      const recipe = await recipeRepo.update({
        id,
        title,
        steps,
        previewImagePath,
        status,
      });
      if (!recipe) {
        return res.status(400).send("Cannot update recipe");
      }

      return res.status(200).send({ data: recipe });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route GET /recipe
 * @group Recipe - Operations about recipe
 * @returns {Array.<RecipeModel>} 200
 * @returns {Error}  400
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/", async function (req: Request, res: Response) {
  const { status } = req.query;
  try {
    let result;
    if (status) {
      result = await recipeRepo.getByField({
        fieldName: "status",
        fieldValue: status as string,
      });
    } else {
      result = await recipeRepo.getAll();
    }

    if (!result) {
      return res.status(400).send("Cannot get recipes");
    }
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route GET /recipe/{id}
 * @param {string} id.params.required
 * @group Recipe - Operations about recipe
 * @returns {RecipeModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).send(`Cannot get recipe by id ${req.params.id}`);
    }
    const result = await recipeRepo.getById(id);
    if (!result) {
      return res.status(400).send("Cannot get recipe");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send("All input is required");
    }

    const result = await recipeRepo.removeById({ id });
    if (!result) {
      return res.status(400).send("Cannot delete recipe");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(400).send("All input is required");
    }

    const result = await recipeRepo.removeAllByIds({ ids });
    if (!result) {
      return res.status(400).send("Cannot delete recipes");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /recipe/Activate
 * @group Recipe - Operations about recipe
 * @param {number} id.body.required
 * @returns {RecipeModel.model} 200
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

      const activatedRecipe = await recipeRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "active",
      });

      if (!activatedRecipe) {
        return res.status(400).send("Cannot activate recipe");
      }

      return res.status(200).send({ data: activatedRecipe });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route POST /recipe/Deactivate
 * @group Recipe - Operations about recipe
 * @param {number} id.body.required
 * @returns {RecipeModel.model} 200
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

      const deactivatedRecipe = await recipeRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "inactive",
      });

      if (!deactivatedRecipe) {
        return res.status(400).send("Cannot deactivate recipe");
      }

      return res.status(200).send({ data: deactivatedRecipe });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as recipeRouter };
