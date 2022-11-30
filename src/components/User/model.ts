import { IUser } from "./interface";

/**
 * @typedef UserModel
 * @property {string} id.required
 * @property {string} email
 * @property {string} token
 * @property {string} status
 */
export interface UserModel {
  model: IUser;
}
