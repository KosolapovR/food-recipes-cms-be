import express, { Request, Response } from "express";
import { body } from "express-validator";

import { protectedRoute } from "../../middlewares/protectedRoute";
import { commentRepo } from "../../repository";
import { errorLog } from "../../utils";

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
  async function (req: Request, res: Response) {
    try {
      const { text, userId, recipeId } = req.body;

      if (!(text && userId && recipeId)) {
        res.status(400).send("All input is required");
      }

      const comment = await commentRepo.add({
        text,
        userId,
        recipeId,
        date: new Date(),
        status: "hidden",
      });
      if (!comment) {
        errorLog("Cannot add comment", comment);
        res.status(400).send("Cannot add comment");
      }

      res.status(201).send({ data: comment });
    } catch (err) {
      errorLog(err);
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
        res.status(400).send("All input is required");
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
        errorLog("Cannot update comment", comment);
        res.status(400).send("Cannot update comment");
      }

      res.status(200).send({ data: comment });
    } catch (err) {
      errorLog(err);
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
      errorLog("Cannot get comments", result);
      res.status(400).send("Cannot get comments");
    }

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
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
      res.status(400).send("All input is required");
    }

    const result = await commentRepo.removeById({ id });
    if (!result) {
      res.status(400).send("Cannot delete comment");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
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
      res.status(400).send("All input is required");
    }

    const result = await commentRepo.removeAllByIds({ ids });
    if (!result) {
      res.status(400).send("Cannot delete comment");
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error });
    errorLog(error);
  }
});

export { router as commentRouter };
