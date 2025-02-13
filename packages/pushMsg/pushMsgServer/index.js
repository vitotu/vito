const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const cors = require("@koa/cors");
const app = new Koa();
const router = new Router();
const port = 3000;
const dataFilePath = path.join(__dirname, "queries.json");

// 确保文件存在
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// 读取 JSON 文件
function readData() {
  const fileData = fs.readFileSync(dataFilePath);
  return JSON.parse(fileData);
}

// 写入 JSON 文件
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(require("koa-bodyparser")());

// 接口1: 存储 query 参数
router.get("/api/store", async (ctx) => {
  const query = JSON.stringify(ctx.request.query);
  const data = readData();
  const newData = {
    id: data.length + 1, // 简单的ID逻辑
    query,
    created_at: new Date().toISOString(),
  };
  data.push(newData);
  writeData(data);
  ctx.body = { success: true, id: newData.id };
});

// 接口2: 查询最近 7 天的数据，支持日期筛选
router.get("/api/query", async (ctx) => {
  const date = ctx.request.query.date || new Date().toISOString().split("T")[0];
  const data = readData();
  const filteredData = data.filter((item) => item.created_at.split("T")[0] === date);
  ctx.body = filteredData;
});

// 定时任务：每天删除 7 天前的数据
cron.schedule("0 0 * * *", () => {
  const data = readData();
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return itemDate > sevenDaysAgo;
  });
  writeData(filteredData);
  console.log("Old data cleaned up.");
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
