import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../db_connection";
import { commentRepo } from "../../Comment/repo";
import {
  CommonBatchDeleteDTOType,
  CommonDeleteDTOType,
  IFieldNameValue,
} from "../../../types";
import {
  IRecipeSingleDTO,
  IRecipeStep,
  IRecipeGroupDTO,
  IRecipeCreateDTO,
  IRecipeUpdateDTO,
} from "../interface";
import { INACTIVE_STATUS } from "../../../consts";

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<IRecipeSingleDTO[]>(
    `SELECT * FROM recipes WHERE recipes.id=?`,
    [id]
  );
  if (!rows) return rows;

  const recipe: IRecipeSingleDTO | undefined = rows[0];
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
  const [recipes] = await db.query<IRecipeGroupDTO[]>("SELECT * FROM recipes");
  return recipes;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [recipes] = await db.query<IRecipeSingleDTO[]>(
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

const add = async ({ title, steps, previewImagePath }: IRecipeCreateDTO) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO recipes (title, previewImagePath, status) values (?, ?, ?)`,
    [title, previewImagePath, INACTIVE_STATUS]
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
}: IRecipeUpdateDTO) => {
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

const removeById = async ({ id }: CommonDeleteDTOType) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM recipes WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: CommonBatchDeleteDTOType) => {
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
