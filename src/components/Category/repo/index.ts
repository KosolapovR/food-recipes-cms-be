import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../db_connection";
import {
  CommonBatchDeleteDTOType,
  CommonDeleteDTOType,
  IFieldNameValue,
} from "../../../types";
import {
  ICategoryCreateDTO,
  ICategoryGroupDTO,
  ICategorySingleDTO,
  ICategoryUpdateDTO,
} from "../interface";

const getAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query<ICategoryGroupDTO[]>(
    "SELECT * FROM categories"
  );
  return rows;
};

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<ICategorySingleDTO[]>(
    `SELECT * FROM categories WHERE id=?`,
    [id]
  );
  const category: ICategorySingleDTO | undefined = rows[0];

  const [subCategories] = await db.query<ICategorySingleDTO[]>(
    `SELECT * FROM categories WHERE parentId=?`,
    [id]
  );
  category.subCategories = subCategories;
  return category;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [rows] = await db.query<ICategorySingleDTO[]>(
    `SELECT * FROM categories WHERE ${fieldName}=?`,
    [fieldValue]
  );
  return rows;
};

const add = async ({ name, parentId }: ICategoryCreateDTO) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO categories (name, parentId) values (?, ?)`,
    [name, parentId]
  );

  return await getById(result.insertId);
};

const update = async ({ id, name, parentId }: ICategoryUpdateDTO) => {
  const db = await getConnection();
  await db.query<ResultSetHeader>(
    `UPDATE categories SET name=?, parentId=? WHERE id=?`,
    [name, parentId, id]
  );

  return await getById(id);
};

const updateByField = async ({
  fieldName,
  fieldValue,
  id,
}: IFieldNameValue & { id: number }) => {
  const db = await getConnection();
  await db.query<ResultSetHeader>(
    `UPDATE categories SET ${fieldName}=? WHERE id=?`,
    [fieldValue, id]
  );
  return await getById(id);
};

const removeById = async ({ id }: CommonDeleteDTOType) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM categories WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: CommonBatchDeleteDTOType) => {
  const db = await getConnection();
  let deletedCount = 0;
  for (const id of ids) {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM categories WHERE id=?`,
      [id]
    );
    if (result.affectedRows === 1) deletedCount++;
  }

  return deletedCount > 0;
};

const categoryRepo = {
  getById,
  getAll,
  getByField,
  add,
  update,
  updateByField,
  removeById,
  removeAllByIds,
};

export { categoryRepo };
