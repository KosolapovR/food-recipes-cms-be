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
      isAdmin: { type: "boolean", default: false },
    },
    createAdmin
  );
  function createAdmin(err) {
    if (err) {
      callback(err);
      return;
    }
    db.runSql(
      "INSERT INTO users (email, password, isAdmin, status) values ('admin@mail.ru', '$2y$10$bBA63.sfLmOyG9aqS8aKY.TyRZfFN1HiWaLWJfHZdQVUuQVpsnVQ2', true, 'active')",
      callback
    );
  }
};

exports.down = function (db, callback) {
  db.dropTable("users", callback);
};

exports._meta = {
  version: 1,
};
