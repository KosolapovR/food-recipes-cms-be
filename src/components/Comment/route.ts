import express, { Request, Response } from "express";
import { body } from "express-validator";

import { protectedRoute, isAdmin } from "../../middlewares";
import { CommonDeleteDTOType, IRequest, IRequestWithToken } from "../../types";
import { commentRepo } from "./repo";
import { userRepo } from "../User/repo";
import { ICommentCreateDTO, ICommentSingleDTO } from "./interface";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /comment/Create
 * @group Comment - Operations about comment
 * @param {CommentCreateDtoModel.model} data.body.required
 * @returns {CommentSingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Create",
  body("text").not().isEmpty().trim(),
  body("userId").not().isEmpty().trim(),
  body("recipeId").not().isEmpty().trim(),
  async function (
    req: IRequest<ICommentCreateDTO, ICommentSingleDTO>,
    res: Response
  ) {
    try {
      const { text, userId, recipeId } = req.body;

      if (!text || !userId || !recipeId) {
        return res.status(400).send("All input is required");
      }

      const comment = await commentRepo.add({
        text,
        userId,
        recipeId,
      });
      if (!comment) {
        return res.status(400).send("Cannot add comment");
      }

      return res.status(201).send({ data: comment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

/**
 * @route GET /comment
 * @group Comment - Operations about comment
 * @returns {Array.<CommentGroupDtoModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.get("/", async function (req: Request, res: Response) {
  try {
    const result = await commentRepo.getAll();
    if (!result) {
      return res.status(400).send("Cannot get comments");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 * @route GET /comment/{id}
 * @group Comment - Operations about comment
 * @param {string} id.params.required
 * @returns {CommentSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).send(`Cannot get comment by id ${req.params.id}`);
    }
    const result = await commentRepo.getById(id);
    if (!result) {
      return res.status(400).send("Cannot get comment");
    }

    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /comment/Delete
 * @group Comment - Operations about comment
 * @param {number} id.body.required
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

    const result = await commentRepo.removeById({ id });
    if (!result) {
      return res.status(400).send("Cannot delete comment");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /comment/BatchDelete
 * @group Comment - Operations about comment
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

    const result = await commentRepo.removeAllByIds({ ids });
    if (!result) {
      return res.status(400).send("Cannot delete comment");
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * @route POST /comment/Activate
 * @group Comment - Operations about comment
 * @param {number} id.body.required
 * @returns {CommentSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Activate",
  isAdmin,
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, ICommentSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
      }

      const activatedComment = await commentRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "active",
      });

      if (!activatedComment) {
        return res.status(400).send("Cannot activate comment");
      }

      return res.status(200).send({ data: activatedComment });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route POST /comment/Deactivate
 * @group Comment - Operations about comment
 * @param {number} id.body.required
 * @returns {CommentSingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Deactivate",
  isAdmin,
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, ICommentSingleDTO>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
        return res.status(400).send("All input is required");
      }

      const deactivatedComment = await userRepo.updateByField({
        id,
        fieldName: "status",
        fieldValue: "inactive",
      });

      if (!deactivatedComment) {
        return res.status(400).send("Cannot deactivate comment");
      }

      return res.status(200).send({ data: deactivatedComment });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as commentRouter };
