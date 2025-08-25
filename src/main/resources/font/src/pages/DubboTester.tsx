// 引入 React 的 useEffect，用于副作用处理
import { useEffect } from 'react';
// 引入端口标签页组件
import PortTabs from '@/components/DubboTester/PortTabs';
// 引入服务目录组件
import ServiceDirectory from '@/components/DubboTester/ServiceDirectory';
// 引入控制面板组件
import ControlPanel from '@/components/DubboTester/ControlPanel';
// 引入请求参数面板组件
import RequestPanel from '@/components/DubboTester/RequestPanel';
// 引入响应结果面板组件
import ResponsePanel from '@/components/DubboTester/ResponsePanel';
// 引入自定义 hook，用于管理 Dubbo 测试器的状态和逻辑
import { useDubboTester } from '@/hooks/useDubboTester';

// Notification 组件：用于显示操作成功或失败的提示信息
const Notification = ({
  notification,
}: {
  notification: { message: string; type: 'success' | 'error'; visible: boolean } | null;
}) => {
  // 如果没有通知或通知不可见，则不渲染任何内容
  if (!notification || !notification.visible) return null;

  // 根据通知类型设置背景色
  const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';
  // 根据通知类型选择图标
  const icon = notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right duration-300`}
    >
      <i className={`fa-solid ${icon}`}></i>
      <span className="text-sm font-medium">{notification.message}</span>
    </div>
  );
};

export default function DubboTester() {
  const {
    ports,
    activePort,
    setActivePort,
    services,
    activeService,
    setActiveService,
    methods,
    activeMethod,
    setActiveMethod,
    testCases,
    selectedTestCase,
    setSelectedTestCase,
    requestParams,
    setRequestParams,
    responseData,
    isLoading,
    isLoadingServices,
    isLoadingMethods,
    directoryData,
    addPort,
    updatePort,
    removePort,
    loadHistoryParams,
    handleSendRequest,
    handleAddTestCase,
    handleUpdateTestCase,
    handleRenameTestCase,
    handleDeleteRequest,
    loadServices,
    loadMethods,
    formatServiceNameForDisplay,
    notification
  } = useDubboTester();

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否按下了 Command + S (Mac) 或 Ctrl + S (Windows/Linux)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isSaveShortcut = (isMac && event.metaKey && event.key === 's') ||
        (!isMac && event.ctrlKey && event.key === 's');

      if (isSaveShortcut) {
        event.preventDefault(); // 阻止默认的浏览器保存行为

        // 检查是否有选中的测试用例
        if (selectedTestCase) {
          // 如果有选中的测试用例，执行更新操作
          handleUpdateTestCase();
        } else {
          // 如果没有选中的测试用例，执行新增操作
          handleAddTestCase();
        }
      }
    };

    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTestCase, handleUpdateTestCase, handleAddTestCase]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Notification */}
      <Notification notification={notification} />

      {/* 顶部端口页签 */}
      <PortTabs
        ports={ports}
        activePort={activePort}
        setActivePort={setActivePort}
        addPort={addPort}
        updatePort={updatePort}
        removePort={removePort}
        className="border-b border-gray-200 bg-white shadow-sm z-10 flex-shrink-0"
      />

      {/* 主内容区 - 固定高度，不滚动 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 左侧服务目录 */}
        <ServiceDirectory
          directoryData={directoryData}
          activeService={activeService}
          activeMethod={activeMethod}
          setActiveService={setActiveService}
          setActiveMethod={setActiveMethod}
          setSelectedTestCase={setSelectedTestCase}
          selectedTestCase={selectedTestCase}
          onUpdateRequest={handleRenameTestCase}
          onDeleteRequest={handleDeleteRequest}
          onLoadHistoryParams={loadHistoryParams}
          onUpdateTestCase={handleUpdateTestCase}
          className="w-[350px] border-r border-gray-200 bg-white p-4 flex-shrink-0 overflow-y-auto"
        />

        {/* 中间控制面板 */}
        <ControlPanel
          activePort={activePort}
          activeService={activeService}
          activeMethod={activeMethod}
          testCases={testCases}
          selectedTestCase={selectedTestCase}
          services={services}
          methods={methods}
          ports={ports}
          setActiveService={setActiveService}
          setActiveMethod={setActiveMethod}
          setSelectedTestCase={setSelectedTestCase}
          onSendRequest={handleSendRequest}
          onAddTestCase={handleAddTestCase}
          onUpdateTestCase={handleUpdateTestCase}
          onLoadTestCase={loadHistoryParams}
          isLoading={isLoading}
          isLoadingServices={isLoadingServices}
          isLoadingMethods={isLoadingMethods}
          setRequestParams={setRequestParams}
          loadServices={loadServices}
          loadMethods={loadMethods}
          formatServiceNameForDisplay={formatServiceNameForDisplay}
          className="w-[340px] border-r border-gray-200 bg-white p-4 flex-shrink-0 overflow-y-auto"
        />

        {/* 右侧请求和响应区域 - 固定高度 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <RequestPanel
            requestParams={requestParams}
            setRequestParams={setRequestParams}
            className="h-1/2 border-b border-gray-200 bg-white p-4 overflow-y-auto"
          />
          <ResponsePanel
            responseData={responseData}
            className="h-1/2 bg-white p-4"
          />
        </div>
      </div>
    </div>
  );
}