import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../../db_connection";
import {
  IBatchDeleteCommentParams,
  ICreateCommentParams,
  IDeleteCommentParams,
  IUpdateCommentParams,
} from "./types";
import { IFieldNameValue } from "../../../types";
import { IComment } from "../interface";

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<IComment[]>(
    `SELECT * FROM comments WHERE comments.id=?`,
    [id]
  );
  const comment: IComment | undefined = rows[0];
  return comment;
};

const getAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query<IComment[]>("SELECT * FROM comments");

  return rows;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [rows] = await db.query<IComment[]>(
    `SELECT * FROM comments WHERE ${fieldName}=?`,
    [fieldValue]
  );

  return rows;
};

const add = async ({
  text,
  userId,
  recipeId,
  status,
  date,
}: ICreateCommentParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO comments (text, userId, recipeId, status, date) values (?, ?, ?, ?, ?)`,
    [text, userId, recipeId, status, date]
  );

  return await getById(result.insertId);
};

const update = async ({
  id,
  text,
  userId,
  recipeId,
  status,
  date,
}: IUpdateCommentParams) => {
  const db = await getConnection();

  await db.query<ResultSetHeader>(
    `UPDATE comments SET text=?, userId=?, recipeId=?, status=?, date=? WHERE id=?`,
    [text, userId, recipeId, status, date, id]
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
    `UPDATE comments SET ${fieldName}=? WHERE id=?`,
    [fieldValue, id]
  );
  return await getById(id);
};

const removeById = async ({ id }: IDeleteCommentParams) => {
  const db = await getConnection();

  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM comments WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: IBatchDeleteCommentParams) => {
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
  update,
  updateByField,
  removeById,
  removeAllByIds,
};
export { commentRepo };
