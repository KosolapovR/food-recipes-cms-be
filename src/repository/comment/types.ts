import { CommentStatusType } from "../../interfaces/IComment";

export interface ICreateCommentParams {
  text: string;
  userId: string;
  recipeId: string;
  date: Date;
  status: CommentStatusType;
}

export interface IUpdateCommentParams extends ICreateCommentParams {
  id: number;
}

export interface IDeleteCommentParams {
  id: number;
}

export interface IBatchDeleteCommentParams {
  ids: number[];
}
