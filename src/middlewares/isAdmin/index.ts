import jwt from "jsonwebtoken";
import { userRepo } from "../../components/User/repo";
import { NextFunction, Response } from "express";
import { AppJwtPayload, IRequestWithToken } from "../../types";

export async function isAdmin(
  req: IRequestWithToken<any, any>,
  res: Response,
  next: NextFunction
) {
  const { user_id } = jwt.decode(req.token) as AppJwtPayload;
  const { isAdmin } = await userRepo.getById(user_id);

  if (!isAdmin) {
    return res.status(403).send("Not enough rights for operation");
  }
  next();
}
