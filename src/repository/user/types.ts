export interface ICreateUserParams {
  email: string;
  password: string;
  isAdmin?: boolean;
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
