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
    "recipes",
    {
      id: { type: "int", autoIncrement: true, primaryKey: true },
      title: { type: "string", notNull: true },
      status: "string",
      previewImagePath: { type: "string" },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable("recipes", callback);
};

exports._meta = {
  version: 1,
};
