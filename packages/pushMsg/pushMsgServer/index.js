const Koa = require("koa");
const Router = require("koa-router");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("@koa/cors");
const { exec } = require("child_process");
const storage = require("./storage"); // 导入 storage 模块
const config = require("./config");
// const { sendWeChatMessage } = require("./wechatPush"); // 导入微信推送模块
const app = new Koa();
const router = new Router();
const port = 3000;

// 执行 termux-notification 命令
function sendTermuxNotification(content) {
  const command = `termux-notification -t 'pushMsg' -c '${content}' --type default`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// 接口1: 存储 query 参数，并推送微信消息
router.get("/api/store", async (ctx) => {
  const query = JSON.stringify(ctx.request.query);
  const newData = {
    query,
    created_at: new Date().toISOString(),
  };

  // 存储数据
  await storage.writeData(newData);
  if (config.termuxNotify) {
    try {
      sendTermuxNotification(query)
    } catch (error) {
      console.log(error, `sendTermuxNotification error ${query}`)
    }
  }
  // 如果配置启用微信推送，则发送微信消息
  if (config.wechatPush) {
    // await sendWeChatMessage(newData.query, newData.created_at);
  }

  ctx.body = { success: true };
});

// 接口2: 查询最近 7 天的数据，支持日期筛选，并解析 content 执行 termux-notification
router.get("/api/query", async (ctx) => {
  const date = ctx.request.query.date || new Date().toISOString().split("T")[0];
  const rows = await storage.readData(date);

  ctx.body = rows;
});

// 定时任务：每天删除 7 天前的数据
cron.schedule("0 0 * * *", async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const rows = await storage.readData();
  const filteredData = rows.filter(row => new Date(row.created_at) > sevenDaysAgo);

  // 存储清理后的数据
  for (const row of filteredData) {
    await storage.writeData(row);
  }
  console.log("Old data cleaned up.");
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
