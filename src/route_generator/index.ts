import { body, validationResult } from "express-validator";
import { ICommonRepo, IRequest, IRequestWithToken } from "../types";
import { NextFunction, Request, Response, Router } from "express";
import { commentRepo as repo } from "../components/Comment/repo";

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

type Middleware = (
  req: IRequestWithToken<any, any>,
  res: Response,
  next: NextFunction
) => Promise<Response>;
export interface IRouteGeneratorMethodParams {
  middleware?: Middleware;
  constraintFields?: string[];
  path?: string;
}

export interface IRouteGeneratorGetMethodParams {
  middleware?: Middleware;
  filteredByFieldName?: string;
  path?: string;
}

export function createRouteGenerator<
  CreateDTO extends {},
  UpdateDTO,
  SingleDTO,
  GroupDTO
>({
  router,
  repo,
  entityName,
}: IRouteGeneratorParams<CreateDTO, UpdateDTO, SingleDTO, GroupDTO>) {
  return {
    get: (params?: IRouteGeneratorGetMethodParams) =>
      router.get(
        params?.path || "/",
        async function (req: Request, res: Response) {
          try {
            let data;
            let fieldValue;
            if (params?.filteredByFieldName) {
              fieldValue = req.query[params?.filteredByFieldName];
            }
            if (fieldValue) {
              data = await repo.getByField({
                fieldName: params?.filteredByFieldName,
                fieldValue: fieldValue as string,
              });
            } else {
              data = await repo.getAll();
            }
            if (!data) {
              return res.status(400).send(`Cannot get ${entityName}s`);
            }

            return res.status(200).send({ data });
          } catch (error) {
            return res.status(500).json({ error });
          }
        }
      ),
    post: (postParams: IRouteGeneratorMethodParams) =>
      router.post(
        postParams.path || "/Create",
        postParams.middleware ||
          async function (req, res, next) {
            next();
          },
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
            const data = await repo.add(req.body);
            if (!data) {
              return res
                .status(400)
                .json({ error: `Cannot add ${entityName}` });
            }
            return res.status(201).send({ data });
          } catch (error) {
            return res.status(500).json({ error });
          }
        }
      ),
    put: (putParams: IRouteGeneratorMethodParams) =>
      router.put(
        putParams.path || "/Update",
        putParams.middleware ||
          async function (req, res, next) {
            next();
          },
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
