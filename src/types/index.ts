import { Request } from "express";

export interface IRequestWithToken extends Request {
  token?: string;
  user_id?: string;
}
