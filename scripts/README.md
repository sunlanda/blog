# 系统资源监控工具

这个目录包含两个系统资源监控脚本，分别是Python版本和Shell版本。这些脚本可以收集系统资源使用情况并生成HTML报告。

## 功能特点

- 收集内存占用TOP10的应用信息
- 收集CPU消耗TOP10的应用信息
- 显示应用已运行时长
- 获取屏幕尺寸信息
- 检测多显示器状态
- 支持单次执行或定期执行（使用cron）
- 生成美观的HTML格式报告

## Python版本 (system_monitor.py)

### 依赖项

使用Python版本需要安装以下依赖：

```bash
pip3 install psutil screeninfo
```

### 使用方法

```bash
# 单次执行，报告保存到默认位置（~/system_reports/）
python3 system_monitor.py

# 单次执行，指定输出文件
python3 system_monitor.py --output /path/to/report.html

# 设置为每天执行
python3 system_monitor.py --schedule daily

# 设置为每周执行
python3 system_monitor.py --schedule weekly
```

## Shell版本 (system_monitor.sh)

### 使用方法

首先确保脚本有执行权限：

```bash
chmod +x system_monitor.sh
```

然后可以使用以下命令：

```bash
# 单次执行，报告保存到默认位置（~/system_reports/）
./system_monitor.sh

# 单次执行，指定输出文件
./system_monitor.sh --output /path/to/report.html

# 设置为每天执行
./system_monitor.sh --schedule daily

# 设置为每周执行
./system_monitor.sh --schedule weekly

# 显示帮助信息
./system_monitor.sh --help
```

## 报告示例

生成的HTML报告包含以下部分：

1. 报告生成时间和系统信息
2. 屏幕信息（显示器数量和分辨率）
3. 内存占用TOP10的应用列表
4. CPU消耗TOP10的应用列表

报告默认保存在用户主目录下的`system_reports`文件夹中，文件名包含生成时间戳。

## 注意事项

- Python版本需要安装依赖库，但功能更完整
- Shell版本无需额外依赖，但在不同系统上可能需要调整
- 定期执行功能使用cron实现，确保系统支持cron服务
- 在macOS上，获取屏幕信息需要system_profiler命令