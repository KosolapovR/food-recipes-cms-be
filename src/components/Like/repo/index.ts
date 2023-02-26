import { ResultSetHeader } from "mysql2/promise";

import { getConnection } from "../../../db_connection";
import { CommonDeleteDTOType } from "../../../types";
import { ILikeCreateDTO, ILikeSingleDTO } from "../interface";

const getById = async (id: string) => {
  const db = await getConnection();
  const [rows] = await db.query<ILikeSingleDTO[]>(
    `SELECT * FROM likes WHERE likes.id=?`,
    [id]
  );
  return rows[0];
};

const add = async ({ userId, recipeId }: ILikeCreateDTO) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO likes (userId, recipeId) values (?, ?)`,
    [userId, recipeId]
  );
  return await getById(result.insertId.toString());
};

const removeById = async ({ id }: CommonDeleteDTOType) => {
  const db = await getConnection();
  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM likes WHERE id=?`,
    [id]
  );
  return result.affectedRows === 1;
};

const likeRepo = {
  add,
  removeById,
  getById,
};
export { likeRepo };
