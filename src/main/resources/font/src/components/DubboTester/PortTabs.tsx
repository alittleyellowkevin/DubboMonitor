import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PortTab {
  id: string;
  name: string;
  host: string;
  port: number;
}

interface PortTabsProps {
  ports: PortTab[];
  activePort: string;
  setActivePort: (portId: string) => void;
  addPort?: (name: string, host: string, port: number) => string;
  updatePort?: (portId: string, updates: { name?: string; host?: string; port?: number }) => void;
  removePort?: (portId: string) => void;
  className?: string;
}

export default function PortTabs({
  ports,
  activePort,
  setActivePort,
  addPort,
  updatePort,
  removePort,
  className = ''
}: PortTabsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<PortTab | null>(null);
  const [newPortData, setNewPortData] = useState({ name: '', host: 'localhost', port: 20880 });
  const [editPortData, setEditPortData] = useState({ name: '', host: '', port: 0 });

  const handleAddPort = () => {
    if (addPort && newPortData.name && newPortData.port) {
      const newPortId = addPort(newPortData.name, newPortData.host, newPortData.port);
      setActivePort(newPortId);
      setNewPortData({ name: '', host: 'localhost', port: 20880 });
      setShowAddDialog(false);
    }
  };

  const handleEditPort = () => {
    if (updatePort && showEditDialog && editPortData.name && editPortData.port) {
      updatePort(showEditDialog.id, {
        name: editPortData.name,
        host: editPortData.host,
        port: editPortData.port
      });
      setShowEditDialog(null);
      setEditPortData({ name: '', host: '', port: 0 });
    }
  };

  const handleRemovePort = (portId: string) => {
    if (removePort && window.confirm('确定要删除这个端口吗？')) {
      removePort(portId);
    }
  };

  const openEditDialog = (port: PortTab) => {
    setShowEditDialog(port);
    setEditPortData({ name: port.name, host: port.host, port: port.port });
  };

  return (
    <>
      <div className={cn('flex items-center p-2', className)}>
        <div className="flex space-x-1 flex-1">
          {ports.map((port) => (
            <div key={port.id} className="relative group flex-shrink-0">
              <button
                onClick={() => setActivePort(port.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activePort === port.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {port.name}
                <span className="ml-1 text-xs opacity-70">({port.port})</span>
              </button>

              {/* 端口操作菜单 */}
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => openEditDialog(port)}
                  className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
                >
                  <i className="fa-solid fa-edit mr-1"></i>编辑
                </button>
                {removePort && (
                  <button
                    onClick={() => handleRemovePort(port.id)}
                    className="block w-full px-3 py-1 text-xs text-left text-red-600 hover:bg-gray-100"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>删除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {addPort && (
          <button
            onClick={() => setShowAddDialog(true)}
            className="ml-2 p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0"
            title="添加新端口"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
      </div>

      {/* 添加端口对话框 */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">添加新端口</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">端口名称</label>
                <input
                  type="text"
                  value={newPortData.name}
                  onChange={(e) => setNewPortData({ ...newPortData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="例如：开发环境"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">主机地址</label>
                <input
                  type="text"
                  value={newPortData.host}
                  onChange={(e) => setNewPortData({ ...newPortData, host: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">端口号</label>
                <input
                  type="number"
                  value={newPortData.port}
                  onChange={(e) => setNewPortData({ ...newPortData, port: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="20880"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddPort}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑端口对话框 */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">编辑端口</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">端口名称</label>
                <input
                  type="text"
                  value={editPortData.name}
                  onChange={(e) => setEditPortData({ ...editPortData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">主机地址</label>
                <input
                  type="text"
                  value={editPortData.host}
                  onChange={(e) => setEditPortData({ ...editPortData, host: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">端口号</label>
                <input
                  type="number"
                  value={editPortData.port}
                  onChange={(e) => setEditPortData({ ...editPortData, port: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowEditDialog(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleEditPort}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}