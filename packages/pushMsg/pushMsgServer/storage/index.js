// storage/index.js
const config = require("../config");

let storage;

if (config.storage === "json") {
  storage = require("./jsonStorage");
} else if (config.storage === "sqlite") {
  storage = require("./sqliteStorage");
} else {
  throw new Error("Unsupported storage type in config.");
}

module.exports = storage;
