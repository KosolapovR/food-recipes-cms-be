import { UserStatusType } from "../interface";

export interface ICreateUserParams {
  email: string;
  password: string;
  isAdmin?: boolean;
  status: UserStatusType;
}

export interface IUpdateUserParams extends ICreateUserParams {
  id: number;
}

export interface IDeleteUserParams {
  id: number;
}

export interface IBatchDeleteUserParams {
  ids: number[];
}
