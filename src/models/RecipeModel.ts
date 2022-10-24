import { IRecipe } from "../interfaces";
import { IRecipeStep } from "../interfaces/Recipe";

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
 * @property {string} previewImagePath.required
 * @property {Array.<RecipeStepModel>} steps
 */
export interface RecipeModel {
  model: IRecipe;
}
