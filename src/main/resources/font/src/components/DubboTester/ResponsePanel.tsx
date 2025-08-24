import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';

interface ResponsePanelProps {
  responseData: {
    success: boolean;
    data?: any;
    error?: string;
    time?: number;
    timestamp?: number;
  } | null;
  className?: string;
}

export default function ResponsePanel({ responseData, className = '' }: ResponsePanelProps) {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [editorError, setEditorError] = useState(false);
  const editorRef = useRef<any>(null);

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  // Copy response data to clipboard
  const copyToClipboard = () => {
    if (!responseData) return;

    const textToCopy = getResponseDataForCopy();

    navigator.clipboard.writeText(textToCopy).then(() => {
      // 显示复制成功提示
      const button = document.querySelector('[data-copy-button]') as HTMLElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        button.className = 'p-1 bg-green-100 rounded text-green-600 transition-colors text-xs border shadow-sm';
        setTimeout(() => {
          button.innerHTML = originalText;
          button.className = 'p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border shadow-sm';
        }, 1000);
      }
    }).catch(err => {
      console.error('无法复制文本: ', err);
    });
  };

  // Get response data size
  const getDataSize = () => {
    if (!responseData?.data) return '0 B';

    let dataToMeasure = responseData.data;

    // 如果数据是字符串，直接计算字符串长度
    if (typeof responseData.data === 'string') {
      dataToMeasure = responseData.data;
    } else {
      dataToMeasure = JSON.stringify(responseData.data);
    }

    const size = typeof dataToMeasure === 'string' ? dataToMeasure.length : JSON.stringify(dataToMeasure).length;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get formatted response data for display
  const getFormattedResponseData = () => {
    if (!responseData?.data) return null;

    let jsonData = responseData.data;

    // 如果数据是字符串，尝试解析为 JSON
    if (typeof responseData.data === 'string') {
      try {
        jsonData = JSON.parse(responseData.data);
      } catch (parseError) {
        // 如果解析失败，返回原始字符串
        return responseData.data;
      }
    }

    return jsonData;
  };

  // Get response data for copy
  const getResponseDataForCopy = () => {
    if (!responseData?.data) return '';

    let jsonData = responseData.data;

    // 如果数据是字符串，尝试解析为 JSON
    if (typeof responseData.data === 'string') {
      try {
        jsonData = JSON.parse(responseData.data);
      } catch (parseError) {
        // 如果解析失败，返回原始字符串
        return responseData.data;
      }
    }

    return viewMode === 'formatted'
      ? JSON.stringify(jsonData, null, 2)
      : JSON.stringify(jsonData);
  };

  // Get response data for editor
  const getResponseDataForEditor = () => {
    if (!responseData?.data) return '';

    let jsonData = responseData.data;

    // 如果数据是字符串，尝试解析为 JSON
    if (typeof responseData.data === 'string') {
      try {
        jsonData = JSON.parse(responseData.data);
      } catch (parseError) {
        // 如果解析失败，返回原始字符串
        return responseData.data;
      }
    }

    return viewMode === 'formatted'
      ? JSON.stringify(jsonData, null, 2)
      : JSON.stringify(jsonData);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // 设置编辑器配置
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 13,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      automaticLayout: true,
      readOnly: true,
    });
  };

  const handleEditorWillMount = (monaco: any) => {
    // 配置 Monaco Editor
    monaco.editor.defineTheme('vs-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {}
    });
  };

  // 备用方案：使用普通 pre 元素
  const renderFallbackDisplay = () => (
    <pre className="w-full h-full min-h-[300px] p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono overflow-auto whitespace-pre-wrap">
      {getResponseDataForEditor()}
    </pre>
  );

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">响应结果</h2>

        {responseData ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs">
              <span className="text-gray-500 mr-1">耗时:</span>
              <span className="font-medium text-gray-800">{responseData.time}ms</span>
            </div>

            <div className="flex items-center text-xs">
              <span className="text-gray-500 mr-1">大小:</span>
              <span className="font-medium text-gray-800">{getDataSize()}</span>
            </div>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('formatted')}
                className={`px-2 py-1 text-xs font-medium ${viewMode === 'formatted'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:bg-gray-50 border-b-2 border-transparent'
                  }`}
              >
                格式化
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2 py-1 text-xs font-medium ${viewMode === 'raw'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:bg-gray-50 border-b-2 border-transparent'
                  }`}
              >
                原始
              </button>
            </div>

            <button
              onClick={copyToClipboard}
              data-copy-button
              className="p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border shadow-sm"
              title="复制响应"
            >
              <i className="fa-solid fa-copy"></i>
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            等待请求发送...
          </div>
        )}
      </div>

      {responseData ? (
        responseData.success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <div className="flex items-center text-green-700">
              <i className="fa-solid fa-check-circle mr-2"></i>
              <span className="font-medium text-sm">请求成功</span>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <div className="flex items-center text-red-700">
              <i className="fa-solid fa-exclamation-circle mr-2"></i>
              <span className="font-medium text-sm">请求失败</span>
            </div>
            {responseData.error && (
              <div className="mt-2 text-xs text-red-600">
                <div className="font-medium mb-1">错误详情:</div>
                <pre className="whitespace-pre-wrap bg-red-50 p-2 rounded border border-red-200 overflow-auto max-h-32">
                  {typeof responseData.error === 'string' && responseData.error.includes('{')
                    ? JSON.stringify(JSON.parse(responseData.error), null, 2)
                    : responseData.error
                  }
                </pre>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          <div className="flex items-center text-gray-500">
            <i className="fa-solid fa-info-circle mr-2"></i>
            <span className="text-sm">请选择服务和方法，然后点击"发送请求"按钮</span>
          </div>
        </div>
      )}

      {responseData && responseData.data !== undefined ? (
        <div className="mb-3">
          <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
            {editorError ? (
              renderFallbackDisplay()
            ) : (
              <Editor
                height="100%"
                defaultLanguage="json"
                value={getResponseDataForEditor()}
                onMount={handleEditorDidMount}
                beforeMount={handleEditorWillMount}
                loading={
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <div className="text-sm text-gray-500">加载编辑器中...</div>
                    </div>
                  </div>
                }
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                  automaticLayout: true,
                  readOnly: true,
                  wordWrap: 'on',
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  glyphMargin: false,
                  fixedOverflowWidgets: true,
                  theme: 'vs-light',
                }}
              />
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>字符数: {getResponseDataForCopy().length}</span>
              <span>行数: {getResponseDataForCopy().split('\n').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>语法高亮:</span>
              <span className={`px-2 py-0.5 rounded ${editorError ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {editorError ? '备用模式' : '开启'}
              </span>
            </div>
          </div>
        </div>
      ) : responseData ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fa-solid fa-file-text-o text-xl mb-2 opacity-40"></i>
          <p className="text-sm">无响应数据</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <i className="fa-solid fa-clock-rotate-left text-3xl mb-3 animate-pulse"></i>
          <p className="text-sm">等待请求...</p>
        </div>
      )}
    </div>
  );
}