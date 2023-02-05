import {
  ICommentCreateDTO,
  ICommentGroupDTO,
  ICommentSingleDTO,
  ICommentUpdateDTO,
} from "./interface";

/**
 * @typedef CommentSingleDtoModel
 * @property {string} id.required
 * @property {string} text.required
 * @property {string} status
 * @property {string} date
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface CommentSingleDtoModel {
  model: ICommentSingleDTO;
}

/**
 * @typedef CommentGroupDtoModel
 * @property {string} id.required
 * @property {string} text.required
 * @property {string} status
 * @property {string} date
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface CommentGroupDtoModel {
  model: ICommentGroupDTO;
}

/**
 * @typedef CommentCreateDtoModel
 * @property {string} text.required
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface CommentCreateDtoModel {
  model: ICommentCreateDTO;
}

/**
 * @typedef CommentCreateDtoModel
 * @property {string} id.required
 * @property {string} text.required
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface CommentUpdateDtoModel {
  model: ICommentUpdateDTO;
}
