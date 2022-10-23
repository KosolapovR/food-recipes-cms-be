import {IUser} from "../interfaces/User";
/**
 * @typedef UserModel
 * @property {string} id.required
 * @property {string} email
 * @property {string} token
 */
export interface UserModel {
    model: IUser
}
