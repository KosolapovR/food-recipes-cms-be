import { Connection } from "mysql2/promise";
import { add, getAll, getAllByField } from "./user";

export const getRepository = (db: Connection) => ({
  users: {
    getAll: getAll(db),
    getAllByField: getAllByField(db),
    add: add(db),
  },
});
