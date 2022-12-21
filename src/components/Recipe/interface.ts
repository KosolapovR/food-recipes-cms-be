import { RowDataPacket } from "mysql2";
import { IComment } from "../Comment/interface";

export interface IRecipeStep extends RowDataPacket {
  id: number;
  title?: string;
  text: string;
  imagePath?: string;
}

export type RecipeStatusType = "inactive" | "active";

export interface IRecipeSingle extends RowDataPacket {
  id: number;
  title: string;
  steps: IRecipeStep[];
  comments: IComment[];
  categoryId: string;
  status: RecipeStatusType;
  previewImagePath: string;
}
