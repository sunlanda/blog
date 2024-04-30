# 如何进行github gitlab gitee 多git平台免输入账号密码提交和拉取代码

## 这篇文章解决什么问题
* 每次pull/push 代码需要输入账号密码(因为git clone 时用的https的,改成SSH方式就不用输入密码了)
* 有多个git平台需要提交代码,如github gitlab gitee甚至公司私有的git平台仓库(每个git平台对应的公钥需要匹配你本地.ssh文件夹中的私钥)

**举例说明:**
* 之前你进仓库存放东西,有个仓库管理员让你输入身份证后验证你是你,然后去仓库帮你把东西取出来给你.你不想每次都输入身份证,就让物管给你配了一把你私人仓库的钥匙,然后你每次来存取东西就可以直接拿钥匙来开锁就行了(锁是git平台的公钥,钥匙是你兜里的私钥)
* 我带钥匙进门,这很合理把.


## 一.本地生成公钥私钥

我们可以理解ssh keygen -C -s  就是给你想访问的仓库对你配了一把钥匙 而公钥(锁) 放在这个仓库, 私钥就是你的钥匙.
三个仓库,就可以分别配三把. 道理是一样的.

### 生成公钥私钥
```sh
cd ~/.ssh
ssh-keygen  -t rsa  -C "your@email.com"
```
### 用config配置不同git平台的密钥
![](media/15856476382620/16387721363480.jpg)
核心是.ssh中写入config (没有config 可以 使用命令行 touch config 或者  vi config创建) 内容存储如下:
``` sh
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_gitee

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_github
```

### 复制公钥到git平台
.ssh文件目录一般放在本机中当前登录用户的用户目录文件下: 
如mac的是: cd ~/.ssh 
windows 是 C盘 User下面当前用户中的目录
如果你之前已经生成过ras_pub没关系,只需要

```sh
pbcopy  < ./id_rsa.pub
```

参考: [github关于SSH配置的文档](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)



## 二.git仓库设置中添加公钥
这一步是为了在对pull/push代码到git平台时区分你是谁
![](media/15856476382620/16387732397540.jpg)

* 进入git平台的设置页面: [https://github.com/settings/keys](https://github.com/settings/keys)
* New SSH Key 点击添加然后步骤一中copy的rsa.pub文件粘贴进去



## 验证是否成功
配置完成后,使用命令 
```sh
ssh  -T git@github.com
ssh  -T git@gitee.com
```
进行测试, 得到:
![](media/15856476382620/16387606550654.jpg)

即代表测试某个git平台成功连接,后面clone 或者pull/push 就不需要输入账号密码了,开启你的欢乐提代码之路吧~