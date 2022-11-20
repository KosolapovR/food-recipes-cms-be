import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Response } from "express";

import { IRequestWithToken } from "../../types";

export const protectedRoute = (
  req: IRequestWithToken,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const [, token] = header.split(" ");
    req.token = token;
  } else {
    return res.sendStatus(403);
  }
  jwt.verify(
    req.token,
    process.env.TOKEN_KEY,
    (err: JsonWebTokenError, payload: IRequestWithToken) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user_id = payload.user_id;
        next();
      }
    }
  );
};
