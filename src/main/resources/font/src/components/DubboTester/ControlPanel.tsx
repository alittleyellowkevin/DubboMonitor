import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TestCase, Port } from '@/lib/types';

interface ControlPanelProps {
  activePort: string;
  activeService: string | null;
  activeMethod: string | null;
  testCases: TestCase[];
  selectedTestCase: TestCase | null;
  services: string[];
  methods: string[];
  ports: Port[];
  setActiveService: (service: string | null) => void;
  setActiveMethod: (method: string | null) => void;
  setRequestParams: (params: string) => void;
  setSelectedTestCase: (testCase: TestCase | null, fromDirectory?: boolean) => void;
  onSendRequest: () => void;
  onAddTestCase: () => void;
  onUpdateTestCase: () => void;
  onLoadTestCase?: (params: string) => void;
  isLoading: boolean;
  isLoadingServices?: boolean;
  isLoadingMethods?: boolean;
  loadServices?: () => void;
  loadMethods?: (serviceName: string) => void;
  formatServiceNameForDisplay?: (serviceName: string) => string;
  className?: string;
}

export default function ControlPanel({
  activePort,
  activeService,
  activeMethod,
  testCases,
  selectedTestCase,
  services,
  methods,
  ports,
  setActiveService,
  setActiveMethod,
  // setRequestParams, // Not used directly in this component
  setSelectedTestCase,
  onSendRequest,
  onAddTestCase,
  onUpdateTestCase,
  onLoadTestCase,
  isLoading,
  isLoadingServices = false,
  isLoadingMethods = false,
  loadServices,
  // loadMethods, // Not used directly in this component
  formatServiceNameForDisplay,
  className = ''
}: ControlPanelProps) {
  const [showTestCaseDetail, setShowTestCaseDetail] = useState(false);

  // 获取当前选中的端口信息
  const currentPort = ports.find(p => p.id === activePort);

  const handleTestCaseClick = (testCase: TestCase) => {
    console.log('🖱️ ControlPanel: handleTestCaseClick called with:', testCase);
    console.log('   Current selectedTestCase:', selectedTestCase);

    // 重要：从ControlPanel点击时，不传递第二个参数，让它使用默认值false
    // 这样不会触发isFromDirectoryClick状态变化
    setSelectedTestCase(testCase);
    setShowTestCaseDetail(true);

    // 加载测试用例参数
    if (onLoadTestCase) {
      console.log('   Loading test case params:', testCase.params);
      onLoadTestCase(testCase.params);
    }

    console.log('✅ ControlPanel: Test case selection completed');
  };

  const closeTestCaseDetail = () => {
    console.log('ControlPanel: closeTestCaseDetail called, clearing selectedTestCase');
    setShowTestCaseDetail(false);
    setSelectedTestCase(null, false); // 不是从服务目录点击
  };

  const formatJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (error) {
      return jsonString;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex-shrink-0 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        控制面板
      </h2>

      {/* 端口配置 - 减少高度 */}
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          端口配置
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">主机</label>
            <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
              {currentPort?.host || 'localhost'}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">端口号</label>
            <div className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
              {currentPort?.port || '20880'}
            </div>
          </div>
        </div>
      </div>

      {/* 服务方法选择 - 减少高度 */}
      <div className="mb-3 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          服务方法
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">服务</label>
            <select
              value={activeService || ''}
              onChange={(e) => setActiveService(e.target.value || null)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">请选择服务</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {formatServiceNameForDisplay ? formatServiceNameForDisplay(service) : service}
                </option>
              ))}
            </select>
            {loadServices && (
              <button
                onClick={loadServices}
                disabled={isLoadingServices}
                className="mt-1 w-full px-2 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
              >
                {isLoadingServices ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>加载中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>刷新服务</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">方法</label>
            <select
              value={activeMethod || ''}
              onChange={(e) => setActiveMethod(e.target.value || null)}
              disabled={!activeService || isLoadingMethods}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!activeService
                  ? '请先选择服务'
                  : isLoadingMethods
                    ? '加载中...'
                    : methods.length === 0
                      ? '该服务暂无方法'
                      : '请选择方法'
                }
              </option>
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 测试用例列表 - 固定高度，可滚动 */}
      <div className="mb-10 flex-shrink-0" style={{ height: '250px' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {activeMethod ? '方法测试用例' : '服务测试用例'}
          </h3>
          {testCases.length > 0 && (
            <span className="text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-0.5 rounded-full shadow-sm">
              {testCases.length} 个
            </span>
          )}
        </div>
        {testCases.length > 0 ? (
          <div className="h-full overflow-y-auto space-y-1 pr-1" style={{ maxHeight: 'calc(100vh - 450px)' }}>
            {testCases.map((testCase) => (
              <button
                key={testCase.id}
                onClick={() => handleTestCaseClick(testCase)}
                className={`w-full text-left p-2 text-xs rounded border transition-all duration-200 hover:shadow-sm ${selectedTestCase?.id === testCase.id
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 text-blue-800 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <div className="font-semibold truncate text-gray-800">{testCase.name}</div>
                {!activeMethod && testCase.method && (
                  <div className="text-blue-600 text-xs mt-0.5 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    方法: {testCase.method}
                  </div>
                )}
                <div className="text-gray-500 text-xs mt-0.5 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {testCase.createTime ? new Date(testCase.createTime).toLocaleString() : '未知时间'}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded border border-gray-200" style={{ minHeight: '120px' }}>
            <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            暂无测试用例
          </div>
        )}
      </div>

      {/* 操作按钮 - 减少高度 */}
      <div className="space-y-2 mb-3 flex-shrink-0">
        <button
          onClick={onSendRequest}
          disabled={!activeService || !activeMethod || isLoading}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>发送中...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>发送请求</span>
            </>
          )}
        </button>

        <button
          onClick={onAddTestCase}
          disabled={!activeService || !activeMethod}
          className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>新增测试用例</span>
        </button>

        <button
          onClick={onUpdateTestCase}
          disabled={!selectedTestCase}
          className={`w-full px-3 py-2 text-white rounded text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 ${selectedTestCase
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>
            {selectedTestCase ? '更新测试用例' : '请先选择测试用例'}
          </span>
        </button>
      </div>

      {/* 状态信息 - 减少高度 */}
      <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded border border-gray-200 flex-shrink-0">
        <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          状态信息
        </h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">服务:</span>
            <span className="font-medium text-gray-800">{services.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              {activeMethod ? '方法测试用例:' : '服务测试用例:'}
            </span>
            <span className="font-medium text-gray-800">{testCases.length}</span>
          </div>
        </div>
        <div className="mt-1 space-y-0.5 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">当前服务:</span>
            <span className="font-medium text-gray-800 truncate">
              {activeService
                ? (formatServiceNameForDisplay ? formatServiceNameForDisplay(activeService) : activeService)
                : '无'
              }
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">当前方法:</span>
            <span className="font-medium text-gray-800 truncate">{activeMethod || '无'}</span>
          </div>
        </div>
        {selectedTestCase && (
          <div className="mt-2 pt-1 border-t border-gray-200">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-600">选中测试用例:</span>
            </div>
            <div className="text-xs text-gray-700 truncate bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {selectedTestCase.name}
            </div>
          </div>
        )}
      </div>

      {/* 测试用例详情弹窗 */}
      {showTestCaseDetail && selectedTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">测试用例详情</h3>
              <button
                onClick={closeTestCaseDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">测试用例名称</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                  {selectedTestCase.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">创建时间</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                  {selectedTestCase.createTime ? new Date(selectedTestCase.createTime).toLocaleString() : '未知时间'}
                </div>
              </div>

              {selectedTestCase.method && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所属方法</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    {selectedTestCase.method}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">请求参数</label>
                <div className="relative">
                  <pre className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono overflow-auto max-h-48">
                    {formatJson(selectedTestCase.params)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTestCase.params);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border"
                    title="复制参数"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>参数长度: {selectedTestCase.params.length} 字符</span>
                <span>测试用例ID: {selectedTestCase.id}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={closeTestCaseDetail}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  if (onLoadTestCase) {
                    onLoadTestCase(selectedTestCase.params);
                  }
                  closeTestCaseDetail();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                使用此参数
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}