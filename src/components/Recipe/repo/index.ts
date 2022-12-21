import { ResultSetHeader } from "mysql2/promise";

import { getConnection } from "../../../db_connection";
import {
  IBatchDeleteRecipeParams,
  ICreateRecipeParams,
  IDeleteRecipeParams,
  IUpdateRecipeParams,
} from "./types";
import { commentRepo } from "../../Comment/repo";
import { IFieldNameValue } from "../../../types";
import { IRecipeSingle, IRecipeStep } from "../interface";

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<IRecipeSingle[]>(
    `SELECT * FROM recipes WHERE recipes.id=?`,
    [id]
  );
  if (!rows) return rows;

  const recipe: IRecipeSingle | undefined = rows[0];
  if (!recipe) return recipe;

  const [steps] = await db.query<IRecipeStep[]>(
    `SELECT * FROM recipe_steps WHERE recipeId=?`,
    [id]
  );
  const comments = await commentRepo.getByField({
    fieldName: "recipeId",
    fieldValue: recipe.id,
  });
  recipe.steps = steps;
  recipe.comments = comments;
  return recipe;
};

const getAll = async () => {
  const db = await getConnection();
  const [recipes] = await db.query<IRecipeSingle[]>("SELECT * FROM recipes");
  for (const recipe of recipes) {
    const [steps] = await db.query<IRecipeStep[]>(
      `SELECT * FROM recipe_steps WHERE recipeId=?`,
      [recipe.id]
    );
    const comments = await commentRepo.getByField({
      fieldName: "recipeId",
      fieldValue: recipe.id,
    });
    recipe.steps = steps;
    recipe.comments = comments;
  }
  return recipes;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [recipes] = await db.query<IRecipeSingle[]>(
    `SELECT * FROM recipes WHERE ${fieldName}=?`,
    [fieldValue]
  );

  for (const recipe of recipes) {
    const [steps] = await db.query<IRecipeStep[]>(
      `SELECT * FROM recipe_steps WHERE recipeId=?`,
      [recipe.id]
    );
    const comments = await commentRepo.getByField({
      fieldName: "recipeId",
      fieldValue: recipe.id,
    });

    recipe.steps = steps;
    recipe.comments = comments;
  }
  return recipes;
};

const add = async ({
  title,
  steps,
  status,
  previewImagePath,
}: ICreateRecipeParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO recipes (title, previewImagePath, status) values (?, ?, ?)`,
    [title, previewImagePath, status]
  );
  for (const { title, text, imagePath } of steps) {
    await db.query<ResultSetHeader>(
      `INSERT INTO recipe_steps (recipeId, title, text, imagePath) values (?, ?, ?, ?)`,
      [result.insertId, title, text, imagePath]
    );
  }

  return await getById(result.insertId);
};

const update = async ({
  id,
  title,
  steps,
  previewImagePath,
  status,
}: IUpdateRecipeParams) => {
  const db = await getConnection();

  await db.query<ResultSetHeader>(
    `UPDATE recipes SET title=?, previewImagePath=?, status=? WHERE id=?`,
    [title, previewImagePath, status, id]
  );

  for (const { recipeId, id: stepId, imagePath, title, text } of steps) {
    if (recipeId) {
      await db.query<ResultSetHeader>(
        `UPDATE recipe_steps SET title=?, text=?, imagePath=? WHERE id=?`,
        [title, text, imagePath, stepId]
      );
    } else {
      await db.query<ResultSetHeader>(
        `INSERT INTO recipe_steps (recipeId, title, text, imagePath) values (?, ?, ?, ?)`,
        [id, title, text, imagePath]
      );
    }
  }
  return await getById(id);
};

const updateByField = async ({
  fieldName,
  fieldValue,
  id,
}: IFieldNameValue & { id: number }) => {
  const db = await getConnection();
  await db.query<ResultSetHeader>(
    `UPDATE recipes SET ${fieldName}=? WHERE id=?`,
    [fieldValue, id]
  );
  return await getById(id);
};

const removeById = async ({ id }: IDeleteRecipeParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM recipes WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: IBatchDeleteRecipeParams) => {
  const db = await getConnection();
  let deletedCount = 0;
  for (const id of ids) {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM recipes WHERE id=?`,
      [id]
    );
    if (result.affectedRows === 1) deletedCount++;
  }

  return deletedCount > 0;
};
const recipeRepo = {
  getById,
  getAll,
  getByField,
  add,
  update,
  updateByField,
  removeById,
  removeAllByIds,
};

export { recipeRepo };
