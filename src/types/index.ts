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

type GetByIdRepoType<T> = (id: string) => Promise<T>;
type GetAllRepoType<T> = () => Promise<T[]>;
type GetByFieldRepoType<T> = ({
  fieldName,
  fieldValue,
}: IFieldNameValue) => Promise<T[]>;
type AddRepoType<CreateDTO, SingleDTO> = (
  body: CreateDTO
) => Promise<SingleDTO>;
type UpdateRepoType<UpdateDTO, SingleDTO> = (
  body: UpdateDTO
) => Promise<SingleDTO>;
type UpdateSpecificFieldType = IFieldNameValue & { id: string };
type UpdateByFieldRepoType<UpdateSpecificFieldType, SingleDTO> = (
  body: UpdateSpecificFieldType
) => Promise<SingleDTO>;

export interface ICommonRepo<CreateDTO, UpdateDTO, SingleDTO, GroupDTO> {
  getById: GetByIdRepoType<SingleDTO>;
  getAll: GetAllRepoType<GroupDTO>;
  getByField: GetByFieldRepoType<GroupDTO>;
  add: AddRepoType<CreateDTO, SingleDTO>;
  update: UpdateRepoType<UpdateDTO, SingleDTO>;
  updateByField: UpdateByFieldRepoType<UpdateSpecificFieldType, SingleDTO>;
  removeById: any;
  removeAllByIds: any;
}
