export interface IRecipeStep {
  title?: string;
  text: string;
  imagePath?: string;
}

export interface IRecipe {
  id: string;
  title: string;
  steps: IRecipeStep[];
  previewImagePath: string;
}
