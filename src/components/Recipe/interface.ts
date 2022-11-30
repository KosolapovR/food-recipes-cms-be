import { RowDataPacket } from "mysql2";
import { Interface } from "../interfaces";

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
  comments: Interface[];
  status: RecipeStatusType;
  previewImagePath: string;
}
