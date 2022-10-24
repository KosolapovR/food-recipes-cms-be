import { RowDataPacket } from "mysql2";

export interface IRecipeStep extends RowDataPacket {
  title?: string;
  text: string;
  imagePath?: string;
}

export interface IRecipe extends RowDataPacket {
  id: string;
  title: string;
  steps: IRecipeStep[];
  previewImagePath: string;
}
