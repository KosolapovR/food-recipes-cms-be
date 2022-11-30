import { Request } from "express";

export interface IFieldNameValue {
  fieldName: string;
  fieldValue: string | number | boolean;
}

export interface IRequestWithToken extends Request {
  token?: string;
  user_id?: string;
}
