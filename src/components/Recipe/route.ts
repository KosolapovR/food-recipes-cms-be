import express, { Request, Response } from "express";
import { body } from "express-validator";

import { protectedRoute, isAdmin } from "../../middlewares";
import { CommonDeleteDTOType, IRequest, IRequestWithToken } from "../../types";
import { IRecipeSingleDTO, IRecipeUpdateDTO } from "./interface";
import { recipeRepo } from "./repo";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /recipe/Create
 * @group Recipe - Operations about recipe
 * @param {RecipeCreateDtoModel.model} data.body.required
 * @returns {RecipeSingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
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
 * @param {RecipeUpdateDtoModel.model} data.body.required
 * @returns {RecipeSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.put(
  "/Update",
  body("title").not().isEmpty().trim(),
  async function (
    req: IRequest<IRecipeUpdateDTO, IRecipeSingleDTO>,
    res: Response
  ) {
    try {
      const { id, title, steps, status, categoryId, previewImagePath } =
        req.body;

      if (!(title || steps || status || categoryId)) {
        return res.status(400).send("All input is required");
      }

      const recipe = await recipeRepo.update({
        id,
        title,
        steps,
        categoryId,
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
 * @returns {Array.<RecipeGroupDtoModel>} 200
 * @returns {Error}  400
 * @returns {Error}  401 - Wrong credentials
 */
router.get(
  "/",
  async function (req: IRequest<void, IRecipeSingleDTO>, res: Response) {
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
  }
);

/**
 * @route GET /recipe/{id}
 * @group Recipe - Operations about recipe
 * @param {string} id.params.required
 * @returns {RecipeSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
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
 * @returns {Error}  401 - Wrong credentials
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
 * @returns {RecipeSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Activate",
  isAdmin,
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, IRecipeSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
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
 * @returns {RecipeSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Deactivate",
  isAdmin,
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, IRecipeSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
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
