import { IRecipeStep } from "../../interfaces";
import { RecipeStatusType } from "../../interfaces/IRecipe";

export interface ICreateRecipeParams {
  title: string;
  steps: IRecipeStep[];
  previewImagePath?: string;
  status: RecipeStatusType;
}

export interface IUpdateRecipeParams extends ICreateRecipeParams {
  id: number;
}

export interface IDeleteRecipeParams {
  id: number;
}

export interface IBatchDeleteRecipeParams {
  ids: number[];
}
