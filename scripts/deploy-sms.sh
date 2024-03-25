#!/bin/bash

# npm run build-sms

deploy_dir="deploy"
sms_page_dir="sms-page"

# 检查 deploy 目录中是否包含 sms-page 目录
if [ -d "./$deploy_dir/$sms_page_dir" ]; then
    echo "sms-page 目录已存在，执行命令 A："
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
else
    echo "sms-page 目录不存在，创建目录并执行命令 A："
    mkdir -p "./$deploy_dir/$sms_page_dir"
    cp -rf ./packages/virtualSms/sms-pages/.output/* "./$deploy_dir/$sms_page_dir/"
fi