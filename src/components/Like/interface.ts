import { RowDataPacket } from "mysql2";

export interface ILikeSingleDTO extends RowDataPacket {
  id: string;
  userId: string;
  recipeId: string;
}

export type ILikeCreateDTO = Omit<ILikeSingleDTO, "id">;
