import { RowDataPacket } from "mysql2";
import { IComment } from "../Comment/interface";

export interface IRecipeStep extends RowDataPacket {
  id: number;
  title?: string;
  text: string;
  imagePath?: string;
}

export type RecipeStatusType = "inactive" | "active";

export interface IRecipe extends RowDataPacket {
  id: number;
  title: string;
  steps: IRecipeStep[];
  comments: IComment[];
  status: RecipeStatusType;
  previewImagePath: string;
}
