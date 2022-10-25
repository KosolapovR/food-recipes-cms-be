import { Connection } from "mysql2/promise";
import {
  add as addUser,
  getAll as getAllUsers,
  getByField as getUsersByField,
} from "./user";
import {
  getAll as getAllRecipes,
  getByField as getByFieldRecipes,
  add as addRecipe,
  getById as getByIdRecipe,
  update as updateRecipe,
  removeById as removeByIdRecipe,
  removeAllByIds as removeAllByIdsRecipes,
} from "./recipe";

export const getRepository = (db: Connection) => ({
  users: {
    getAll: getAllUsers(db),
    getByField: getUsersByField(db),
    add: addUser(db),
  },
  recipes: {
    getById: getByIdRecipe(db),
    getAll: getAllRecipes(db),
    getByField: getByFieldRecipes(db),
    add: addRecipe(db),
    update: updateRecipe(db),
    removeById: removeByIdRecipe(db),
    removeAllByIds: removeAllByIdsRecipes(db),
  },
});
