import { RowDataPacket } from "mysql2";
import { ActivationUnionStatusType, CommonUpdateDTOType } from "../../types";
import { IUserSingleDTO } from "../User/interface";
import { IRecipeSingleDTO } from "../Recipe/interface";

export interface ICommentSingleDTO extends RowDataPacket {
  id: string;
  text: string;
  status: ActivationUnionStatusType;
  date: string;
  userId: string;
  user: IUserSingleDTO;
  recipeId: string;
  recipe: IRecipeSingleDTO;
}

export interface ICommentGroupDTO
  extends Omit<ICommentSingleDTO, "user" | "recipe">,
    RowDataPacket {}

export type ICommentCreateDTO = Omit<
  ICommentSingleDTO,
  "id" | "status" | "date" | "user" | "recipe"
>;

export type ICommentUpdateDTO = CommonUpdateDTOType<
  ICommentCreateDTO & { status?: string }
>;
