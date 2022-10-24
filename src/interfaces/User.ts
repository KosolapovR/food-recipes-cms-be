import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: string;
  email: string;
  password?: string;
  token: string;
}
