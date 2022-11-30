import { IUser } from "../../interfaces";
import { ResultSetHeader } from "mysql2/promise";
import { getConnection } from "../../db_connection";
import { IFieldNameValue } from "../types";
import {
  IBatchDeleteUserParams,
  ICreateUserParams,
  IDeleteUserParams,
  IUpdateUserParams,
} from "./types";

const getAll = async () => {
  const db = await getConnection();
  const [rows] = await db.query<IUser[]>("SELECT * FROM users");
  return rows;
};

const getById = async (id: number) => {
  const db = await getConnection();
  const [rows] = await db.query<IUser[]>(`SELECT * FROM users WHERE id=?`, [
    id,
  ]);
  const user: IUser | undefined = rows[0];
  return user;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [rows] = await db.query<IUser[]>(
    `SELECT * FROM users WHERE ${fieldName}=?`,
    [fieldValue]
  );
  return rows;
};

const add = async ({ email, password, isAdmin, status }: ICreateUserParams) => {
  const db = await getConnection();
  const [rows] = await db.query<ResultSetHeader>(
    `INSERT INTO users (email, password, isAdmin, status) values (?, ?, ?, ?)`,
    [email, password, isAdmin, status]
  );
  return rows;
};

const update = async ({
  id,
  email,
  password,
  isAdmin,
  status,
}: IUpdateUserParams) => {
  const db = await getConnection();
  if (password) {
    await db.query<ResultSetHeader>(
      `UPDATE users SET email=?, password=?, isAdmin=?, status=? WHERE id=?`,
      [email, password, isAdmin, status, id]
    );
  } else {
    await db.query<ResultSetHeader>(
      `UPDATE users SET email=?, isAdmin=?, status=? WHERE id=?`,
      [email, isAdmin, status, id]
    );
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
    `UPDATE users SET ${fieldName}=? WHERE id=?`,
    [fieldValue, id]
  );
  return await getById(id);
};

const removeById = async ({ id }: IDeleteUserParams) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM users WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: IBatchDeleteUserParams) => {
  const db = await getConnection();
  let deletedCount = 0;
  for (const id of ids) {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM users WHERE id=?`,
      [id]
    );
    if (result.affectedRows === 1) deletedCount++;
  }

  return deletedCount > 0;
};

export {
  getById,
  getAll,
  getByField,
  add,
  update,
  updateByField,
  removeById,
  removeAllByIds,
};
