import { RowDataPacket } from "mysql2";

export type UserStatusType = "inactive" | "active";

export interface IUser extends RowDataPacket {
  id: string;
  email: string;
  password?: string;
  token: string;
  isAdmin?: boolean;
  status: UserStatusType;
}
