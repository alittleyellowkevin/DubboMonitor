// 引入 React Router 的 Routes 和 Route 组件，用于路由配置
import { Routes, Route } from "react-router-dom";
// 引入首页组件
import Home from "@/pages/Home";
// 引入 DubboTester 主功能页组件
import DubboTester from "@/pages/DubboTester";
// 引入 useState，用于管理登录状态
import { useState } from "react";
// 引入 AuthContext，用于全局认证状态管理
import { AuthContext } from '@/contexts/authContext';

// App 组件是整个前端应用的根组件，负责全局认证状态管理和路由配置
export default function App() {
  // isAuthenticated 表示用户是否已登录
  // setIsAuthenticated 用于更新登录状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // logout 函数用于登出操作，将登录状态设为 false
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    // 使用 AuthContext.Provider 提供全局认证状态和操作方法
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      {/* 配置前端路由，关联不同页面组件 */}
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<Home />} />
        {/* Dubbo 测试工具主页面路由 */}
        <Route path="/dubbo-tester" element={<DubboTester />} />
        {/* 其他页面（占位） */}
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}
