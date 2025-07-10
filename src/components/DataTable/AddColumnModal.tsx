import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (columnConfig: NewColumnConfig) => void;
  availableGroups: ColumnGroup[];
  onCreateGroup: (groupName: string) => void;
}

export interface ColumnGroup {
  id: string;
  name: string;
  color: string;
}

export interface NewColumnConfig {
  name: string;
  groupId: string;
  type: "text" | "status" | "priority" | "date" | "number";
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  isOpen,
  onClose,
  onAddColumn,
  availableGroups,
  onCreateGroup,
}) => {
  const [columnName, setColumnName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [columnType, setColumnType] = useState<NewColumnConfig["type"]>("text");
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnName.trim()) {
      onAddColumn({
        name: columnName.trim(),
        groupId: selectedGroup || "extra",
        type: columnType,
      });
      setColumnName("");
      setSelectedGroup("");
      setColumnType("text");
      onClose();
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setSelectedGroup(newGroupName.trim().toLowerCase().replace(/\s+/g, "-"));
      setNewGroupName("");
      setIsCreatingGroup(false);
    }
  };

  const handleCancel = () => {
    setColumnName("");
    setSelectedGroup("");
    setColumnType("text");
    setNewGroupName("");
    setIsCreatingGroup(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Column
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Column Name */}
          <div>
            <label
              htmlFor="columnName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Name *
            </label>
            <input
              id="columnName"
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter column name..."
              required
              autoFocus
            />
          </div>

          {/* Column Type */}
          <div>
            <label
              htmlFor="columnType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Type
            </label>
            <select
              id="columnType"
              value={columnType}
              onChange={(e) =>
                setColumnType(e.target.value as NewColumnConfig["type"])
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Text</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
            </select>
          </div>

          {/* Column Group */}
          <div>
            <label
              htmlFor="columnGroup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Group (Optional)
            </label>
            {!isCreatingGroup ? (
              <div className="flex space-x-2">
                <select
                  id="columnGroup"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Default (Extra Columns)</option>
                  {availableGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(true)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center space-x-1"
                  title="Create new group"
                >
                  <Plus className="w-4 h-4" />
                  <span>New</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateGroup} className="flex space-x-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingGroup(false);
                    setNewGroupName("");
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#4B6A4F] hover:bg-opacity-80 rounded-md transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Column</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColumnModal;
