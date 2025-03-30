module.exports = {
  apps: [
    {
      name: "i996-monitor",
      script: "i996.sh",
      interpreter: "/data/data/com.termux/files/usr/bin/bash",
      autorestart: true, // 进程异常退出时自动重启
      restart_delay: 6000, // 6 分钟后重启
      max_restarts: 6, // 最多重启 6 次
      env: {
        TERMUX_NOTIFICATION: "termux-notification -t 'i996' -c '断网重启失败' --type default"
      },
      post_update: [
        "echo 'i996 进程已更新'",
        "echo '0 2 * * * pm2 restart i996-monitor' | crontab -" // 将 cron 任务添加到 crontab
      ] // 可选，更新代码后执行
    }
  ]
};
