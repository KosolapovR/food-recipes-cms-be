import jwt, { VerifyCallback, VerifyErrors, VerifyOptions } from "jsonwebtoken";
import { userRepo } from "../../components/User/repo";
import { NextFunction, Request, Response } from "express";
import { AppJwtPayload, IRequestWithToken } from "../../types";
import { pino } from "../../index";

export async function isAdmin(
  req: IRequestWithToken<any, any>,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const [, token] = header.split(" ");
    req.token = token;
  } else {
    return res.status(403).send("Not enough rights for operation");
  }

  const tokenPayload = jwt.decode(req.token) as AppJwtPayload;

  if (!tokenPayload?.user_id) {
    return res.status(403).send("Not enough rights for operation");
  }
  const { isAdmin } = await userRepo.getById(tokenPayload?.user_id);

  if (!isAdmin) {
    return res.status(403).send("Not enough rights for operation");
  }
  next();
}
