export interface ICreateUserParams {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface IUpdateUserParams extends Omit<ICreateUserParams, "password"> {
  id: number;
}

export interface IDeleteUserParams {
  id: number;
}

export interface IBatchDeleteUserParams {
  ids: number[];
}
