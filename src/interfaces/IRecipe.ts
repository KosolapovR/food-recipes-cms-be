import { RowDataPacket } from "mysql2";
import { IComment } from "./IComment";

export interface IRecipeStep extends RowDataPacket {
  id: number;
  title?: string;
  text: string;
  imagePath?: string;
}

export interface IRecipe extends RowDataPacket {
  id: number;
  title: string;
  steps: IRecipeStep[];
  comments: IComment[];
  previewImagePath: string;
}
