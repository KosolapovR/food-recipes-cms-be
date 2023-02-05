import {
  IRecipeGroupDTO,
  IRecipeSingleDTO,
  IRecipeStep,
  IRecipeUpdateDTO,
} from "./interface";
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
 * @typedef RecipeSingleDtoModel
 * @property {string} id.required
 * @property {string} title.required
 * @property {string} status
 * @property {string} previewImagePath.required
 * @property {string} categoryId.required
 * @property {Array.<RecipeStepModel>} steps
 * @property {Array.<CommentSingleDtoModel>} comments
 */
export interface RecipeSingleDtoModel {
  model: IRecipeSingleDTO;
}

/**
 * @typedef RecipeGroupDtoModel
 * @property {string} id.required
 * @property {string} title.required
 * @property {string} status
 * @property {string} previewImagePath.required
 * @property {string} categoryId.required
 */
export interface RecipeGroupDtoModel {
  model: IRecipeGroupDTO;
}

/**
 * @typedef RecipeCreateDtoModel
 * @property {string} title.required
 * @property {string} previewImagePath.required
 * @property {string} categoryId.required
 * @property {Array.<RecipeStepModel>} steps
 */
export interface RecipeCreateDtoModel {
  model: IRecipeSingleDTO;
}

/**
 * @typedef RecipeUpdateDtoModel
 * @property {string} id.required
 * @property {string} title.required
 * @property {string} previewImagePath.required
 * @property {string} categoryId.required
 * @property {Array.<RecipeStepModel>} steps
 */
export interface RecipeUpdateDtoModel {
  model: IRecipeUpdateDTO;
}
