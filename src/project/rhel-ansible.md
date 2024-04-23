
# 服务器运维工具ansible的部署实践
## 背景
先抛一个问题, 如果你研发的应用需要部署上线在多台机器上.你是否有好的办法**批量操作**,又快又好的搞定呢 ? 
本篇会从部署应用到多台机器作为切入点 , 以介绍ansible的使用场景和使用方法为核心内容,带大家领略运维自动化工具: ansible 的魅力.


## ansible介绍
![ansible-logo](/ansible-logo.png)
近年来国内外IT技术发展飞速,在**云计算**的浪潮下,大量的云服务器需要被更方便的管理和运维,于是ansible在2012年诞生之初就得到了广大程序员和运维工程师的喜爱,2015年被红帽公司(**Redhat**)收购后逐步加大对ansible工具的支持,甚至在自家的认证考试中将ansible的使用能力打造成RHCE运维认证的专项内容. 足以可见ansible的优秀程度.

***

从2023年市场占有率和呼声来看,ansible就以第一名占有率荣获最受欢迎自动化运维工具.
![ansible-2022-top-data](/ansible-2022-top-data.png)

而对于程序员或者非职业运维同学来说,Ansible的好处就是.它是目前运维自动化工具中,学习路线较为平缓的一个,可以轻松地对服务器进行初始化配置，以及批量进行更新和打补丁操作。相较于**Chef、Puppet、Salt**等C/S（客户端/服务器）架构的自动化工具来说，尽管Ansible的性能并不是最好的，但由于它基于**SSH远程会话协议**，不需要客户端程序，只要知道受管主机的账号密码，就能直接用SSH协议进行远程控制.从而实现一对多的机器管理.

 


## ansible使用

背景介绍完后,我们来看看ansible是如何使用的,这里使用一张红帽公司官网的逻辑图来表示: 
![ansible-constructor](/ansible-constructor.png)


<span style="color: #f73423">核心逻辑是运维人员(**USERS**) 可以通过 剧本(**PLAYBOOK**) 对 ansible中四大功能进行调用 (**Inventory , API , Modules , Plugins**) 从而通过网络层(**NETWORKING**)实现对主机群(**HOSTS**)的批量控制 .</span>

如果想快速使用ansible,其中有几项关键的概念需要熟知: 
* **Inventory** (目录) 具体要控制的机器IP,全局变量等
* **playbook** (剧本) 编写各个演员需要完成的事项清单
* **ansible.cfg** (配置文件) 安装ansible后默认在/etc/ansible/路径下
    * plugin (插件) 
    * module (模块)
* 编写具体的playbook 如 adhoc.yml 
* 使用**ansible-playbook** 执行脚本
* 使用自带的roles角色,也可以使用**ansible-galaxy**管理角色

过程示意 : 
****
通过一台 **main** 机器来进行控制(**控制端**), 来控制多台**node**子节点(**受控端**),
![ansible-constructor-drawio](/ansible-constructor-drawio.png)


 ## 代码环节


ansible命令速查 (文档先行) : 
```sh
man ansible
```

![ansible-shell](/ansible-shell.png)
### 配置Inventory
```
# inventory文件内容
[dev]
172.25.250.254
[test]
172.25.250.257
[prod]
172.25.250.11
172.25.250.12
[webservers:children]
prod

# 查看Inventory主机
ansible-inventory --graph
```
![ansible-graph](/ansible-graph.png)


配置完inventory 和 ansible.cfg后就可以开始调动被控主机了.

### 命令示意
``` shell
# ansible 
-m  模块名
-a  模块执行的参数
-f 生成几个子执行程序
-u username 某主机的用户名
-c connection 连接方式

# 执行具体命令如: 
# 在test机器组中调用ping模块
ansible test -m ping 
ansible all -m debug -a 'var=XXX'
ansible-galaxy init /etc/ansible/roles

```
### 案例一: 批量配置yum仓库源:
![ansible-yum-setting](/ansible-yum-setting.png)

```sh
# setYum.yml
ansible all -m yum_repository -a 'name="EXP 294" description="$#$#$#$" gpgcheck=yes enabled=1 baseurl="XXXX" gpgkey="41234" '
ansible all -m yum_repository -a 'name="STEAM 294" description="$#$#$#$" gpgcheck=yes enabled=1 baseurl="XXXX" gpgkey="41234" '
```

### 案例二: cron.yml定时任务 :
```yml
# crom.yml
---
- name: every 2 minute execute the shell
  hosts: all
  tasks: 
    - name: one
      user:
        name: natasha
        state: present
    - name: two
      cron:
        name: "logger info"
        minute: "*/2"
        user: natasha
        job: logger "EX294 in progress "
```

### 案例三: 使用ansible自带的roles角色实现一个简单的负载均衡:

![ansible-galaxy-init](/ansible-galaxy-init.png)

``` yml
# balance.yml 
# 使用已经安装的balaner 角色进行负载均衡的输出
- name: one 
  hosts: balancers #  12机器
  roles: 
    - balancer
- name: two
  hosts: webservers # 13机器
  roles: 
    - phpinfo
- name: three
  hosts: webservers # 13机器
  roles: 
    - apache 

```


通过这三个小例子我们大概能弄明白ansible的能力, 通过main主机控制多个node节点机器,并且执行过程可追溯,可排查,命令操作也非常友好便捷.

  ## 价值与启发

1. 科技的进步让人类掌握了更多便捷的工具,从而能做更大更多有价值的事情,ansible就是运维领域的提效好帮手.
2. 大量重复的操作如果能通过参数和命令进行简化,将大大降低人工犯错的概率,提高软件系统的可用性.
3. ansible让我明白了除了前端领域还有更多自动化做得很好的软件和工具在我不知道的地方大放异彩,多学多探索才能更有收获. 


## 参考链接

- [2023投票分数](https://6sense.com/tech/configuration-management/ansible-vs-puppet)
- [投票对比图](https://merehead.com/blog/chef-vs-puppet-vs-ansible-vs-saltstack-better-2022/)
- [Puppet](https://github.com/puppetlabs/puppet)
- [Chef](https://github.com/chef/chef)
- [Salt](https://github.com/saltstack/salt)
- [Kubespray](https://github.com/kubernetes-sigs/kubespray)



