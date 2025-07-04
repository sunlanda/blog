#!/bin/bash
# 系统资源监控脚本 (Shell版本)
# 此脚本收集系统资源使用情况并生成HTML报告

# 设置输出目录
OUTPUT_DIR="$HOME/system_reports"
mkdir -p "$OUTPUT_DIR"

# 生成时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="$OUTPUT_DIR/system_report_$TIMESTAMP.html"

# 获取屏幕信息（macOS特定）
get_screen_info() {
  # 使用system_profiler获取显示器信息
  if command -v system_profiler &> /dev/null; then
    DISPLAY_INFO=$(system_profiler SPDisplaysDataType)
    SCREEN_COUNT=$(echo "$DISPLAY_INFO" | grep -c 'Display Type')
    SCREEN_DETAILS=$(echo "$DISPLAY_INFO" | grep -A 15 'Display Type' | grep -E 'Display Type|Resolution')
  else
    SCREEN_COUNT="无法获取（需要system_profiler）"
    SCREEN_DETAILS="无法获取显示器详细信息"
  fi
}

# 获取进程信息
get_process_info() {
  # 获取内存使用TOP10
  if [[ "$(uname)" == "Darwin" ]]; then
    # macOS系统
    MEM_PROCESSES=$(ps -axm -o pid,pmem,rss,comm,user,lstart | sort -nr -k 2 | head -10)
    # 获取CPU使用TOP10
    CPU_PROCESSES=$(ps -axr -o pid,pcpu,time,comm,user,lstart | head -10)
  else
    # Linux系统
    MEM_PROCESSES=$(ps -axo pid,pmem,rss,comm,user,lstart --sort=-pmem | head -10)
    CPU_PROCESSES=$(ps -axo pid,pcpu,time,comm,user,lstart --sort=-pcpu | head -10)
  fi
}

# 生成HTML报告
generate_html_report() {
  REPORT_TIME=$(date +"%Y-%m-%d %H:%M:%S")
  
  # HTML头部
  cat > "$OUTPUT_FILE" << EOL
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系统资源监控报告 - $REPORT_TIME</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .container { max-width: 1200px; margin: 0 auto; }
        .info-box { background-color: #e7f3fe; border-left: 6px solid #2196F3; padding: 10px; margin-bottom: 15px; }
        pre { white-space: pre-wrap; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>系统资源监控报告</h1>
        <div class="info-box">
            <p><strong>报告生成时间:</strong> $REPORT_TIME</p>
            <p><strong>系统:</strong> $(uname -s) $(uname -r)</p>
        </div>
        
        <h2>屏幕信息</h2>
        <div class="info-box">
            <p><strong>显示器数量:</strong> $SCREEN_COUNT</p>
            <pre>$SCREEN_DETAILS</pre>
        </div>
        
        <h2>内存占用 TOP 10</h2>
        <table>
            <tr>
                <th>PID</th>
                <th>内存占用 (%)</th>
                <th>RSS</th>
                <th>应用名称</th>
                <th>用户</th>
                <th>启动时间</th>
            </tr>
EOL

  # 添加内存TOP10进程信息
  echo "$MEM_PROCESSES" | while read line; do
    if [[ ! "$line" =~ PID ]]; then  # 跳过标题行
      echo "            <tr>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $1}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $2}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $3}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $4}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $5}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $6, $7, $8, $9, $10, $11}')</td>" >> "$OUTPUT_FILE"
      echo "            </tr>" >> "$OUTPUT_FILE"
    fi
  done

  # CPU表格
  cat >> "$OUTPUT_FILE" << EOL
        </table>
        
        <h2>CPU占用 TOP 10</h2>
        <table>
            <tr>
                <th>PID</th>
                <th>CPU占用 (%)</th>
                <th>运行时间</th>
                <th>应用名称</th>
                <th>用户</th>
                <th>启动时间</th>
            </tr>
EOL

  # 添加CPU TOP10进程信息
  echo "$CPU_PROCESSES" | while read line; do
    if [[ ! "$line" =~ PID ]]; then  # 跳过标题行
      echo "            <tr>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $1}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $2}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $3}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $4}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $5}')</td>" >> "$OUTPUT_FILE"
      echo "                <td>$(echo $line | awk '{print $6, $7, $8, $9, $10, $11}')</td>" >> "$OUTPUT_FILE"
      echo "            </tr>" >> "$OUTPUT_FILE"
    fi
  done

  # HTML尾部
  cat >> "$OUTPUT_FILE" << EOL
        </table>
    </div>
</body>
</html>
EOL
}

# 设置cron任务
setup_cron_job() {
  FREQUENCY=$1
  SCRIPT_PATH=$(realpath "$0")
  
  # 根据频率设置cron表达式
  if [ "$FREQUENCY" == "daily" ]; then
    CRON_TIME="0 9 * * *"  # 每天早上9点
    echo "设置每天执行一次，时间为早上9点"
  elif [ "$FREQUENCY" == "weekly" ]; then
    CRON_TIME="0 9 * * 1"  # 每周一早上9点
    echo "设置每周执行一次，时间为周一早上9点"
  else
    echo "不支持的频率: $FREQUENCY"
    return 1
  fi
  
  # 构建cron命令
  CRON_CMD="$CRON_TIME $SCRIPT_PATH"
  
  # 检查现有cron任务
  EXISTING_CRONTAB=$(crontab -l 2>/dev/null || echo "")
  
  # 检查是否已经存在相同的任务
  if echo "$EXISTING_CRONTAB" | grep -q "$SCRIPT_PATH"; then
    echo "已存在相同的cron任务，请先移除"
    return 1
  fi
  
  # 添加新的cron任务
  (echo "$EXISTING_CRONTAB"; echo "$CRON_CMD") | crontab -
  
  if [ $? -eq 0 ]; then
    echo "成功添加cron任务: $CRON_CMD"
    return 0
  else
    echo "添加cron任务失败"
    return 1
  fi
}

# 主函数
main() {
  # 检查是否有调度参数
  if [ "$1" == "--schedule" ]; then
    if [ -z "$2" ]; then
      echo "错误: 缺少调度频率参数"
      echo "用法: $0 [--schedule once|daily|weekly] [--output 文件路径]"
      exit 1
    fi
    
    if [ "$2" != "once" ]; then
      setup_cron_job "$2"
      exit $?
    fi
    shift 2
  fi
  
  # 检查是否有输出文件参数
  if [ "$1" == "--output" ]; then
    if [ -z "$2" ]; then
      echo "错误: 缺少输出文件路径"
      echo "用法: $0 [--schedule once|daily|weekly] [--output 文件路径]"
      exit 1
    fi
    OUTPUT_FILE="$2"
    shift 2
  fi
  
  echo "正在收集系统信息..."
  get_screen_info
  get_process_info
  
  echo "正在生成HTML报告..."
  generate_html_report
  
  echo "报告已生成: $OUTPUT_FILE"
  echo "可以使用浏览器打开查看报告"
}

# 显示使用帮助
show_help() {
  echo "系统资源监控工具 (Shell版本)"
  echo "用法: $0 [--schedule once|daily|weekly] [--output 文件路径]"
  echo ""
  echo "选项:"
  echo "  --schedule FREQ   设置执行频率: once(单次), daily(每天), weekly(每周)"
  echo "  --output FILE     指定输出HTML报告的文件路径"
  echo "  --help            显示此帮助信息"
  echo ""
  echo "示例:"
  echo "  $0                           # 单次执行，输出到默认位置"
  echo "  $0 --output report.html      # 单次执行，输出到指定文件"
  echo "  $0 --schedule daily          # 设置为每天执行"
  echo "  $0 --schedule weekly         # 设置为每周执行"
}

# 解析命令行参数
if [ "$1" == "--help" ]; then
  show_help
  exit 0
fi

# 执行主函数
main "$@"