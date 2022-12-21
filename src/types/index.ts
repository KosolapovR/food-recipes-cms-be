import { Request } from "express";

export interface IFieldNameValue {
  fieldName: string;
  fieldValue: string | number | boolean;
}

export interface IRequestWithToken extends Request {
  token?: string;
  user_id?: string;
}

export type CommonUpdateDTOType<T> = {
  id: number;
} & T;

export type CommonDeleteDTOType = {
  id: number;
};

export type CommonBatchDeleteDTOType = {
  ids: number[];
};
