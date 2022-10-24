import { IUser } from "../../interfaces";
import { Connection, ResultSetHeader } from "mysql2/promise";
import { IFieldNameValue } from "../types";
import { IAddUserParams } from "./types";

const getAll = (db: Connection) => async () => {
  const [rows] = await db.query<IUser[]>("SELECT * FROM users");
  return rows;
};

const getAllByField =
  (db: Connection) =>
  async ({ fieldName, fieldValue }: IFieldNameValue) => {
    const [rows] = await db.query<IUser[]>(
      `SELECT * FROM users WHERE ${fieldName}='${fieldValue}'`
    );
    return rows;
  };

const add =
  (db: Connection) =>
  async ({ email, password }: IAddUserParams) => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO users (email, password) values ('${email}', '${password}')`
    );
    return rows;
  };

export { getAll, getAllByField, add };
