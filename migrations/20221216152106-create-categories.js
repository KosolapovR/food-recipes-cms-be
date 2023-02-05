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
    "categories",
    {
      id: { type: "int", autoIncrement: true, primaryKey: true },
      name: "string",
      parentId: { type: "int", default: null },
    },
    addCategoryField
  );
  function addCategoryField() {
    db.addColumn(
      "recipes",
      "categoryId",
      { type: "int", default: null },
      callback
    );
  }
};

exports.down = function (db, callback) {
  db.dropTable("categories", removeColumn);
  function removeColumn() {
    db.removeColumn("recipes", "categoryId", callback);
  }
};

exports._meta = {
  version: 1,
};
