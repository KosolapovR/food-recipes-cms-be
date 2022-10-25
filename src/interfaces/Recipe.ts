import { RowDataPacket } from "mysql2";

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
  previewImagePath: string;
}
