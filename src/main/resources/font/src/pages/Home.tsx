// 引入 Link 组件用于页面跳转
import { Link } from "react-router-dom";

// Home 组件：项目首页，展示工具介绍和入口按钮
export default function Home() {
  return (
    // 页面整体居中，浅灰色背景
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* 白色卡片容器，圆角和阴影效果 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Dubbo 测试工具
        </h1>
        {/* 工具介绍 */}
        <p className="text-gray-600 text-center mb-8">
          一个功能强大的Dubbo接口测试工具，帮助开发者快速测试和调试Dubbo服务
          <br />
        </p>
        {/* 进入测试按钮 */}
        <div className="flex justify-center">
          <Link
            to="/dubbo-tester"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            进入测试
            {/* 箭头图标 */}
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}