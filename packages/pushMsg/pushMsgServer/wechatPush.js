// wechatPush.js
const axios = require("axios");
const config = require("./config");

let accessToken = "";

// 获取 access_token
async function getAccessToken() {
  try {
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.WECHAT_APPID}&secret=${config.WECHAT_SECRET}`
    );
    accessToken = response.data.access_token;
    console.log("获取 access_token 成功:", accessToken);
  } catch (error) {
    console.error("获取 access_token 失败:", error);
  }
}

// 每 1 小时刷新一次 access_token
setInterval(getAccessToken, 3600 * 1000);
getAccessToken(); // 启动时获取一次

// 发送微信消息
async function sendWeChatMessage(query, createdAt) {
  if (!config.wechatPush) {
    console.log("微信推送功能未启用");
    return;
  }

  try {
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
      {
        touser: config.WECHAT_OPENID,
        template_id: config.WECHAT_TEMPLATE_ID,
        url: "https://your-website.com",
        data: {
          keyword1: { value: query, color: "#173177" },
          keyword2: { value: createdAt, color: "#173177" },
        },
      }
    );
    console.log("微信消息发送成功:", response.data);
  } catch (error) {
    console.error("微信消息发送失败:", error);
  }
}

module.exports = { sendWeChatMessage };
