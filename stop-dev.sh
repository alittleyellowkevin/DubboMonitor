#!/bin/bash

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 停止 Dubbo Monitor 开发环境...${NC}"

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
    else
        echo -e "${GREEN}✅ 端口 $port 未被占用${NC}"
    fi
}

# 1. 尝试从PID文件读取进程ID
if [ -f "/tmp/dubbo-backend.pid" ]; then
    BACKEND_PID=$(cat /tmp/dubbo-backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}🛑 终止后端进程 $BACKEND_PID...${NC}"
        kill $BACKEND_PID 2>/dev/null
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill -9 $BACKEND_PID 2>/dev/null
        fi
        echo -e "${GREEN}✅ 后端进程已终止${NC}"
    fi
    rm -f /tmp/dubbo-backend.pid
fi

if [ -f "/tmp/dubbo-frontend.pid" ]; then
    FRONTEND_PID=$(cat /tmp/dubbo-frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}🛑 终止前端进程 $FRONTEND_PID...${NC}"
        kill $FRONTEND_PID 2>/dev/null
        sleep 2
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill -9 $FRONTEND_PID 2>/dev/null
        fi
        echo -e "${GREEN}✅ 前端进程已终止${NC}"
    fi
    rm -f /tmp/dubbo-frontend.pid
fi

# 2. 杀掉相关端口的进程
echo -e "${BLUE}🔥 清理端口占用...${NC}"
kill_port $BACKEND_PORT "后端服务"
kill_port $FRONTEND_PORT "前端服务"

# 3. 清理其他可能的Dubbo进程
echo -e "${YELLOW}🔍 查找其他相关进程...${NC}"
DUBBO_PROCESSES=$(ps aux | grep -E "(java.*dubbo|spring-boot.*run|pnpm.*dev)" | grep -v grep | awk '{print $2}')

if [ -n "$DUBBO_PROCESSES" ]; then
    echo -e "${RED}📍 发现相关进程: $DUBBO_PROCESSES${NC}"
    for pid in $DUBBO_PROCESSES; do
        echo -e "${RED}🛑 终止相关进程 $pid...${NC}"
        kill -9 $pid 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 成功终止进程 $pid${NC}"
        fi
    done
else
    echo -e "${GREEN}✅ 未发现其他相关进程${NC}"
fi

# 4. 清理临时文件
echo -e "${YELLOW}🧹 清理临时文件...${NC}"
find /tmp -name "dubbo-*.pid" -delete 2>/dev/null
find /tmp -name "spring-*.log" -delete 2>/dev/null

echo -e "${GREEN}✅ Dubbo Monitor 开发环境已完全停止！${NC}"
