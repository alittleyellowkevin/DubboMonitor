// 全局类型定义

// 端口配置
export interface Port {
    id: string;
    name: string;
    host: string;
    port: number;
}

// 测试用例
export interface TestCase {
    id: string;
    name: string;
    params: string;
    port?: number;
    service?: string;
    method?: string;
    jsonParams?: string;
    createTime?: Date;
    modifyTime?: Date;
    isValid?: number;
}

// 服务信息
export interface Service {
    id: string;
    name: string;
    version?: string;
    group?: string;
    methods: Method[];
}

// 方法信息
export interface Method {
    id: string;
    name: string;
    service: string;
    testCases: TestCase[];
}

// 目录节点
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
        jsonParams: string;
        createTime: Date;
    };
}

// 端口页签
export interface PortTab {
    id: string;
    name: string;
    host: string;
    port: number;
    active?: boolean;
}

// 请求参数
export interface ExecuteRequest {
    id?: number;
    name: string;
    port: number;
    service: string;
    method: string;
    jsonParams: string;
    createTime?: Date;
    modifyTime?: Date;
    isValid?: number;
}

// API响应格式
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// 端口页签组件Props
export interface PortTabsProps {
    ports: Port[];
    activePort: string;
    setActivePort: (portId: string) => void;
    className?: string;
}

// 服务目录组件Props
export interface ServiceDirectoryProps {
    directoryData: DirectoryNode[];
    selectedTestCase: TestCase | null;
    onHistoryClick: (testCase: TestCase) => void;
    onUpdateTestCase: (testCase: TestCase) => void;
    onUpdateRequest: (testCase: TestCase) => void;
    className?: string;
}

// 控制面板组件Props
export interface ControlPanelProps {
    activeService: string | null;
    activeMethod: string | null;
    services: string[];
    methods: string[];
    testCases: TestCase[];
    selectedTestCase: TestCase | null;
    isLoading: boolean;
    onServiceChange: (service: string | null) => void;
    onMethodChange: (method: string | null) => void;
    onTestCaseClick: (testCase: TestCase) => void;
    onSendRequest: () => void;
    onUpdateTestCase: () => void;
    onRenameTestCase: (testCase: TestCase) => void;
    className?: string;
}

// 请求面板组件Props
export interface RequestPanelProps {
    requestParams: string;
    setRequestParams: (params: string) => void;
    className?: string;
}

// 响应数据格式
export interface ResponseData {
    success: boolean;
    data?: any;
    error?: string;
    time?: number;
    timestamp?: number;
}

// 响应面板组件Props
export interface ResponsePanelProps {
    responseData: ResponseData | null;
    className?: string;
}
