import { Connection } from "mysql2/promise";
import {
  add as addUser,
  getAll as getAllUsers,
  getAllByField as getAllUsersByField,
} from "./user";
import {
  getAll as getAllRecipes,
  getAllByField as getAllByFieldRecipes,
  add as addRecipe,
  getById,
} from "./recipe";

export const getRepository = (db: Connection) => ({
  users: {
    getAll: getAllUsers(db),
    getAllByField: getAllUsersByField(db),
    add: addUser(db),
  },
  recipes: {
    getById: getById(db),
    getAll: getAllRecipes(db),
    getAllByField: getAllByFieldRecipes(db),
    add: addRecipe(db),
  },
});
