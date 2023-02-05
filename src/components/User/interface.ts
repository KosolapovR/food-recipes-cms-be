import { RowDataPacket } from "mysql2";
import { ActivationUnionStatusType, CommonUpdateDTOType } from "../../types";

export interface IUserGroupDTO extends RowDataPacket {
  id: string;
  email: string;
  isAdmin?: boolean;
  status: ActivationUnionStatusType;
}

export interface IUserSingleDTO extends IUserGroupDTO {
  token: string;
}

export type IUserCreateDTO = Omit<IUserSingleDTO, "id" | "status" | "token"> & {
  password?: string;
};

export type IUserUpdateDTO = CommonUpdateDTOType<
  IUserCreateDTO & { status?: string }
>;
