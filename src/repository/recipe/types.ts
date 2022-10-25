import { IRecipeStep } from "../../interfaces/Recipe";

export interface ICreateRecipeParams {
  title: string;
  steps: IRecipeStep[];
  previewImagePath?: string;
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
