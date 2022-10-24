import { IRecipe } from "../../interfaces";
import { Connection, ResultSetHeader } from "mysql2/promise";
import { IFieldNameValue } from "../types";
import { IAddRecipeParams } from "./types";
import { IRecipeStep } from "../../interfaces/Recipe";

const getById = (db: Connection) => async (id: number) => {
  const [rows] = await db.query<IRecipe[]>(
    `SELECT * FROM recipes WHERE recipes.id=${id}`
  );
  const recipe: IRecipe = rows[0];
  const [steps] = await db.query<IRecipeStep[]>(
    `SELECT * FROM recipe_steps WHERE recipe_id=${id}`
  );

  recipe.steps = steps;
  return recipe;
};

const getAll = (db: Connection) => async () => {
  const [recipes] = await db.query<IRecipe[]>("SELECT * FROM recipes");
  for (let i = 0; i < recipes.length; i++) {
    const [steps] = await db.query<IRecipeStep[]>(
      `SELECT * FROM recipe_steps WHERE recipe_id=${recipes[i].id}`
    );
    recipes[i].steps = steps;
  }
  return recipes;
};

const getAllByField =
  (db: Connection) =>
  async ({ fieldName, fieldValue }: IFieldNameValue) => {
    const [recipes] = await db.query<IRecipe[]>(
      `SELECT * FROM recipes WHERE ${fieldName}='${fieldValue}`
    );

    for (let i = 0; i < recipes.length; i++) {
      const [steps] = await db.query<IRecipeStep[]>(
        `SELECT * FROM recipe_steps WHERE recipe_id=${recipes[i].id}`
      );
      recipes[i].steps = steps;
    }
    return recipes;
  };

const add =
  (db: Connection) =>
  async ({ title, steps, previewImagePath }: IAddRecipeParams) => {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO recipes (title, previewImagePath) values ('${title}', '${previewImagePath}')`
    );
    for (let i = 0; i < steps.length; i++) {
      await db.query<ResultSetHeader>(
        `INSERT INTO recipe_steps (recipe_id, title, text, imagePath) values ('${result.insertId}', '${steps[i].title}', '${steps[i].text}', '${steps[i].imagePath}')`
      );
    }
    return await getById(db)(result.insertId);
  };

export { getById, getAll, getAllByField, add };
