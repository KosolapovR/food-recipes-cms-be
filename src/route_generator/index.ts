import { body, validationResult } from "express-validator";
import { ICommonRepo, IRequest, IRequestWithToken } from "../types";
import { NextFunction, Response, Router } from "express";

export interface IRouteGeneratorParams<
  CreateDTO,
  UpdateDTO,
  SingleDTO,
  GroupDTO
> {
  router: Router;
  repo: ICommonRepo<CreateDTO, UpdateDTO, SingleDTO, GroupDTO>;
  entityName: string;
}

export interface IRouteGeneratorMethodParams {
  middleware?: (
    req: IRequestWithToken<any, any>,
    res: Response,
    next: NextFunction
  ) => Promise<Response>;
  constraintFields?: string[];
  path?: string;
}

export function createRouteGenerator<
  CreateDTO,
  UpdateDTO,
  SingleDTO,
  GroupDTO
>({
  router,
  repo,
  entityName,
}: IRouteGeneratorParams<CreateDTO, UpdateDTO, SingleDTO, GroupDTO>) {
  return {
    post: (postParams: IRouteGeneratorMethodParams) =>
      router.post(
        postParams.path || "/Create",
        postParams.middleware,
        body(postParams.constraintFields || [])
          .not()
          .isEmpty()
          .trim(),
        async function (
          req: IRequestWithToken<CreateDTO, SingleDTO>,
          res: Response
        ) {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ error: errors.array() });
            }
            const result = await repo.add(req.body);
            if (!result) {
              return res
                .status(400)
                .json({ error: `Cannot add ${entityName}` });
            }
            return res.status(201).send({ data: result });
          } catch (error) {
            return res.status(500).json({ error: error });
          }
        }
      ),
    put: (putParams: IRouteGeneratorMethodParams) =>
      router.put(
        putParams.path || "/Update",
        putParams.middleware,
        body(putParams.constraintFields || [])
          .not()
          .isEmpty()
          .trim(),
        async function (req: IRequest<UpdateDTO, SingleDTO>, res: Response) {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ error: errors.array() });
            }

            const category = await repo.update(req.body);

            if (!category) {
              return res
                .status(400)
                .json({ error: `Cannot update ${entityName}` });
            }

            return res.status(200).send({ data: category });
          } catch (error) {
            return res.status(500).json({ error: error });
          }
        }
      ),
  };
}
