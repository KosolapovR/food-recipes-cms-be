import { IRecipe } from "../../interfaces";
import { Connection, ResultSetHeader } from "mysql2/promise";
import { IFieldNameValue } from "../types";
import {
  IBatchDeleteRecipeParams,
  ICreateRecipeParams,
  IDeleteRecipeParams,
  IUpdateRecipeParams,
} from "./types";
import { IRecipeStep } from "../../interfaces/Recipe";

const getById = (db: Connection) => async (id: number) => {
  const [rows] = await db.query<IRecipe[]>(
    `SELECT * FROM recipes WHERE recipes.id=${id}`
  );
  if (!rows) return rows;

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

const getByField =
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
  async ({ title, steps, previewImagePath }: ICreateRecipeParams) => {
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

const update =
  (db: Connection) =>
  async ({ id, title, steps, previewImagePath }: IUpdateRecipeParams) => {
    await db.query<ResultSetHeader>(
      `UPDATE recipes SET title='${title}', previewImagePath='${previewImagePath}' WHERE id=${id}`
    );

    for (let i = 0; i < steps.length; i++) {
      await db.query<ResultSetHeader>(
        `UPDATE recipe_steps SET title='${steps[i].title}', text='${steps[i].text}', imagePath='${steps[i].imagePath}' WHERE id=${steps[i].id}`
      );
    }
    return await getById(db)(id);
  };

const removeById =
  (db: Connection) =>
  async ({ id }: IDeleteRecipeParams) => {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM recipes WHERE id=${id}`
    );
    return result.affectedRows === 1;
  };

const removeAllByIds =
  (db: Connection) =>
  async ({ ids }: IBatchDeleteRecipeParams) => {
    let deletedCount = 0;
    for (let i = 0; i < ids.length; i++) {
      const [result] = await db.query<ResultSetHeader>(
        `DELETE FROM recipes WHERE id=${ids[i]}`
      );
      if (result.affectedRows === 1) deletedCount++;
    }

    return deletedCount > 0;
  };

export { getById, getAll, getByField, add, update, removeById, removeAllByIds };
