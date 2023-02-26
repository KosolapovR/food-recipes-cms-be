import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../db_connection";
import { commentRepo } from "../../Comment/repo";
import {
  CommonBatchDeleteDTOType,
  CommonDeleteDTOType,
  IFieldNameValue,
} from "../../../types";
import {
  IRecipeCreateDTO,
  IRecipeGroupDTO,
  IRecipeSingleDTO,
  IRecipeStep,
  IRecipeUpdateDTO,
} from "../interface";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "../../../consts";

const getById = async (id: string) => {
  const db = await getConnection();
  const [rows] = await db.query<IRecipeSingleDTO[]>(
    `SELECT * FROM recipes WHERE recipes.id=?`,
    [id]
  );
  if (!rows) return undefined;

  const recipe = rows[0];
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
  const [recipes] = await db.query<IRecipeGroupDTO[]>(
    "SELECT r.*, " +
      "sum(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) AS commentCount, " +
      "COUNT(l.id) AS likeCount " +
      "FROM recipes AS r " +
      "LEFT JOIN comments AS c ON r.id = c.recipeId " +
      "LEFT JOIN likes AS l ON r.id = l.recipeId " +
      "GROUP BY r.id"
  );
  return recipes;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();

  const [recipes] = await db.query<IRecipeGroupDTO[]>(
    `SELECT r.*, 
          SUM(CASE WHEN c.status = '${ACTIVE_STATUS}' THEN 1 ELSE 0 END) AS commentCount, 
          COUNT(l.id) AS likeCount 
          FROM recipes AS r 
          LEFT JOIN comments AS c ON r.id = c.recipeId 
          LEFT JOIN likes AS l ON r.id = l.recipeId 
          WHERE r.${fieldName}=? 
          GROUP BY r.id`,
    [fieldValue]
  );
  return recipes;
};

const add = async ({
  title,
  steps,
  previewImagePath,
  categoryId,
}: IRecipeCreateDTO) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO recipes (title, previewImagePath, categoryId, status) values (?, ?, ?, ?)`,
    [title, previewImagePath, categoryId, INACTIVE_STATUS]
  );
  for (const { title, text, imagePath } of steps) {
    await db.query<ResultSetHeader>(
      `INSERT INTO recipe_steps (recipeId, title, text, imagePath) values (?, ?, ?, ?)`,
      [result.insertId, title, text, imagePath]
    );
  }

  return await getById(result.insertId.toString());
};

const update = async ({
  id,
  title,
  steps,
  previewImagePath,
  categoryId,
  status,
}: IRecipeUpdateDTO) => {
  const db = await getConnection();

  await db.query<ResultSetHeader>(
    `UPDATE recipes SET title=?, previewImagePath=?, categoryId=?, status=? WHERE id=?`,
    [title, previewImagePath, categoryId, status, id]
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
}: IFieldNameValue & { id: string }) => {
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
