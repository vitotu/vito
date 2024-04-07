module.exports = {
  apps: [
    {
      name: 'sms-pages', // 应用名称
      script: './deploy/sms-page/server/index.mjs', // 启动文件地址
      cwd: './', // 当前工作路径
      watch: [
        // 监控变化的目录，一旦变化，自动重启
        './deploy/sms-page/server',
      ],
      ignore_watch: [
        // 忽视这些目录的变化
        'node_modules',
        'logs',
        'public',
      ],
      node_args: '--harmony', // node的启动模式
      env: {
        NODE_ENV: 'development', // 设置运行环境，此时process.env.NODE_ENV的值就是development
        PORT: '8081',
        target: 'prod-i996',
        apiPath: '/api/'
      },
      out_file: './deploy/logs/out-smsPage.log', // 普通日志路径
      error_file: './deploy/logs/err-smsPage.log', // 错误日志路径
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
    {
      name: 'sms-service', // 应用名称
      script: './deploy/sms-service/index.js', // 启动文件地址
      cwd: './', // 当前工作路径
      watch: [
        // 监控变化的目录，一旦变化，自动重启
        './deploy/sms-service',
      ],
      ignore_watch: [
        // 忽视这些目录的变化
        'node_modules',
        'logs',
        'public',
      ],
      node_args: '--harmony', // node的启动模式
      env: {
        NODE_ENV: 'development', // 设置运行环境，此时process.env.NODE_ENV的值就是development
        PORT: '3080',
        target: 'prod-i996',
      },
      out_file: './deploy/logs/out-smsService.log', // 普通日志路径
      error_file: './deploy/logs/err-smsService.log', // 错误日志路径
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}