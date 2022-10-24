import { IRecipeStep } from "../../interfaces/Recipe";

export interface IAddRecipeParams {
  title: string;
  steps: IRecipeStep[];
  previewImagePath?: string;
}
