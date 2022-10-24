"use strict";
/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.up = function (db, callback) {
  db.createTable(
    "users",
    {
      id: { type: "int", autoIncrement: true, primaryKey: true },
      email: { type: "string", unique: true, notNull: true },
      password: { type: "string", notNull: true },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable("users", callback);
};

exports._meta = {
  version: 1,
};
