module.exports = {
  apps: [
    {
      name: "pushMsgService", // 进程名称
      script: "index.js", // 启动的脚本文件
      watch: true, // 监听文件变更，自动重启
      restart_delay: 30000, // 进程崩溃后，30秒后重启
      max_restarts: 6, // 失败6次后，不再重启
      exp_backoff_restart_delay: 0, // 关闭指数退避策略，始终间隔30秒
      interpreter: "node", // 指定 Node.js 解释器
      env: {
        NODE_ENV: "production", // 生产环境变量
      },
      post_exit: "if [ $PM2_EXIT_CODE -ne 0 ]; then termux-notification -t 'pushMsg' -c 'push message service restart failed'; fi"
    },
  ],
};
