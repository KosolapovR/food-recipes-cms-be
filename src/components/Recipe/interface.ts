import { RowDataPacket } from "mysql2";
import { ICommentSingleDTO } from "../Comment/interface";
import { ActivationUnionStatusType, CommonUpdateDTOType } from "../../types";

export interface IRecipeStep extends RowDataPacket {
  id: number;
  title?: string;
  text: string;
  imagePath?: string;
}

export interface IRecipeGroupDTO extends RowDataPacket {
  id: number;
  title: string;
  categoryId: string;
  status: ActivationUnionStatusType;
  previewImagePath: string;
}

export interface IRecipeSingleDTO extends IRecipeGroupDTO {
  steps: IRecipeStep[];
  comments: ICommentSingleDTO[];
}

export type IRecipeCreateDTO = Omit<
  IRecipeSingleDTO,
  "id" | "comments" | "status"
>;

export type IRecipeUpdateDTO = CommonUpdateDTOType<
  IRecipeCreateDTO & { status?: string }
>;
