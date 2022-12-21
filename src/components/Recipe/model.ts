import { IRecipeSingle, IRecipeStep } from "./interface";
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
 * @typedef RecipeSingleModel
 * @property {string} id.required
 * @property {string} title.required
 * @property {string} status
 * @property {string} previewImagePath.required
 * @property {string} categoryId.required
 * @property {Array.<RecipeStepModel>} steps
 * @property {Array.<CommentModel>} comments
 */
export interface RecipeSingleModel {
  model: IRecipeSingle;
}
