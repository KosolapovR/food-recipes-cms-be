import {
  ICategoryCreateDTO,
  ICategoryGroupDTO,
  ICategorySingleDTO,
  ICategoryUpdateDTO,
} from "./interface";

/**
 * @typedef CategorySingleDtoModel
 * @property {number} id.required
 * @property {string} name.required
 * @property {number} parentId
 * @property {Array<CategorySingleDtoModel>} subCategories
 */
export interface CategorySingleDtoModel {
  model: ICategorySingleDTO;
}

/**
 * @typedef CategoryGroupDtoModel
 * @property {number} id.required
 * @property {string} name.required
 * @property {number} parentId
 */
export interface CategoryGroupDtoModel {
  model: ICategoryGroupDTO;
}

/**
 * @typedef CategoryCreateDtoModel
 * @property {string} name.required
 * @property {number} parentId
 */
export interface CategoryCreateDtoModel {
  model: ICategoryCreateDTO;
}

/**
 * @typedef CategoryUpdateDtoModel
 * @property {number} id.required
 * @property {string} name.required
 * @property {number} parentId
 */
export interface CategoryUpdateDtoModel {
  model: ICategoryUpdateDTO;
}
