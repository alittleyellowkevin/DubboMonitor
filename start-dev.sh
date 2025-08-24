#!/bin/bash

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 开始启动 Dubbo Monitor 开发环境...${NC}"

# 端口定义
BACKEND_PORT=8080
FRONTEND_PORT=3000

# 函数：杀掉占用指定端口的进程
kill_port() {
    local port=$1
    local name=$2
    echo -e "${YELLOW}🔍 检查端口 $port ($name)...${NC}"

    # 查找占用端口的进程
    local pids=$(lsof -ti:$port 2>/dev/null)

    if [ -n "$pids" ]; then
        echo -e "${RED}📍 发现进程占用端口 $port: $pids${NC}"
        for pid in $pids; do
            echo -e "${RED}🛑 终止进程 $pid...${NC}"
            kill -9 $pid 2>/dev/null
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ 成功终止进程 $pid${NC}"
            else
                echo -e "${RED}❌ 终止进程 $pid 失败${NC}"
            fi
        done
        sleep 2
    else
        echo -e "${GREEN}✅ 端口 $port 未被占用${NC}"
    fi
}

# 1. 杀掉相关端口的进程
echo -e "${BLUE}🔥 清理端口占用...${NC}"
kill_port $BACKEND_PORT "后端服务"
kill_port $FRONTEND_PORT "前端服务"

# 2. 检查Java环境
echo -e "${BLUE}☕ 检查Java环境...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java 未安装或不在PATH中${NC}"
    exit 1
fi
java -version

# 3. 检查Maven环境
echo -e "${BLUE}📦 检查Maven环境...${NC}"
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven 未安装或不在PATH中${NC}"
    exit 1
fi
mvn -version

# 4. 检查pnpm环境
echo -e "${BLUE}📦 检查pnpm环境...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm 未安装或不在PATH中${NC}"
    echo -e "${YELLOW}💡 请先安装 pnpm: npm install -g pnpm${NC}"
    exit 1
fi
pnpm -version

# 5. 清理并编译后端
echo -e "${BLUE}🔨 清理并编译后端项目...${NC}"
cd /Users/huangkaiwen/Desktop/lexin/dubbo_monitor

# 清理target目录
if [ -d "target" ]; then
    echo -e "${YELLOW}🧹 清理target目录...${NC}"
    rm -rf target
fi

# Maven编译
echo -e "${YELLOW}📦 编译后端项目...${NC}"
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端编译失败${NC}"
    exit 1
fi

# 6. 启动后端服务
echo -e "${GREEN}🚀 启动后端服务 (端口 $BACKEND_PORT)...${NC}"
mvn spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
echo -e "${YELLOW}⏳ 等待后端服务启动...${NC}"
sleep 10

# 检查后端是否启动成功
if ! lsof -ti:$BACKEND_PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}✅ 后端服务已启动在端口 $BACKEND_PORT (PID: $BACKEND_PID)${NC}"

# 7. 启动前端服务
echo -e "${GREEN}🚀 启动前端服务 (端口 $FRONTEND_PORT)...${NC}"
cd src/main/resources/font
pnpm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端依赖安装失败${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

pnpm dev &
FRONTEND_PID=$!

# 等待前端启动
echo -e "${YELLOW}⏳ 等待前端服务启动...${NC}"
sleep 5

# 检查前端是否启动成功
if ! lsof -ti:$FRONTEND_PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ 前端服务启动失败${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ 前端服务已启动在端口 $FRONTEND_PORT (PID: $FRONTEND_PID)${NC}"

# 8. 输出启动信息
echo -e "${GREEN}🎉 Dubbo Monitor 开发环境启动成功！${NC}"
echo -e "${BLUE}📊 服务信息:${NC}"
echo -e "   🔧 后端API: http://localhost:$BACKEND_PORT"
echo -e "   🌐 前端界面: http://localhost:$FRONTEND_PORT"
echo -e "   📊 进程信息:"
echo -e "      - 后端 PID: $BACKEND_PID"
echo -e "      - 前端 PID: $FRONTEND_PID"

# 保存进程信息到文件
echo "$BACKEND_PID" > /tmp/dubbo-backend.pid
echo "$FRONTEND_PID" > /tmp/dubbo-frontend.pid

echo -e "${YELLOW}💡 提示: 可以使用 stop-dev.sh 脚本停止所有服务${NC}"

# 保持脚本运行状态，显示日志
echo -e "${BLUE}📝 显示服务日志...${NC}"
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"

# 等待用户中断
trap "echo -e '${RED}🛑 正在停止服务...${NC}'; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; rm -f /tmp/dubbo-backend.pid /tmp/dubbo-frontend.pid; echo -e '${GREEN}✅ 服务已停止${NC}'; exit 0" INT

# 等待进程结束
wait
