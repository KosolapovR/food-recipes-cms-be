import { RowDataPacket } from "mysql2";
import { ICommentGroupDTO } from "../Comment/interface";
import { ActivationUnionStatusType, CommonUpdateDTOType } from "../../types";

export interface IRecipeStep extends RowDataPacket {
  id: string;
  title?: string;
  text: string;
  imagePath?: string;
}

export interface IRecipeGroupDTO extends RowDataPacket {
  id: string;
  title: string;
  categoryId: string;
  status: ActivationUnionStatusType;
  previewImagePath: string;
  commentCount: number;
  likeCount: number;
}

export interface IRecipeSingleDTO extends IRecipeGroupDTO {
  steps: IRecipeStep[];
  comments: ICommentGroupDTO[];
  isLiked?: boolean;
}

export type IRecipeCreateDTO = Omit<
  IRecipeSingleDTO,
  "id" | "comments" | "status" | "isLiked"
>;

export type IRecipeUpdateDTO = CommonUpdateDTOType<
  IRecipeCreateDTO & { status?: string; isLiked?: string }
>;
