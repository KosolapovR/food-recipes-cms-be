import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IFieldNameValue {
  fieldName: string;
  fieldValue: string | number | boolean;
}

export type IRequest<InputType, OutputType> = Request<
  Record<string, unknown>,
  OutputType,
  InputType
>;

export type IRequestWithToken<InputType, OutputType> = IRequest<
  InputType,
  OutputType
> & {
  token?: string;
  user_id?: string;
};

export type CommonUpdateDTOType<T> = {
  id: string;
} & T;

export type CommonDeleteDTOType = {
  id: string;
};

export type CommonBatchDeleteDTOType = {
  ids: number[];
};

export type ActivationUnionStatusType = "active" | "inactive";

export type AppJwtPayload = JwtPayload & { user_id: string };
