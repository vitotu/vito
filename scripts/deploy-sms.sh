#!/bin/bash

# npm run build-sms

deploy_dir="deploy"
sms_page_dir="sms-page"
sms_service_dir="sms-service"

npm run build-sms

# 检查 deploy 目录中是否包含 sms-page 目录
if [ -d "./$deploy_dir/$sms_page_dir" ]; then
    echo "sms-page 目录已存在，执行命令 A："
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
else
    echo "sms-page 目录不存在，创建目录并执行命令 A："
    mkdir -p "./$deploy_dir/$sms_page_dir"
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
fi

# 检查 deploy 目录中是否包含 sms-service 目录
if [ -d "./$deploy_dir/$sms_service_dir" ]; then
    echo "sms-service 目录已存在，执行命令 A："
    cp -rf ./packages/virtualSms/sms-service/dist/* "./$deploy_dir/$sms_service_dir/"
else
    echo "sms-service 目录不存在，创建目录并执行命令 A："
    mkdir -p "./$deploy_dir/$sms_service_dir"
    cp -rf ./packages/virtualSms/sms-service/dist/* "./$deploy_dir/$sms_service_dir/"
fi

pm2 start ./scripts/smsPm2.config.js