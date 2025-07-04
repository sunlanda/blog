#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
系统资源监控脚本

此脚本收集系统资源使用情况并生成HTML报告，包括：
- 内存占用TOP10的应用
- CPU消耗TOP10的应用
- 应用运行时长
- 屏幕尺寸信息
- 多显示器状态

支持单次执行或定期执行（使用cron）
"""

import os
import sys
import time
import datetime
import subprocess
import argparse
from pathlib import Path

# 尝试导入依赖库，如果不存在则提示安装
try:
    import psutil
except ImportError:
    print("请安装psutil库: pip3 install psutil")
    sys.exit(1)

try:
    from screeninfo import get_monitors
except ImportError:
    print("请安装screeninfo库: pip3 install screeninfo")
    sys.exit(1)


def get_process_info():
    """获取进程信息，包括内存使用、CPU使用和运行时间"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'memory_percent', 'cpu_percent', 'create_time']):
        try:
            # 获取进程信息
            proc_info = proc.info
            # 计算运行时间
            create_time = datetime.datetime.fromtimestamp(proc_info['create_time'])
            now = datetime.datetime.now()
            runtime = now - create_time
            # 格式化运行时间
            days = runtime.days
            hours, remainder = divmod(runtime.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            runtime_str = f"{days}天 {hours}小时 {minutes}分钟"
            
            # 更新CPU使用率（需要先调用一次，然后等待一小段时间再次获取）
            proc.cpu_percent(interval=None)
            
            processes.append({
                'pid': proc_info['pid'],
                'name': proc_info['name'],
                'username': proc_info['username'],
                'memory_percent': proc_info['memory_percent'],
                'cpu_percent': 0,  # 初始化为0，稍后更新
                'runtime': runtime_str,
                'proc': proc  # 保存进程对象以便稍后更新CPU使用率
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    # 等待一小段时间以获取准确的CPU使用率
    time.sleep(0.5)
    
    # 更新CPU使用率
    for proc_data in processes:
        try:
            proc_data['cpu_percent'] = proc_data['proc'].cpu_percent(interval=None)
            del proc_data['proc']  # 删除进程对象，不需要在结果中包含
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            proc_data['cpu_percent'] = 0
            if 'proc' in proc_data:
                del proc_data['proc']
    
    return processes


def get_screen_info():
    """获取屏幕信息"""
    try:
        monitors = get_monitors()
        screens = []
        for i, monitor in enumerate(monitors):
            screens.append({
                'id': i + 1,
                'width': monitor.width,
                'height': monitor.height,
                'name': getattr(monitor, 'name', f'显示器 {i+1}')
            })
        return {
            'count': len(screens),
            'screens': screens
        }
    except Exception as e:
        return {
            'count': 0,
            'screens': [],
            'error': str(e)
        }


def generate_html_report(process_info, screen_info):
    """生成HTML报告"""
    # 按内存使用率排序获取TOP10
    memory_top10 = sorted(process_info, key=lambda x: x['memory_percent'], reverse=True)[:10]
    # 按CPU使用率排序获取TOP10
    cpu_top10 = sorted(process_info, key=lambda x: x['cpu_percent'], reverse=True)[:10]
    
    # 生成报告时间
    report_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # 构建HTML内容
    html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系统资源监控报告 - {report_time}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        h1, h2 {{ color: #333; }}
        table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        tr:nth-child(even) {{ background-color: #f9f9f9; }}
        .container {{ max-width: 1200px; margin: 0 auto; }}
        .info-box {{ background-color: #e7f3fe; border-left: 6px solid #2196F3; padding: 10px; margin-bottom: 15px; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>系统资源监控报告</h1>
        <div class="info-box">
            <p><strong>报告生成时间:</strong> {report_time}</p>
        </div>
        
        <h2>屏幕信息</h2>
        <div class="info-box">
            <p><strong>显示器数量:</strong> {screen_info['count']}</p>
    """
    
    # 添加屏幕详细信息
    if screen_info['count'] > 0:
        html += """        <table>
            <tr>
                <th>ID</th>
                <th>名称</th>
                <th>分辨率</th>
            </tr>
"""
        for screen in screen_info['screens']:
            html += f"""            <tr>
                <td>{screen['id']}</td>
                <td>{screen['name']}</td>
                <td>{screen['width']} x {screen['height']}</td>
            </tr>
"""
        html += "        </table>"
    else:
        html += f"        <p>无法获取屏幕信息: {screen_info.get('error', '未知错误')}</p>"
    
    html += """        </div>
        
        <h2>内存占用 TOP 10</h2>
        <table>
            <tr>
                <th>PID</th>
                <th>应用名称</th>
                <th>用户</th>
                <th>内存占用 (%)</th>
                <th>运行时长</th>
            </tr>
"""
    
    # 添加内存TOP10进程信息
    for proc in memory_top10:
        html += f"""            <tr>
                <td>{proc['pid']}</td>
                <td>{proc['name']}</td>
                <td>{proc['username']}</td>
                <td>{proc['memory_percent']:.2f}%</td>
                <td>{proc['runtime']}</td>
            </tr>
"""
    
    html += """        </table>
        
        <h2>CPU占用 TOP 10</h2>
        <table>
            <tr>
                <th>PID</th>
                <th>应用名称</th>
                <th>用户</th>
                <th>CPU占用 (%)</th>
                <th>运行时长</th>
            </tr>
"""
    
    # 添加CPU TOP10进程信息
    for proc in cpu_top10:
        html += f"""            <tr>
                <td>{proc['pid']}</td>
                <td>{proc['name']}</td>
                <td>{proc['username']}</td>
                <td>{proc['cpu_percent']:.2f}%</td>
                <td>{proc['runtime']}</td>
            </tr>
"""
    
    html += """        </table>
    </div>
</body>
</html>
"""
    
    return html


def setup_cron_job(frequency):
    """设置cron任务"""
    script_path = os.path.abspath(__file__)
    output_dir = os.path.expanduser("~/system_reports")
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 根据频率设置cron表达式
    if frequency == 'daily':
        cron_time = "0 9 * * *"  # 每天早上9点
        print(f"设置每天执行一次，时间为早上9点")
    elif frequency == 'weekly':
        cron_time = "0 9 * * 1"  # 每周一早上9点
        print(f"设置每周执行一次，时间为周一早上9点")
    else:
        print(f"不支持的频率: {frequency}")
        return False
    
    # 构建cron命令
    cron_cmd = f"{cron_time} {script_path} --output {output_dir}/report_$(date +\%Y\%m\%d_\%H\%M\%S).html"
    
    # 检查现有cron任务
    try:
        existing_crontab = subprocess.check_output("crontab -l", shell=True, text=True)
    except subprocess.CalledProcessError:
        existing_crontab = ""
    
    # 检查是否已经存在相同的任务
    if script_path in existing_crontab:
        print("已存在相同的cron任务，请先移除")
        return False
    
    # 添加新的cron任务
    new_crontab = existing_crontab.strip() + "\n" + cron_cmd + "\n"
    try:
        process = subprocess.Popen("crontab -", stdin=subprocess.PIPE, shell=True, text=True)
        process.communicate(input=new_crontab)
        if process.returncode == 0:
            print(f"成功添加cron任务: {cron_cmd}")
            return True
        else:
            print("添加cron任务失败")
            return False
    except Exception as e:
        print(f"设置cron任务时出错: {e}")
        return False


def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='系统资源监控工具')
    parser.add_argument('--output', type=str, help='输出HTML报告的文件路径')
    parser.add_argument('--schedule', choices=['once', 'daily', 'weekly'], 
                        default='once', help='执行频率: once(单次), daily(每天), weekly(每周)')
    args = parser.parse_args()
    
    # 如果选择定期执行，设置cron任务
    if args.schedule != 'once':
        if setup_cron_job(args.schedule):
            print(f"已设置{args.schedule}执行的cron任务")
        else:
            print("设置cron任务失败")
        return
    
    # 获取进程信息
    print("正在收集系统信息...")
    process_info = get_process_info()
    screen_info = get_screen_info()
    
    # 生成HTML报告
    html_report = generate_html_report(process_info, screen_info)
    
    # 确定输出路径
    if args.output:
        output_path = args.output
    else:
        # 默认输出到用户主目录下的system_reports目录
        output_dir = os.path.expanduser("~/system_reports")
        os.makedirs(output_dir, exist_ok=True)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(output_dir, f"system_report_{timestamp}.html")
    
    # 写入HTML报告
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_report)
    
    print(f"报告已生成: {output_path}")
    print(f"可以使用浏览器打开查看报告")


if __name__ == "__main__":
    main()