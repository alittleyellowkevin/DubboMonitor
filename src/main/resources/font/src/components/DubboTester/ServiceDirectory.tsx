import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TestCase, DirectoryNode } from '@/lib/types';

interface ServiceDirectoryProps {
  directoryData: DirectoryNode[];
  activeService: string | null;
  activeMethod: string | null;
  setActiveService: (serviceId: string | null) => void;
  setActiveMethod: (method: string | null) => void;
  setSelectedTestCase: (testCase: TestCase | null, fromDirectory?: boolean) => void;
  selectedTestCase: TestCase | null;
  onUpdateRequest?: (recordId: number, name: string) => void;
  onDeleteRequest?: (recordId: number) => void;
  onLoadHistoryParams?: (params: string) => void;
  onUpdateTestCase?: () => void;
  className?: string;
}

export default function ServiceDirectory({
  directoryData,
  activeService,
  activeMethod,
  setActiveService,
  setActiveMethod,
  setSelectedTestCase,
  selectedTestCase,
  onUpdateRequest,
  onDeleteRequest,
  onLoadHistoryParams,
  // onUpdateTestCase, // Currently not used
  className = ''
}: ServiceDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [editingRecord, setEditingRecord] = useState<{ id: number; name: string } | null>(null);

  // Keep track of expanded services and methods when directoryData changes
  useEffect(() => {
    if (directoryData.length > 0) {
      const newExpanded = new Set<string>();

      // Find and expand the active service
      const activeServiceNode = directoryData.find(service => service.label === activeService);
      if (activeServiceNode) {
        newExpanded.add(activeServiceNode.id);

        // Find and expand the active method
        const activeMethodNode = activeServiceNode.children.find(method => method.label === activeMethod);
        if (activeMethodNode) {
          newExpanded.add(activeMethodNode.id);
        }
      }

      setExpandedServices(newExpanded);
    }
  }, [directoryData, activeService, activeMethod]);

  const filteredServices = directoryData.filter(service =>
    service.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleServiceExpand = (serviceId: string, serviceName: string) => {
    setExpandedServices(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(serviceId)) {
        newExpanded.delete(serviceId);
      } else {
        newExpanded.add(serviceId);
        // When expanding a service, set it as active using the service name
        setActiveService(serviceName);
      }
      return newExpanded;
    });
  };

  const toggleMethodExpand = (methodId: string) => {
    setExpandedServices(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(methodId)) {
        newExpanded.delete(methodId);
      } else {
        newExpanded.add(methodId);
      }
      return newExpanded;
    });
  };

  const isExpanded = (id: string) => {
    return expandedServices.has(id);
  };

  const handleMethodClick = (e: React.MouseEvent, serviceName: string, methodName: string) => {
    e.stopPropagation();
    setActiveService(serviceName);
    setActiveMethod(methodName);
  };

  const handleHistoryClick = (e: React.MouseEvent, historyNode: DirectoryNode) => {
    e.stopPropagation();
    console.log('ServiceDirectory: handleHistoryClick called with:', historyNode);

    if (historyNode.data) {
      console.log('ServiceDirectory: Setting service and method:', historyNode.data.service, historyNode.data.method);

      setActiveService(historyNode.data?.service || null);
      setActiveMethod(historyNode.data?.method || null);

      // 创建测试用例对象并设置为选中状态
      const testCase: TestCase = {
        id: historyNode.data.id.toString(),
        name: historyNode.label,
        params: historyNode.data.jsonParams || '{}',
        createTime: historyNode.data.createTime ? new Date(historyNode.data.createTime) : new Date(),
        method: historyNode.data.method
      };
      console.log('ServiceDirectory: Created test case:', testCase);

      // 标记这是从服务目录点击触发的
      setSelectedTestCase(testCase, true);

      // 加载历史记录参数
      if (onLoadHistoryParams && historyNode.data.jsonParams) {
        onLoadHistoryParams(historyNode.data.jsonParams);
      }

      // 不再自动触发更新操作，用户需要手动点击更新按钮
      console.log('ServiceDirectory: History record selected, no automatic update triggered');
    }
  };

  const handleRename = (recordId: number, currentName: string) => {
    setEditingRecord({ id: recordId, name: currentName });
  };

  const handleSaveRename = () => {
    if (editingRecord && onUpdateRequest) {
      onUpdateRequest(editingRecord.id, editingRecord.name);
      setEditingRecord(null);
      // No need for alert here, the parent component will show notification
    }
  };

  const handleCancelRename = () => {
    setEditingRecord(null);
  };

  const handleDelete = (recordId: number) => {
    if (onDeleteRequest) {
      onDeleteRequest(recordId);
    }
  };

  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex-shrink-0 flex items-center">
        <i className="fa-solid fa-server text-blue-500 mr-2"></i>
        服务目录
      </h2>

      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <i className="fa-solid fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
        </div>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
        {directoryData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fa-solid fa-server text-xl mb-2 opacity-40"></i>
            <p className="text-sm">未加载到服务数据</p>
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="border-l-4 border-transparent"
            >
              <div
                onClick={() => toggleServiceExpand(service.id, service.label)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setActiveService(service.label);
                }}
                className={`p-2 rounded-lg cursor-pointer transition-all group ${activeService === service.label
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-100 border-transparent'
                  }`}
                title="点击展开/收起，双击选择此服务"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-800 truncate text-sm">{service.label}</div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveService(service.label);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800 text-xs"
                      title="选择此服务"
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <i className={`fa-solid ${isExpanded(service.id) ? 'fa-chevron-down' : 'fa-chevron-right'} text-xs text-gray-400 transition-transform`}></i>
                  </div>
                </div>
              </div>

              {isExpanded(service.id) && (
                <div className="ml-3 mt-1 mb-2 pl-2 border-l-2 border-gray-200 space-y-1">
                  {service.children.length > 0 ? (
                    service.children.map((method) => (
                      <div key={method.id}>
                        <div
                          onClick={() => toggleMethodExpand(method.id)}
                          onDoubleClick={(e) => handleMethodClick(e, service.label, method.label)}
                          className={`px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors group ${activeService === service.label && activeMethod === method.label
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          title="双击选择此方法"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{method.label}</span>
                            <div className="flex items-center space-x-1">
                              {method.children.length > 0 && (
                                <span className="inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-blue-500 rounded-full">
                                  {method.children.length}
                                </span>
                              )}
                              <i className={`fa-solid ${isExpanded(method.id) ? 'fa-chevron-down' : 'fa-chevron-right'} text-xs text-gray-400`}></i>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMethodClick(e, service.label, method.label);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800 text-xs ml-1"
                                title="选择此方法"
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        {isExpanded(method.id) && method.children.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1 pl-2 border-l-2 border-gray-200 bg-gray-50 rounded-lg p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {method.children.map((history) => {
                              // 判断当前历史记录是否为选中的测试用例
                              const isSelected = selectedTestCase && history.data && selectedTestCase.id === history.data.id.toString();

                              return (
                                <div
                                  key={history.id}
                                  onClick={(e) => handleHistoryClick(e, history)}
                                  className={`px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${isSelected
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 text-blue-800 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                  <div className="flex items-center justify-between group">
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate">{history.label}</div>
                                      {history.data && (
                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {new Date(history.data.createTime).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex space-x-1">
                                      {history.data && (
                                        <>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRename(Number(history.data!.id), history.label);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-xs p-1 rounded hover:bg-blue-50"
                                            title="重命名"
                                          >
                                            <i className="fa-solid fa-edit"></i>
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDelete(Number(history.data!.id));
                                            }}
                                            className="text-red-600 hover:text-red-800 text-xs p-1 rounded hover:bg-red-50"
                                            title="删除"
                                          >
                                            <i className="fa-solid fa-trash"></i>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-xs text-gray-500 italic">
                      该服务没有可用方法
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fa-solid fa-search text-xl mb-2 opacity-40"></i>
            <p className="text-sm">未找到匹配的服务</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </div>

      {/* 重命名对话框 */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">重命名记录</h3>
            <input
              type="text"
              value={editingRecord.name}
              onChange={(e) => setEditingRecord({ ...editingRecord, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveRename();
                } else if (e.key === 'Escape') {
                  handleCancelRename();
                }
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancelRename}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleSaveRename}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}