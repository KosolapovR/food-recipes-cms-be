import jwt, {
  Secret,
  VerifyCallback,
  VerifyErrors,
  VerifyOptions,
} from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { IRequestWithToken } from "../../types";

export const protectedRoute = (
  req: IRequestWithToken<Record<string, unknown>, Record<string, unknown>>,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const [, token] = header.split(" ");
    req.token = token;
  } else {
    return res.sendStatus(401);
  }
  const verifyOptions: VerifyOptions = { complete: false };
  const verifyCallback: VerifyCallback<Request<Record<string, unknown>>> = (
    err: VerifyErrors | null,
    payload: IRequestWithToken<Record<string, unknown>, Record<string, unknown>>
  ) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      req.user_id = payload.user_id;
      next();
    }
  };
  const secret: Secret = process.env.TOKEN_KEY || "";
  jwt.verify(req.token || "", secret, verifyOptions, verifyCallback);
};
