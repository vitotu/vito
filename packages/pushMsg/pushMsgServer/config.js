// config.js
module.exports = {
  storage: "sqlite", // 可以设置为 "json" 或 "sqlite"
  dbFilePath: "./queries.db", // SQLite 数据库文件路径
  jsonFilePath: "./queries.json", // JSON 文件路径
  wechatPush: false, // 是否启用微信推送功能
  WECHAT_APPID: "你的AppID",
  WECHAT_SECRET: "你的AppSecret",
  WECHAT_TEMPLATE_ID: "你的模板ID",
  WECHAT_OPENID: "用户的OPENID", // 需要提前获取用户 OpenID
  termuxNotify: true, // 是否启用termux消息通知
};
