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
    "recipe_steps",
    {
      id: { type: "int", autoIncrement: true, primaryKey: true },
      title: "string",
      text: { type: "string", notNull: true },
      imagePath: "string",
      recipe_id: {
        type: "int",
        foreignKey: {
          name: "recipe_steps_recipe_fk",
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

exports.down = function (db, callback) {
  db.dropTable("recipe_steps", callback);
};

exports._meta = {
  version: 1,
};
