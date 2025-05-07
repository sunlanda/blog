# 使用python识别数字发票


## 实现思路
题外话: 如果不知道怎么做,一般就是搜google bing 找到是否有前人已经实现过了,如果有思路比自己考虑周全在哪里,自己演算完步骤后,去和大家对比.
同时建议使用灵魂三问: 
1. 为什么要做这个功能 -> (提升自己自己满意| 市场需求)
2. 这个功能实现了有什么价值 -> 是不是值得做()
3. 所依赖技术栈难度,预计实现时间 -> 自己能不能搞的定,即使搞不定能做到什么程度,阶段结果也行

### 1. 函数执行入口和参数设定
* 判空处理
* 支持文件目录的可能
* 分析pdf 内容

### 2. 解析pdf中的内容/解析二维码识别数据
分析所需功能 了解三方库
* pandas
* PDFly
  
### 3. 导出excel 或者组装json
* xlsx 
* json


### 4. 加强版或者完整考虑(展望)
* 是否发布pypi 作为公共包给大家使用
* 文件是否递归处理 -> 涉及数量级limit 
* 应用场景是否仅限于发票 -> OCR技术是否完全覆盖发票 
* 降级处理或者是否有扩展性 (譬如发票种类升级,如何调整字段) 是否拆包或者input 类型后允许plugin接入新发票种类

## 代码完整展示

```python
import os 
```


## 参考
* python教程zhihu: https://zhuanlan.zhihu.com/p/631049679
* py: https://blog.csdn.net/henanlion/article/details/130795715 https://blog.csdn.net/qq_34252622/article/details/140792129
* 数电发票网站: https://www.gov.cn/zhengce/zhengceku/202411/content_6989164.htm
* 微信发票助手功能分析: 
* 国家档案局: 电子发票全流程电子化管理指南https://www.saac.gov.cn/daj/yaow/202305/56ba8ade969145e69e241c1618bc5cad.shtml   https://www.saac.gov.cn/daj/qtwjk/202308/0f7f13108b7d4d0dbf699b078a99be67/files/53cfc8f979c6458fbcfe82c697cb5083.pdf