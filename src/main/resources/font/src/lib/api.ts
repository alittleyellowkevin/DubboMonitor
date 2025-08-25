// API 调用函数，基于 index.html 中的接口
// @ts-ignore
import axios from 'axios';

// 配置 axios 默认地址
axios.defaults.baseURL = 'http://localhost:8080';

// 接口类型定义
export interface Service {
  id: string;
  name: string;
  version?: string;
  group?: string;
  methods: Method[];
}

export interface Method {
  id: string;
  name: string;
  service: string;
  testCases: TestCase[];
  showAddInput?: boolean;
  newItemName?: string;
}

export interface TestCase {
  id: string;
  name: string;
  params: any;
  port?: number;
  service?: string;
  method?: string;
  jsonParams?: string;
  createTime?: Date;
  modifyTime?: Date;
  isValid?: number;
}

export interface DirectoryNode {
  id: string;
  label: string;
  type: 'service' | 'method' | 'history';
  service?: string;
  children: DirectoryNode[];
  showAddInput?: boolean;
  newItemName?: string;
  data?: {
    id: number;
    port: number;
    service: string;
    method: string;
    name: string;
    jsonParams: string;
    createTime: Date;
    modifyTime: Date;
    isValid: number;
  };
}

// 1. 获取服务列表
export const getServices = async (port: number): Promise<string[]> => {
  try {
    const response = await axios.post('/api/dubbo/services', { port });
    return response.data.services || [];
  } catch (error) {
    console.error('获取服务列表失败:', error);
    throw error;
  }
};

// 2. 获取服务的方法列表
export const getMethods = async (port: number, service: string): Promise<string[]> => {
  try {
    const response = await axios.post('/api/dubbo/methods', { port, service });
    return response.data.methods || [];
  } catch (error) {
    console.error('获取方法列表失败:', error);
    throw error;
  }
};

// 3. 调用 Dubbo 方法
export const invokeMethod = async (
  port: number,
  serviceName: string,
  methodName: string,
  jsonParams: string
): Promise<{ result: string; time: number }> => {
  try {
    const response = await axios.post('/api/dubbo/invoke', {
      port,
      serviceName,
      methodName,
      jsonParams
    });
    return response.data;
  } catch (error) {
    console.error('调用方法失败:', error);
    throw error;
  }
};

// 4. 获取执行历史记录列表
export const getExecuteHistory = async (port: number): Promise<any[]> => {
  try {
    const response = await axios.post('/api/execute/list', { port });
    return response.data || [];
  } catch (error) {
    console.error('获取历史记录失败:', error);
    throw error;
  }
};

// 5. 新增执行记录
export const insertExecuteRecord = async (data: {
  port: number;
  service: string;
  method: string;
  name: string;
  jsonParams: string;
}): Promise<number> => {
  try {
    const response = await axios.post('/api/execute/insert', data);
    return response.data; // 返回新增记录的ID
  } catch (error) {
    console.error('新增记录失败:', error);
    throw error;
  }
};

// 6. 更新执行记录
export const updateExecuteRecord = async (data: {
  id: number;
  port?: number;
  service?: string;
  method?: string;
  name: string;
  jsonParams?: string;
  createTime?: Date;
  modifyTime?: Date;
  isValid?: number;
}): Promise<void> => {
  try {
    await axios.post('/api/execute/update', data);
  } catch (error) {
    console.error('更新记录失败:', error);
    throw error;
  }
};

// 7. 删除执行记录
export const deleteExecuteRecord = async (id: number): Promise<void> => {
  try {
    await axios.post('/api/execute/delete', { id });
  } catch (error) {
    console.error('删除记录失败:', error);
    throw error;
  }
};

// 8. 构建目录数据结构
export const buildDirectoryData = async (port: number): Promise<DirectoryNode[]> => {
  try {
    // 1. 获取所有服务
    const services = await getServices(port);
    const newDirectoryData: DirectoryNode[] = [];

    // 2. 获取当前端口下的所有历史记录
    const historyResponse = await getExecuteHistory(port);
    const historyMap = new Map();

    // 将历史记录按照service和method分组
    if (historyResponse && Array.isArray(historyResponse)) {
      historyResponse.forEach((history: any) => {
        if (history.isValid === 0) {
          const key = `${history.service}#${history.method}`;
          if (!historyMap.has(key)) {
            historyMap.set(key, []);
          }
          historyMap.get(key).push(history);
        }
      });
    }

    // 3. 构建服务树
    for (const service of services) {
      const serviceNode: DirectoryNode = {
        id: generateId(),
        label: service,
        type: 'service',
        children: []
      };

      // 获取服务的方法
      const methods = await getMethods(port, service);

      // 添加方法节点
      for (const method of methods) {
        const methodNode: DirectoryNode = {
          id: generateId(),
          label: method,
          type: 'method',
          service: service,
          children: [],
          showAddInput: false,
          newItemName: ''
        };

        // 添加该方法的历史记录
        const histories = historyMap.get(`${service}#${method}`) || [];
        histories.forEach((history: any) => {
          const historyNode: DirectoryNode = {
            id: generateId(),
            label: history.name,
            type: 'history',
            children: [], // 添加空的children数组
            data: {
              id: history.id,
              port: history.port,
              service: history.service,
              method: history.method,
              name: history.name,
              jsonParams: history.jsonParams,
              createTime: history.createTime,
              modifyTime: history.modifyTime,
              isValid: history.isValid
            }
          };
          methodNode.children.push(historyNode);
        });

        serviceNode.children.push(methodNode);
      }

      newDirectoryData.push(serviceNode);
    }

    return newDirectoryData;
  } catch (error) {
    console.error('构建目录数据失败:', error);
    throw error;
  }
};

// 生成唯一ID
const generateId = (): string => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 保留原有的静态 mock 数据作为备用
export const mockServices = [
  {
    id: 'service-1',
    name: 'com.example.user.UserService',
    version: '1.0.0',
    group: 'user-center',
    methods: [
      { name: 'getUserById', testCases: [{ id: 'tc1', name: '获取用户信息', params: { userId: 123 } }] },
      { name: 'createUser', testCases: [{ id: 'tc2', name: '创建新用户', params: { username: 'newuser', email: 'new@example.com' } }] },
      { name: 'updateUser', testCases: [] },
      { name: 'deleteUser', testCases: [] },
      { name: 'listUsers', testCases: [{ id: 'tc3', name: '获取用户列表', params: { page: 1, size: 10 } }] }
    ]
  },
  {
    id: 'service-2',
    name: 'com.example.order.OrderService',
    version: '2.1.0',
    group: 'order-center',
    methods: [
      { name: 'createOrder', testCases: [{ id: 'tc4', name: '创建订单', params: { productId: 101, quantity: 2 } }] },
      { name: 'getOrderById', testCases: [{ id: 'tc5', name: '获取订单详情', params: { orderId: 'ORDER123' } }] },
      { name: 'cancelOrder', testCases: [] },
      { name: 'payOrder', testCases: [] },
      { name: 'refundOrder', testCases: [] }
    ]
  },
  {
    id: 'service-3',
    name: 'com.example.product.ProductService',
    version: '1.5.0',
    methods: [
      { name: 'getProduct', testCases: [{ id: 'tc6', name: '获取产品信息', params: { productId: 101 } }] },
      { name: 'listProducts', testCases: [] },
      { name: 'updateStock', testCases: [] },
      { name: 'searchProducts', testCases: [{ id: 'tc7', name: '搜索产品', params: { keyword: '手机', page: 1 } }] }
    ]
  },
  {
    id: 'service-4',
    name: 'com.example.payment.PaymentService',
    version: '3.0.0',
    group: 'payment-center',
    methods: [
      { name: 'createPayment', testCases: [] },
      { name: 'queryPayment', testCases: [] },
      { name: 'refundPayment', testCases: [] },
      { name: 'verifyPayment', testCases: [] }
    ]
  },
];