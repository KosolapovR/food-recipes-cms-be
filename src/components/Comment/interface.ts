import { RowDataPacket } from "mysql2";

export type CommentStatusType = "active" | "inactive";

export interface IComment extends RowDataPacket {
  id: string;
  text: string;
  status: CommentStatusType;
  date: string;
  userId: string;
  recipeId: string;
}
