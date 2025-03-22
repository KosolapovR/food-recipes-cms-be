import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { protectedRoute, isAdmin } from "../../middlewares";
import {
  AppJwtPayload,
  CommonDeleteDTOType,
  IRequest,
  IRequestWithToken,
} from "../../types";
import { commentRepo as repo } from "../Comment/repo";
import { createRouteGenerator } from "../../route_generator";
import {
  ICommentCreateDTO,
  ICommentGroupDTO,
  ICommentSingleDTO,
  ICommentUpdateDTO,
} from "./interface";

const router = express.Router();

router.use(protectedRoute);

const generatorParams = { router, repo, entityName: "comment" };
const { get, post, put } = createRouteGenerator<
  ICommentCreateDTO,
  ICommentUpdateDTO,
  ICommentSingleDTO,
  ICommentGroupDTO
>(generatorParams);

const constraintFields = ["text", "userId", "recipeId"];
/**
 * @route POST /comment/Create
 * @group Comment - Operations about comment
 * @param {CommentCreateDtoModel.model} data.body.required
 * @returns {CommentSingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
post({ constraintFields });

/**
 * @route PUT /category/Update
 * @group Category - Operations about category
 * @param {CategoryUpdateDtoModel.model} data.body.required
 * @returns {CategorySingleDtoModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
put({ constraintFields });

/**
 * @route GET /comment
 * @group Comment - Operations about comment
 * @returns {Array.<CommentGroupDtoModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
get();

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
    const { id } = req.params;
    if (!id) {
      return res.status(400).send(`Cannot get comment by id ${req.params.id}`);
    }
    const result = await repo.getById(id);
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
router.post(
  "/Delete",
  async function (
    req: IRequestWithToken<CommonDeleteDTOType, any>,
    res: Response
  ) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).send("All input is required");
      }
      const jwtPayload = jwt.decode(req.token) as AppJwtPayload;
      if (!jwtPayload) return res.status(404).send({});

      const { user_id } = jwtPayload;
      const commentToDelete = await repo.getById(id);

      if (commentToDelete && user_id !== commentToDelete.userId) {
        return res.status(400).send("Cannot delete other comment");
      }

      const result = await repo.removeById({ id });
      if (!result) {
        return res.status(400).send("Cannot delete comment");
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

/**
 * @route POST /comment/BatchDelete
 * @group Comment - Operations about comment
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
        return res.status(400).send("Cannot delete comment");
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

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

      const activatedComment = await repo.updateByField({
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

      const deactivatedComment = await repo.updateByField({
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
