import { IComment } from "../interfaces";

/**
 * @typedef CommentModel
 * @property {string} id.required
 * @property {string} text.required
 * @property {string} status
 * @property {string} date
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface CommentModel {
  model: IComment;
}
