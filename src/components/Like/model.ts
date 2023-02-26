import { ILikeSingleDTO, ILikeCreateDTO } from "./interface";

/**
 * @typedef LikeSingleDtoModel
 * @property {string} id.required
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface LikeSingleDtoModel {
  model: ILikeSingleDTO;
}

/**
 * @typedef LikeCreateDtoModel
 * @property {string} userId.required
 * @property {string} recipeId.required
 */
export interface LikeCreateDtoModel {
  model: ILikeCreateDTO;
}
