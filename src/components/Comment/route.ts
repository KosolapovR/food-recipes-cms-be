import express, { Request, Response } from "express";
import { body } from "express-validator";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { IRequestWithToken } from "../../types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { commentRepo } from "./repo";
import { userRepo } from "../User/repo";
import { IComment } from "./interface";
import { ICreateCommentParams } from "./repo/types";

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /comment/Create
 * @group Comment - Operations about comment
 * @param {string} text.body.required
 * @param {number} userId.body.required
 * @param {number} recipeId.body.required
 * @returns {CommentModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Create",
  body("text").not().isEmpty().trim(),
  body("userId").not().isEmpty().trim(),
  body("recipeId").not().isEmpty().trim(),
  async function (
    req: Request<{}, IComment, Partial<ICreateCommentParams>>,
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
        date: new Date(),
        status: "inactive",
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
 * @route PUT /comment/Update
 * @group Comment - Operations about comment
 * @param {number} id.body.required
 * @param {string} text.body.required
 * @param {number} userId.body.required
 * @param {number} recipeId.body.required
 * @returns {CommentModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.put(
  "/Update",
  body("text").not().isEmpty().trim(),
  async function (req: Request, res: Response) {
    try {
      const { id, text, userId, recipeId, date, status } = req.body;

      if (!(text && userId && recipeId)) {
        return res.status(400).send("All input is required");
      }

      const comment = await commentRepo.update({
        id,
        text,
        userId,
        recipeId,
        date,
        status,
      });
      if (!comment) {
        return res.status(400).send("Cannot update comment");
      }

      return res.status(200).send({ data: comment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

/**
 * @route GET /comment
 * @group Comment - Operations about comment
 * @returns {Array.<CommentModel>} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
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
 * @route POST /comment/Delete
 * @group Comment - Operations about comment
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
 * @returns {Error}  403 - Wrong credentials
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
 * @returns {CommentModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Activate",
  async function (req: IRequestWithToken, res: Response) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
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
 * @returns {CommentModel.model} 200
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post(
  "/Deactivate",
  async function (req: IRequestWithToken, res: Response) {
    try {
      const { id } = req.body;

      if (!id || !req.token) {
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
