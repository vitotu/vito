#!/bin/bash

# npm run build-sms

deploy_dir="deploy"
sms_page_dir="sms-page"
sms_service_dir="sms-service"
scripts_dir="scripts"

npm run build-sms

# 检查 deploy 目录中是否包含 sms-page 目录
if [ -d "./$deploy_dir/$sms_page_dir" ]; then
    echo "sms-page 目录已存在，复制sms-page目录"
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
else
    echo "sms-page 目录不存在，创建目录并复制sms-page目录"
    mkdir -p "./$deploy_dir/$sms_page_dir"
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
fi

# 检查 deploy 目录中是否包含 sms-service 目录
if [ -d "./$deploy_dir/$sms_service_dir" ]; then
    echo "sms-service 目录已存在，复制sms-service目录"
    cp -rf ./packages/virtualSms/sms-service/dist/* "./$deploy_dir/$sms_service_dir/"
else
    echo "sms-service 目录不存在，创建目录并复制sms-service目录"
    mkdir -p "./$deploy_dir/$sms_service_dir"
    cp -rf ./packages/virtualSms/sms-service/dist/* "./$deploy_dir/$sms_service_dir/"
fi

# 检查 deploy 目录中是否包含 sms-service 目录
if [ -d "./$deploy_dir/$scripts_dir" ]; then
    echo "scripts 目录已存在，复制生产 pm2配置文件"
    cp -rf ./scripts/smsPm2Prod.config.js "./$deploy_dir/$scripts_dir/"
else
    echo "scripts 目录已存在，复制生产 pm2配置文件"
    mkdir -p "./$deploy_dir/$scripts_dir"
    cp -rf ./scripts/smsPm2Prod.config.js "./$deploy_dir/$scripts_dir/"
fi

npx pm2 start ./deploy/scripts/smsPm2Prod.config.js