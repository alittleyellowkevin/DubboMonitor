import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import type { RequestPanelProps } from '@/lib/types';

const RequestPanel = ({ className, requestParams, setRequestParams }: RequestPanelProps) => {
  const [isValidJson, setIsValidJson] = useState(true);
  const [formatError, setFormatError] = useState<string | null>(null);
  // const [editorLoaded, setEditorLoaded] = useState(false); // Currently not used
  const [editorError, _setEditorError] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // setEditorLoaded(true); // Currently not used

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

  const handleEditorChange = (value: string | undefined) => {
    const jsonValue = value || '';
    setRequestParams(jsonValue);

    // 验证JSON格式
    try {
      if (jsonValue.trim()) {
        JSON.parse(jsonValue);
        setIsValidJson(true);
        setFormatError(null);
      } else {
        setIsValidJson(true);
        setFormatError(null);
      }
    } catch (error) {
      setIsValidJson(false);
      setFormatError((error as Error).message);
    }
  };

  const formatJson = () => {
    try {
      if (requestParams.trim()) {
        const parsed = JSON.parse(requestParams);
        const formatted = JSON.stringify(parsed, null, 2);
        setRequestParams(formatted);
        setIsValidJson(true);
        setFormatError(null);
      }
    } catch (error) {
      setFormatError((error as Error).message);
      setIsValidJson(false);
    }
  };

  const minifyJson = () => {
    try {
      if (requestParams.trim()) {
        const parsed = JSON.parse(requestParams);
        const minified = JSON.stringify(parsed);
        setRequestParams(minified);
        setIsValidJson(true);
        setFormatError(null);
      }
    } catch (error) {
      setFormatError((error as Error).message);
      setIsValidJson(false);
    }
  };

  const clearParams = () => {
    const emptyJson = JSON.stringify({}, null, 2);
    setRequestParams(emptyJson);
    setIsValidJson(true);
    setFormatError(null);
  };

  const validateJson = () => {
    try {
      if (requestParams.trim()) {
        JSON.parse(requestParams);
        setIsValidJson(true);
        setFormatError(null);
        return true;
      }
      return true;
    } catch (error) {
      setIsValidJson(false);
      setFormatError((error as Error).message);
      return false;
    }
  };

  // 备用方案：使用普通 textarea
  const renderFallbackTextarea = () => (
    <textarea
      value={requestParams}
      onChange={(e) => handleEditorChange(e.target.value)}
      className={`w-full h-full min-h-[300px] p-3 bg-gray-50 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${!isValidJson ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      placeholder="输入JSON格式的请求参数..."
      spellCheck={false}
    />
  );

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          请求参数
        </h2>
        <div className="flex items-center space-x-2">
          {!isValidJson && (
            <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
              <i className="fa-solid fa-exclamation-triangle mr-1"></i>
              JSON格式错误
            </div>
          )}
          <div className="text-sm text-gray-500">JSON格式</div>
        </div>
      </div>

      {formatError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700 text-xs">
            <i className="fa-solid fa-exclamation-circle mr-1"></i>
            <span className="font-medium">JSON格式错误:</span>
          </div>
          <div className="mt-1 text-red-600 text-xs font-mono">
            {formatError}
          </div>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
          {editorError ? (
            renderFallbackTextarea()
          ) : (
            <Editor
              height="100%"
              defaultLanguage="json"
              value={requestParams}
              onChange={handleEditorChange}
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

        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            onClick={clearParams}
            className="p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border shadow-sm"
            title="清空参数"
          >
            <i className="fa-solid fa-trash"></i>
          </button>

          <button
            onClick={validateJson}
            className={`p-1 rounded text-xs border shadow-sm transition-colors ${isValidJson
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            title="验证JSON格式"
          >
            <i className={`fa-solid ${isValidJson ? 'fa-check' : 'fa-times'}`}></i>
          </button>

          <button
            onClick={minifyJson}
            className="p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border shadow-sm"
            title="压缩JSON"
          >
            <i className="fa-solid fa-compress"></i>
          </button>

          <button
            onClick={formatJson}
            className="p-1 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs border shadow-sm"
            title="格式化JSON"
          >
            <i className="fa-solid fa-indent"></i>
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <span>字符数: {requestParams.length}</span>
          <span>行数: {requestParams.split('\n').length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>JSON状态:</span>
          <span className={`px-2 py-0.5 rounded ${isValidJson
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {isValidJson ? '有效' : '无效'}
          </span>
          {editorError && (
            <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
              备用模式
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestPanel;