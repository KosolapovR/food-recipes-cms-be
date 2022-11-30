import { RecipeStatusType, IRecipeStep } from "../interface";

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
