import { ResultSetHeader } from "mysql2/promise";
import { IRecipe } from "../../interfaces";
import { IRecipeStep } from "../../interfaces/Recipe";
import { getConnection } from "../../db_connection";
import { IFieldNameValue } from "../types";
import {
  IBatchDeleteRecipeParams,
  ICreateRecipeParams,
  IDeleteRecipeParams,
  IUpdateRecipeParams,
} from "./types";

const getById = async (id: number) => {
  const db = await getConnection();
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

const getAll = async () => {
  const db = await getConnection();
  const [recipes] = await db.query<IRecipe[]>("SELECT * FROM recipes");
  for (let i = 0; i < recipes.length; i++) {
    const [steps] = await db.query<IRecipeStep[]>(
      `SELECT * FROM recipe_steps WHERE recipe_id=${recipes[i].id}`
    );
    recipes[i].steps = steps;
  }
  return recipes;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
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

const add = async ({ title, steps, previewImagePath }: ICreateRecipeParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO recipes (title, previewImagePath) values ('${title}', '${previewImagePath}')`
  );
  for (let i = 0; i < steps.length; i++) {
    await db.query<ResultSetHeader>(
      `INSERT INTO recipe_steps (recipe_id, title, text, imagePath) values ('${result.insertId}', '${steps[i].title}', '${steps[i].text}', '${steps[i].imagePath}')`
    );
  }
  return await getById(result.insertId);
};

const update = async ({
  id,
  title,
  steps,
  previewImagePath,
}: IUpdateRecipeParams) => {
  const db = await getConnection();

  await db.query<ResultSetHeader>(
    `UPDATE recipes SET title='${title}', previewImagePath='${previewImagePath}' WHERE id=${id}`
  );

  for (let i = 0; i < steps.length; i++) {
    await db.query<ResultSetHeader>(
      `UPDATE recipe_steps SET title='${steps[i].title}', text='${steps[i].text}', imagePath='${steps[i].imagePath}' WHERE id=${steps[i].id}`
    );
  }
  return await getById(id);
};

const removeById = async ({ id }: IDeleteRecipeParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM recipes WHERE id=${id}`
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: IBatchDeleteRecipeParams) => {
  const db = await getConnection();
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
