const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cron = require("node-cron");
const cors = require("cors");
const app = express();
const port = 3000;

// 连接 SQLite 数据库
const db = new sqlite3.Database("database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// 初始化数据库表
db.run(`
  CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

// 接口1: 存储 query 参数
app.get("/api/store", (req, res) => {
  const query = JSON.stringify(req.query);
  db.run("INSERT INTO queries (query) VALUES (?)", [query], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: this.lastID });
  });
});

// 接口2: 查询最近 7 天的数据，支持日期筛选
app.get("/api/query", (req, res) => {
  let date = req.query.date || new Date().toISOString().split("T")[0];
  db.all(
    `SELECT * FROM queries WHERE DATE(created_at) = ? ORDER BY created_at DESC`,
    [date],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// 定时任务：每天删除 7 天前的数据
cron.schedule("0 0 * * *", () => {
  db.run("DELETE FROM queries WHERE created_at < datetime('now', '-7 days')", (err) => {
    if (err) console.error("Error cleaning up old data:", err.message);
    else console.log("Old data cleaned up.");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
