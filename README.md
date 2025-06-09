# Dubbo 服务监控

这是一个用于监控和测试 Dubbo 服务的 Web 应用程序。它提供了一个友好的 Web 界面，让你可以：

- 查看所有已注册的 Dubbo 服务
- 查看服务的方法列表
- 在线测试服务方法调用

## 技术栈

后端：
- Spring Boot 2.7.0
- Apache Dubbo 3.2.0
- ZooKeeper (用于服务发现)

前端：
- Vue 3
- Element Plus
- Vite

## 系统要求

- JDK 8 或更高版本
- Node.js 14 或更高版本
- ZooKeeper 服务器

## 快速开始

1. 启动 ZooKeeper 服务器

2. 启动后端服务
```bash
# 进入项目根目录
cd dubbo_monitor

# 使用 Maven 构建项目
mvn clean package

# 运行 Spring Boot 应用
java -jar target/dubbo-monitor-1.0-SNAPSHOT.jar
```

3. 启动前端服务
```bash
# 进入前端项目目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

4. 打开浏览器访问 http://localhost:5173

## 使用说明

1. 在左侧面板中可以看到所有已注册的 Dubbo 服务列表
2. 点击服务名称可以展开查看该服务的所有方法
3. 点击具体方法可以在右侧面板中进行测试
4. 在右侧面板中填写方法参数，点击"调用"按钮进行测试
5. 调用结果会显示在下方

## 配置说明

后端配置文件 `src/main/resources/application.yml`：
- 修改 `server.port` 更改服务端口
- 修改 `dubbo.registry.address` 配置 ZooKeeper 地址

前端配置文件 `frontend/vite.config.js`：
- 修改 proxy.target 地址以匹配后端服务地址

## 注意事项

1. 确保 ZooKeeper 服务正常运行
2. 确保要测试的 Dubbo 服务已经注册到 ZooKeeper
3. 参数值需要符合方法参数类型的要求 