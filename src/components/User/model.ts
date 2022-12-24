import {
  IUserSingleDTO,
  IUserGroupDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from "./interface";

/**
 * @typedef UserSingleDtoModel
 * @property {string} id.required
 * @property {string} email.required
 * @property {boolean} isAdmin
 * @property {string} token
 * @property {string} status
 */
export interface UserSingleDtoModel {
  model: IUserSingleDTO;
}

/**
 * @typedef UserGroupDtoModel
 * @property {string} id.required
 * @property {string} email.required
 * @property {boolean} isAdmin
 * @property {string} status
 */
export interface UserGroupDtoModel {
  model: IUserGroupDTO;
}

/**
 * @typedef UserCreateDtoModel
 * @property {string} email.required
 * @property {boolean} isAdmin
 * @property {string} password
 * @property {string} status
 */
export interface UserCreateDtoModel {
  model: IUserCreateDTO;
}

/**
 * @typedef UserUpdateDtoModel
 * @property {string} id.required
 * @property {string} email.required
 * @property {boolean} isAdmin
 * @property {string} password
 * @property {string} status
 */
export interface UserUpdateDtoModel {
  model: IUserUpdateDTO;
}
