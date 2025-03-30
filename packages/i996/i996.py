import subprocess
import time
import os
import threading

commandA = "curl https://v2.i996.me | bash -s zuhi04818"
logfile = "./logs/i996.txt"
max_retries = 10
retry_count = 0
restart_flag = threading.Event()  # 线程安全的标志位，控制是否需要重启进程

def send_notification(title, message):
    """封装通知机制，可以扩展 Telegram、邮件等"""
    try:
        subprocess.run(["termux-notification", "-t", title, "-c", message, "--type", "default"], check=True)
    except FileNotFoundError:
        print(f"[通知] {title}: {message} (termux-notification 命令未找到)")

def run_command():
    """运行 commandA 并将输出写入日志文件"""
    with open(logfile, "w") as log:
        process = subprocess.Popen(commandA, shell=True, stdout=log, stderr=subprocess.STDOUT)
    return process

def monitor_log():
    """监听日志文件，检测到 '撤退了' 触发通知并重启进程"""
    global retry_count

    notified = False
    while retry_count < max_retries:
        with open(logfile, "r") as log:
            while True:
                if restart_flag.is_set():
                    break  # 触发重启，退出日志监听，等待主线程处理

                line = log.readline()
                if not line:
                    time.sleep(0.5)  # 避免 CPU 100% 占用
                    continue

                print(line.strip())  # 打印日志，方便调试
                
                if "撤退了" in line and not notified:
                    # send_notification("i996", "断网了")
                    notified = True
                    restart_flag.set()  # 设置重启标志
                    break  # 退出当前日志监听循环

        if restart_flag.is_set():
            break  # 触发重启，退出监听

def run_monitor():
    """主循环：运行 commandA 并监听日志"""
    global retry_count

    while retry_count < max_retries:
        print(f"第 {retry_count + 1} 次尝试运行 commandA...")

        # 确保 logs 目录存在
        os.makedirs(os.path.dirname(logfile), exist_ok=True)

        # 运行 commandA
        process = run_command()
        restart_flag.clear()  # 清除重启标志
        time.sleep(1)  # 等待日志开始写入

        # 启动日志监听线程
        log_thread = threading.Thread(target=monitor_log, daemon=True)
        log_thread.start()

        # 监控 commandA 是否崩溃或收到重启信号
        while process.poll() is None and not restart_flag.is_set():
            time.sleep(2)  # 每隔 2 秒检查一次进程状态

        # 终止 commandA 进程
        process.terminate()
        retry_count += 1
        print(f"检测到 '撤退了' 或进程崩溃，尝试重新运行 ({retry_count}/{max_retries})...")
        time.sleep(2)  # 防止瞬间重试

    print(f"已达到最大尝试次数 ({max_retries})，停止运行。")
    # send_notification("i996", "已达到最大尝试次数，停止运行。")

if __name__ == "__main__":
    run_monitor()
