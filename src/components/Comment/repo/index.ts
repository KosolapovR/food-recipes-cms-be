import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../db_connection";
import {
  CommonBatchDeleteDTOType,
  CommonDeleteDTOType,
  IFieldNameValue,
} from "../../../types";
import {
  ICommentCreateDTO,
  ICommentGroupDTO,
  ICommentSingleDTO,
} from "../interface";
import { INACTIVE_STATUS } from "../../../consts";

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<ICommentSingleDTO[]>(
    `SELECT * FROM comments WHERE comments.id=?`,
    [id]
  );
  const comment: ICommentSingleDTO | undefined = rows[0];
  return comment;
};

const getAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query<ICommentGroupDTO[]>("SELECT * FROM comments");

  return rows;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [rows] = await db.query<ICommentGroupDTO[]>(
    `SELECT * FROM comments WHERE ${fieldName}=?`,
    [fieldValue]
  );

  return rows;
};

const add = async ({ text, userId, recipeId }: ICommentCreateDTO) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO comments (text, userId, recipeId, date, status) values (?, ?, ?, ?, ?)`,
    [text, userId, recipeId, new Date(), INACTIVE_STATUS]
  );

  return await getById(result.insertId);
};

const updateByField = async ({
  fieldName,
  fieldValue,
  id,
}: IFieldNameValue & { id: number }) => {
  const db = await getConnection();
  await db.query<ResultSetHeader>(
    `UPDATE comments SET ${fieldName}=? WHERE id=?`,
    [fieldValue, id]
  );
  return await getById(id);
};

const removeById = async ({ id }: CommonDeleteDTOType) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM comments WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: CommonBatchDeleteDTOType) => {
  const db = await getConnection();
  let deletedCount = 0;
  for (const id of ids) {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM comments WHERE id=?`,
      [id]
    );
    if (result.affectedRows === 1) deletedCount++;
  }

  return deletedCount > 0;
};

const commentRepo = {
  getById,
  getAll,
  getByField,
  add,
  updateByField,
  removeById,
  removeAllByIds,
};
export { commentRepo };
