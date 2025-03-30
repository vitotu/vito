#!/bin/bash

commandA="curl https://v2.i996.me | bash -s zuhi04818"
logfile="./logs/i996.txt"
max_retries=10
retry_count=0

run_monitor() {
    while (( retry_count < max_retries )); do
        echo "第 $((retry_count + 1)) 次尝试运行 commandA..."
        
        # 运行 commandA，并将输出存入日志文件
        eval "$commandA" | tee "$logfile" &

        # 监听日志文件
        notified=false
        tail -f "$logfile" | while read -r line; do
            if [[ "$line" == *"撤退了"* && $notified == false ]]; then
                # 触发通知
                termux-notification -t 'i996' -c '断网了' --type default
                notified=true
                break
            fi

            if [[ ! -s "$logfile" ]]; then
                echo "日志文件为空，commandA 执行出错，立即进行下一轮尝试..."
                break
            fi
        done

        # 退出 while 说明触发了撤退监测，尝试重启
        ((retry_count++))
        echo "检测到 '撤退了'，尝试重新运行 ($retry_count/$max_retries)..."
    done

    echo "已达到最大尝试次数 ($max_retries)，停止运行。"
}

run_monitor
