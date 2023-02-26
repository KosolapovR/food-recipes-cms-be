import express, { Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { protectedRoute } from "../../middlewares";
import {
  AppJwtPayload,
  CommonDeleteDTOType,
  IRequest,
  IRequestWithToken,
} from "../../types";
import { ILikeCreateDTO, ILikeSingleDTO } from "./interface";
import { likeRepo } from "./repo";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /like/Create
 * @group Like - Operations about like
 * @param {LikeCreateDtoModel.model} data.body.required
 * @returns {LikeSingleDtoModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/Create",
  body("userId").not().isEmpty().trim(),
  body("recipeId").not().isEmpty().trim(),
  async function (
    req: IRequest<ILikeCreateDTO, ILikeSingleDTO>,
    res: Response
  ) {
    try {
      const { userId, recipeId } = req.body;

      if (!userId || !recipeId) {
        return res.status(400).send("All input is required");
      }

      const like = await likeRepo.add({
        userId,
        recipeId,
      });
      if (!like) {
        return res.status(400).send("Cannot add like");
      }

      return res.status(201).send({ data: like });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

/**
 * @route POST /like/Delete
 * @group Like - Operations about like
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
      const likeToDelete = await likeRepo.getById(id);

      if (likeToDelete && user_id !== likeToDelete.userId) {
        return res.status(400).send("Cannot delete other like");
      }

      const result = await likeRepo.removeById({ id });
      if (!result) {
        return res.status(400).send("Cannot delete like");
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

export { router as likeRouter };
