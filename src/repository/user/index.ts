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
  return rows;
};

const getByField = async ({ fieldName, fieldValue }: IFieldNameValue) => {
  const db = await getConnection();
  const [rows] = await db.query<IUser[]>(
    `SELECT * FROM users WHERE ${fieldName}=?`,
    [fieldValue]
  );
  return rows;
};

const add = async ({ email, password, isAdmin }: ICreateUserParams) => {
  const db = await getConnection();
  const [rows] = await db.query<ResultSetHeader>(
    `INSERT INTO users (email, password, is_admin) values (?, ?, ?)`,
    [email, password, isAdmin]
  );
  return rows;
};

const update = async ({ id, email, isAdmin }: IUpdateUserParams) => {
  const db = await getConnection();
  await db.query<ResultSetHeader>(
    `UPDATE users SET email='${email}', isAdmin='${isAdmin}' WHERE id=${id}`
  );

  return await getById(id);
};

const removeById = async ({ id }: IDeleteUserParams) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM users WHERE id=${id}`
  );
  return result.affectedRows === 1;
};

const removeAllByIds = async ({ ids }: IBatchDeleteUserParams) => {
  const db = await getConnection();
  let deletedCount = 0;
  for (let i = 0; i < ids.length; i++) {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM users WHERE id=${ids[i]}`
    );
    if (result.affectedRows === 1) deletedCount++;
  }

  return deletedCount > 0;
};

export { getById, getAll, getByField, add, update, removeById, removeAllByIds };
