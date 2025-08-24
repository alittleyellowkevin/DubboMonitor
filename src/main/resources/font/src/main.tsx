// 引入 React 的严格模式组件
import { StrictMode } from "react";
// 引入 React 18 的 createRoot 方法，用于挂载根组件
import { createRoot } from "react-dom/client";
// 引入 React Router 的 BrowserRouter，用于前端路由管理
import { BrowserRouter } from "react-router-dom";
// 引入 sonner 的 Toaster 组件，用于全局消息提示
import { Toaster } from 'sonner';
// 引入主应用组件
import App from "./App.tsx";
// 引入全局样式
import "./index.css";

// 挂载 React 应用到页面的 root 节点
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
