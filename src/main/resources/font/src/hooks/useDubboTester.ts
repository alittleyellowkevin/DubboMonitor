import { useState, useEffect } from 'react';
import {
  getServices,
  getMethods,
  invokeMethod,
  // getExecuteHistory, // Not used in this hook
  insertExecuteRecord,
  updateExecuteRecord,
  deleteExecuteRecord,
  buildDirectoryData
} from '@/lib/api';
import type { Port, TestCase, DirectoryNode, ResponseData } from '@/lib/types';

// 端口配置 - 支持动态添加和修改
const getDefaultPorts = (): Port[] => {
  // 从环境变量获取端口配置，如果没有则使用默认值
  const devPort = parseInt(import.meta.env.VITE_DEV_PORT || '31802');
  const testPort = parseInt(import.meta.env.VITE_TEST_PORT || '31362');
  const localPort = parseInt(import.meta.env.VITE_LOCAL_PORT || '31363');

  return [
    { id: 'port-1', name: 'DataAsset', host: 'localhost', port: devPort },
    { id: 'port-2', name: '测试环境', host: 'localhost', port: testPort },
    { id: 'port-3', name: '本地环境', host: 'localhost', port: localPort },
    // 可以添加更多端口配置
    { id: 'port-4', name: '生产环境', host: 'localhost', port: 31364 },
    { id: 'port-5', name: '自定义端口', host: 'localhost', port: 20880 },
  ];
};

export function useDubboTester() {
  // State for ports
  const [ports, setPorts] = useState(getDefaultPorts());
  const [activePort, setActivePort] = useState(ports[0]?.id || '');

  // State for services and methods
  const [services, setServices] = useState<string[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [methods, setMethods] = useState<string[]>([]);
  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  // State for test cases
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isFromDirectoryClick, setIsFromDirectoryClick] = useState(false);

  // State for directory data
  const [directoryData, setDirectoryData] = useState<DirectoryNode[]>([]);

  // State for request and response
  const [requestParams, setRequestParams] = useState<string>(
    JSON.stringify({}, null, 2)
  );
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);

  // State for notifications
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  } | null>(null);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Auto hide after 3 seconds
  };

  // Get current port configuration
  const getCurrentPort = () => {
    return ports.find(p => p.id === activePort);
  };

  // Format service name for display
  const formatServiceNameForDisplay = (serviceName: string) => {
    if (!serviceName) return '';

    // 如果是 Dubbo 内部服务名（以 id_ 开头），尝试提取更有意义的部分
    if (serviceName.startsWith('id_')) {
      const parts = serviceName.split('_');
      if (parts.length >= 3) {
        return parts[2]; // 返回第三部分作为显示名称
      }
    }

    // 如果是完整的类名，提取类名部分
    if (serviceName.includes('.')) {
      const parts = serviceName.split('.');
      return parts[parts.length - 1]; // 返回最后一部分作为显示名称
    }

    return serviceName;
  };

  // Add port
  const addPort = (name: string, host: string, port: number) => {
    const newPort = {
      id: `port-${Date.now()}`,
      name,
      host,
      port
    };
    setPorts(prev => [...prev, newPort]);
    setActivePort(newPort.id);
    return newPort.id;
  };

  // Update port
  const updatePort = (id: string, updates: Partial<{ name: string; host: string; port: number }>) => {
    setPorts(prev => prev.map(port =>
      port.id === id ? { ...port, ...updates } : port
    ));
  };

  // Remove port
  const removePort = (id: string) => {
    setPorts(prev => prev.filter(port => port.id !== id));
    if (activePort === id) {
      const remainingPorts = ports.filter(port => port.id !== id);
      setActivePort(remainingPorts[0]?.id || '');
    }
  };

  // Load services
  const loadServices = async () => {
    const currentPort = getCurrentPort();
    if (!currentPort) return;

    setIsLoadingServices(true);
    try {
      const servicesData = await getServices(currentPort.port);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Load methods
  const loadMethods = async (serviceName: string) => {
    if (!serviceName || serviceName.trim() === '') {
      setMethods([]);
      return;
    }

    const currentPort = getCurrentPort();
    if (!currentPort) return;

    setIsLoadingMethods(true);
    try {
      const methodsData = await getMethods(currentPort.port, serviceName);
      setMethods(methodsData);
    } catch (error) {
      console.error('Failed to load methods:', error);
      setMethods([]);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  // Load test cases
  const loadTestCases = async () => {
    const currentPort = getCurrentPort();
    if (!currentPort) {
      setTestCases([]);
      return;
    }

    try {
      console.log('Loading test cases for port:', currentPort.port);

      // 发送POST请求到后端API
      const response = await fetch('/api/execute/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          port: currentPort.port
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received test cases data:', data);

        // 格式化数据并过滤出当前服务和方法的相关测试用例
        const formattedTestCases = data
          .filter((item: any) => {
            // 如果指定了服务，过滤匹配的服务
            if (activeService) {
              const match = item.service === activeService;
              console.log('Filtering service:', item.service, '===', activeService, '=', match);
              return match;
            }
            return true; // 如果没有指定服务，显示所有
          })
          .filter((item: any) => {
            // 如果指定了方法，进一步过滤
            if (activeMethod) {
              const match = item.method === activeMethod;
              console.log('Filtering method:', item.method, '===', activeMethod, '=', match);
              return match;
            }
            return true; // 如果没有指定方法，显示该服务的所有方法
          })
          .map((item: any) => ({
            id: item.id.toString(),
            name: item.name || `${item.service}${item.method ? ' - ' + item.method : ''}`,
            params: item.jsonParams || '{}',
            createTime: new Date(item.createTime),
            method: item.method
          }));

        console.log('Formatted test cases:', formattedTestCases);
        setTestCases(formattedTestCases);

        // 3. 验证当前选中的测试用例是否仍然有效
        if (selectedTestCase) {
          const isStillValid = formattedTestCases.some((tc: TestCase) => tc.id === selectedTestCase.id);
          if (!isStillValid) {
            setSelectedTestCase(null);
          }
        }
      } else {
        console.error('Failed to load test cases, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setTestCases([]);
      }
    } catch (error) {
      console.error('Error loading test cases:', error);
      setTestCases([]);
    }
  };

  // Load directory data
  const loadDirectoryData = async () => {
    const currentPort = getCurrentPort();
    if (!currentPort) return;

    try {
      const data = await buildDirectoryData(currentPort.port);
      setDirectoryData(data);
    } catch (error) {
      console.error('Failed to load directory data:', error);
      setDirectoryData([]);
    }
  };

  // Load history parameters
  const loadHistoryParams = (params: string) => {
    try {
      // 尝试格式化 JSON
      const formattedParams = JSON.stringify(JSON.parse(params), null, 2);
      setRequestParams(formattedParams);
    } catch (error) {
      // 如果不是有效的 JSON，直接使用原始参数
      setRequestParams(params);
    }
  };

  // Handle sending request
  const handleSendRequest = async () => {
    if (!activeService || !activeMethod) return;

    const currentPort = getCurrentPort();
    if (!currentPort) return;

    setIsLoading(true);
    setResponseData(null);

    try {
      const response = await invokeMethod(
        currentPort.port,
        activeService,
        activeMethod,
        requestParams
      );

      setResponseData({
        success: true,
        data: response.result,
        time: response.time,
        timestamp: Date.now()
      });
    } catch (error: any) {
      setResponseData({
        success: false,
        error: error.message || 'Request failed',
        time: 0,
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new test case
  const handleAddTestCase = async () => {
    if (!activeService || !activeMethod) return;

    const currentPort = getCurrentPort();
    if (!currentPort) return;

    try {
      const recordId = await insertExecuteRecord({
        port: currentPort.port,
        service: activeService,
        method: activeMethod,
        name: `${activeService} - ${activeMethod} - ${new Date().toLocaleString()}`,
        jsonParams: requestParams
      });

      // Reload directory data and test cases to show new record
      await loadDirectoryData();
      await loadTestCases();

      console.log('Test case added with ID:', recordId);
      showNotification('测试用例已添加', 'success');
    } catch (error) {
      console.error('Failed to add test case:', error);
      showNotification('添加失败: ' + (error as Error).message, 'error');
    }
  };

  // Handle updating test case
  const handleUpdateTestCase = async () => {
    console.log('handleUpdateTestCase called, selectedTestCase:', selectedTestCase);
    console.log('Current activeService:', activeService, 'activeMethod:', activeMethod);
    console.log('isFromDirectoryClick:', isFromDirectoryClick);

    if (!selectedTestCase) {
      showNotification('请先选择一个测试用例', 'error');
      return;
    }

    const currentPort = getCurrentPort();
    if (!currentPort) return;

    // 如果是从服务目录点击触发的，使用测试用例中的服务和方法信息
    let serviceToUse = activeService;
    let methodToUse = activeMethod;

    if (isFromDirectoryClick && selectedTestCase.method) {
      // 从测试用例中提取服务名称（假设格式为 "服务名 - 方法名"）
      const nameParts = selectedTestCase.name.split(' - ');
      if (nameParts.length >= 2) {
        serviceToUse = nameParts[0];
        methodToUse = selectedTestCase.method;
      }
    }

    if (!serviceToUse || !methodToUse) {
      showNotification('缺少服务或方法信息', 'error');
      return;
    }

    console.log('Updating test case with ID:', selectedTestCase.id);
    console.log('Using service:', serviceToUse, 'method:', methodToUse);
    console.log('Current request params:', requestParams);

    try {
      await updateExecuteRecord({
        id: parseInt(selectedTestCase.id),
        name: selectedTestCase.name,
        port: currentPort.port,
        service: serviceToUse,
        method: methodToUse,
        jsonParams: requestParams
      });

      // Reload directory data and test cases to show updated record
      await loadDirectoryData();
      await loadTestCases();
      showNotification('测试用例已更新', 'success');
    } catch (error) {
      console.error('Failed to update test case:', error);
      showNotification('更新失败: ' + (error as Error).message, 'error');
    }
  };

  // Handle renaming test case
  const handleRenameTestCase = async (recordId: number, newName: string) => {
    console.log('handleRenameTestCase called with:', recordId, newName);

    try {
      // 构建请求参数，只传递id和name字段
      const requestData = {
        id: recordId,
        name: newName
        // 不传递 port、service、method、jsonParams 字段，这样SQL的if条件不会执行
      };

      console.log('Sending update request with data:', requestData);

      // 使用现有的update接口，只传递id和name
      await updateExecuteRecord(requestData);

      console.log('Update request completed successfully');

      // Reload directory data and test cases to show updated record
      await loadDirectoryData();
      await loadTestCases();
      showNotification('测试用例已重命名', 'success');
    } catch (error) {
      console.error('Failed to rename test case:', error);
      showNotification('重命名失败: ' + (error as Error).message, 'error');
    }
  };

  // Handle deleting request
  const handleDeleteRequest = async (recordId: number) => {
    try {
      await deleteExecuteRecord(recordId);
      // Reload directory data and test cases to reflect deletion
      await loadDirectoryData();
      await loadTestCases();
      showNotification('删除成功', 'success');
    } catch (error) {
      console.error('Failed to delete request:', error);
      showNotification('删除失败: ' + (error as Error).message, 'error');
    }
  };

  // Set selected test case
  const setSelectedTestCaseHandler = (testCase: TestCase | null, fromDirectory: boolean = false) => {
    console.log('🎯 setSelectedTestCase called with:', testCase, 'fromDirectory:', fromDirectory);

    setSelectedTestCase(testCase);
    setIsFromDirectoryClick(fromDirectory);

    console.log('✅ selectedTestCase state updated');
  };

  // Auto refresh test cases every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeService) {
        loadTestCases();
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [activeService, activeMethod]);

  // Load services when port changes
  useEffect(() => {
    if (activePort) {
      loadServices();
      loadDirectoryData();
    }
  }, [activePort]);

  // Load methods when service changes
  useEffect(() => {
    console.log('🔄 useEffect [activeService] triggered:');
    console.log('   activeService:', activeService);

    if (activeService && activeService.trim() !== '') {
      loadMethods(activeService);
    } else {
      setMethods([]);
    }
    setActiveMethod(null);

    // 移除清除选中状态的逻辑
    console.log('   Not clearing selectedTestCase on service change');
  }, [activeService]);

  // Load test cases when service or method changes
  useEffect(() => {
    console.log('🔄 useEffect [activeService, activeMethod] triggered:');
    console.log('   activeService =', activeService);
    console.log('   activeMethod =', activeMethod);

    if (activeService) {
      console.log('📡 Loading test cases for service:', activeService, 'method:', activeMethod);
      loadTestCases();
    } else {
      console.log('❌ No active service, clearing test cases');
      setTestCases([]);
    }
    // 移除清除选中状态的逻辑，让用户手动管理
    console.log('   Not clearing selectedTestCase on service/method change');
  }, [activeService, activeMethod]);

  return {
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
    setSelectedTestCase: setSelectedTestCaseHandler,
    requestParams,
    setRequestParams,
    responseData,
    setResponseData,
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
    loadTestCases,
    loadDirectoryData,
    formatServiceNameForDisplay,
    notification,
    showNotification
  };
}