const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// 初始化数据库
async function initDB() {
  if (!config.dbFilePath) {
    throw new Error('Database file path is not set in config.js');
  }

  const SQL = await initSqlJs();
  const dbFilePath = config.dbFilePath || path.join(__dirname, 'db.sqlite');

  let db;
  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  return db;
}

// 读取数据
async function readData(date) {
  const db = await initDB();
  const query = `SELECT * FROM queries WHERE DATE(created_at) = ? ORDER BY created_at DESC`;
  const stmt = db.prepare(query);
  stmt.bind([date]);

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }

  stmt.free();
  return rows;
}

// 写入数据
async function writeData(queryData) {
  const db = await initDB();
  const stmt = db.prepare("INSERT INTO queries (query, created_at) VALUES (?, ?)");
  await stmt.run([queryData.query, queryData.created_at]);
  stmt.free();
  const fileBuffer = db.export();
  fs.writeFileSync(config.dbFilePath, fileBuffer);
  console.log('Data written successfully');
}

module.exports = {
  readData,
  writeData
};
