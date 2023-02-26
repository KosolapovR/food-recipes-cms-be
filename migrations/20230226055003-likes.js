"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    "likes",
    {
      id: { type: "int", autoIncrement: true, primaryKey: true },
      userId: {
        type: "int",
        foreignKey: {
          name: "likes_user_fk",
          table: "users",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
          },
          mapping: "id",
        },
      },
      recipeId: {
        type: "int",
        foreignKey: {
          name: "likes_recipe_fk",
          table: "recipes",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
          },
          mapping: "id",
        },
      },
    },
    callback
  );
};

exports.down = function (db) {
  db.dropTable("likes", callback);
};

exports._meta = {
  version: 1,
};
