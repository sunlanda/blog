# 前端开发快速入门Docker

## 是什么

Docker是一种容器化技术，可以将应用及其依赖打包成一个轻量级、可移植的容器。它就像一个标准化的集装箱，能够抹平不同环境之间的差异，解决"在我的机器上能运行"的问题。

对于前端开发者来说，Docker能够解决以下问题：

1. **环境一致性**：确保开发、测试和生产环境的一致性，避免因环境差异导致的问题。

2. **快速部署**：简化部署流程，一次构建，到处运行。

3. **隔离依赖**：避免依赖冲突，每个项目可以使用不同版本的Node.js、npm等工具。

4. **团队协作**：新成员可以快速搭建开发环境，无需繁琐的环境配置。

以下是一个简单的例子，展示如何使用Docker运行一个React应用：

```bash
# 拉取Node.js镜像
docker pull node:18

# 运行容器并挂载当前目录
docker run -it -v $(pwd):/app -w /app -p 3000:3000 node:18 bash

# 在容器内安装依赖并启动应用
npm install
npm start
```

## 部署应用参数化、流水线化

Docker通过Dockerfile实现应用的参数化构建和部署。Dockerfile就像前端项目中的package.json，它定义了镜像的构建过程和运行环境。

### Dockerfile基础指令

```dockerfile
# 基础镜像
FROM node:18-alpine

# 添加元数据
LABEL author="frontend-team"
LABEL version="1.0"

# 创建工作目录
RUN mkdir -p /usr/src/app

# 复制项目文件
COPY package*.json /usr/src/app/
COPY . /usr/src/app/

# 设置环境变量
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai

# 暴露端口
EXPOSE 3000

# 设置工作目录
WORKDIR /usr/src/app

# 安装依赖
RUN npm install

# 构建应用
RUN npm run build

# 启动命令: 不要怀疑 这行命令就 == npm run start
CMD ["npm", "start"]
```

### 构建和运行Docker镜像

```bash
# 构建镜像
docker build -t my-react-app .

# 运行容器
docker run -d -p 3000:3000 --name my-app-container my-react-app
```

### 实际案例：前端项目的CI/CD流水线

在实际项目中，我们可以结合GitLab CI/CD或GitHub Actions，实现前端项目的自动化构建和部署：
具体如何利用`yaml`触发 Actions,可以看我这篇文章: [如何使用GitHub Workflow部署静态网站?](./how-to-deploy-static-page-for-github-action)

```yaml
# .gitlab-ci.yml 示例
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -t my-react-app:$CI_COMMIT_SHORT_SHA .
    - docker push my-react-app:$CI_COMMIT_SHORT_SHA

deploy:
  stage: deploy
  script:
    - docker pull my-react-app:$CI_COMMIT_SHORT_SHA
    - docker stop my-app-container || true
    - docker rm my-app-container || true
    - docker run -d -p 3000:3000 --name my-app-container my-react-app:$CI_COMMIT_SHORT_SHA
```

## 创建自己的镜像

为了满足特定的开发需求，我们可以创建自定义的Docker镜像，添加所需的依赖和工具。

### 添加常用前端开发依赖

以下是一个为前端开发定制的Dockerfile示例，包含了常用的工具和依赖：

```dockerfile
FROM node:18-alpine

# 安装常用工具
RUN apk add --no-cache git curl bash

# 安装全局依赖
RUN npm install -g yarn nrm nvm http-server

# 设置工作目录
WORKDIR /app

# 预安装常用依赖
RUN yarn global add @vue/cli create-react-app typescript

# 设置默认命令
CMD ["bash"]
```

### 构建和发布自定义镜像

```bash
# 构建镜像
docker build -t username/frontend-dev:latest .

# 登录Docker Hub
docker login

# 推送镜像到Docker Hub
docker push username/frontend-dev:latest
```

发布到[Docker Hub](https://hub.docker.com/)后，其他开发者可以直接使用你的镜像，无需重复配置环境。
如果不想发布公网,可以试试私有开源镜像仓库软件 [harbor](https://github.com/goharbor/harbor)
具备可视化web界面进行管理,有点类似k8s

## 使用自定义镜像

一旦创建并发布了自定义镜像，团队成员可以直接使用它来启动开发环境：

```bash
# 拉取自定义镜像
docker pull username/frontend-dev:latest

# 启动开发容器
docker run -it -v $(pwd):/app -p 3000:3000 username/frontend-dev:latest
```

在团队协作中，这种方式可以确保所有成员使用相同的开发环境，减少环境差异导致的问题。
在这里提一下 `docker pull` 的时候如果镜像很大,经常失败,有可能是网络问题 ,需要科学上网一下或者配置国内的`docker`源,这里放一个aliyun生成个人源的网址.

```json
{
  
}
```
## 端口映射与网络配置

Docker容器默认是隔离的，需要通过端口映射来访问容器内的服务。

### 端口映射

```bash
# 格式：-p 主机端口:容器端口
docker run -p 8080:80 nginx
```

这个命令可以将主机的8080端口映射到容器的80端口，这样我们就可以通过访问`http://localhost:8080`来访问容器内的nginx服务。

### 多端口映射

对于前端开发，我们可能需要映射多个端口：

```bash
# 同时映射多个端口
docker run -p 3000:3000 -p 9000:9000 my-frontend-app
```

### 安全组配置

在云服务器上部署Docker容器时，别忘了在安全组中放行相应的端口，否则外部无法访问：
防火墙信息可以这么查看: 
``` ufw list ``` 


```bash
# 阿里云CLI示例
aliyun ecs AuthorizeSecurityGroup --SecurityGroupId sg-xxx --IpProtocol tcp --PortRange 8080/8080 --SourceCidrIp 0.0.0.0/0
```

## 常见命令

已经使用过并认为是高频的命令,贴在下面了

### 容器管理

```bash
# 查看运行中的容器
docker ps
# 查看所有容器（包括已停止的）
docker ps -a
# 启动|停止|重启 容器
docker start|stop|restart container_id
# 删除容器
docker rm container_id
```

### 镜像管理

```bash
# 查看本地镜像
docker images

# 拉取镜像
docker pull image_name:tag

# 删除镜像
docker rmi image_id

# 构建镜像
docker build -t image_name:tag .
```

### 容器交互

```bash
# 进入容器终端
docker exec -it container_id bash

# 查看容器日志
docker logs container_id

# 查看容器详细信息
docker inspect container_id

# 复制文件到容器
docker cp local_file container_id:/path/in/container

# 从容器复制文件到本地
docker cp container_id:/path/in/container local_path
```

### 实用技巧

```bash
# 清理未使用的资源
docker system prune

# 查看容器资源使用情况
docker stats

# 创建自定义网络(这个在私有化部署中很有用)
docker network create my-network

# 将容器连接到网络
docker network connect my-network container_id
```

## 最后放一个完成品
可以利用这个文件直接引用镜像
修改其中的参数,再执行

```sh
```
就可以完成docker进行项目的部署啦
