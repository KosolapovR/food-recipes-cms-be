import { IRecipe, IRecipeStep } from "./interface";
/**
 * @typedef RecipeStepModel
 * @property {string} id.required
 * @property {string} title
 * @property {string} text.required
 * @property {string} imagePath
 */
export interface RecipeStepModel {
  model: IRecipeStep;
}

/**
 * @typedef RecipeModel
 * @property {string} id.required
 * @property {string} title.required
 * @property {string} status
 * @property {string} previewImagePath.required
 * @property {Array.<RecipeStepModel>} steps
 * @property {Array.<CommentModel>} comments
 */
export interface RecipeModel {
  model: IRecipe;
}
