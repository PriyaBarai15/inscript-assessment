import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { AVAILABLE_ICONS } from "./ColumnHelper";

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumns: (groupConfig: NewGroupConfig) => void;
}

export interface ColumnGroup {
  id: string;
  name: string;
  color: string;
}

export interface NewColumnConfig {
  name: string;
  type: "text" | "status" | "priority" | "date" | "number";
  icon?: string;
}

export interface NewGroupConfig {
  groupName: string;
  columns: NewColumnConfig[];
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  isOpen,
  onClose,
  onAddColumns,
}) => {
  const [groupName, setGroupName] = useState("");
  const [columns, setColumns] = useState<NewColumnConfig[]>([
    { name: "", type: "text", icon: "" },
  ]);

  const addColumn = () => {
    setColumns((prev) => [...prev, { name: "", type: "text", icon: "" }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateColumn = (
    index: number,
    field: keyof NewColumnConfig,
    value: string
  ) => {
    setColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, [field]: value } : col))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validColumns = columns.filter((col) => col.name.trim());
    if (groupName.trim() && validColumns.length > 0) {
      onAddColumns({
        groupName: groupName.trim(),
        columns: validColumns.map((col) => ({
          ...col,
          name: col.name.trim(),
          icon: col.icon || undefined,
        })),
      });
      handleCancel();
    }
  };

  const handleCancel = () => {
    setGroupName("");
    setColumns([{ name: "", type: "text", icon: "" }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Column Group
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Group Name */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Group Name *
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter group name..."
              required
              autoFocus
            />
          </div>

          {/* Columns */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Columns *
              </label>
              <button
                type="button"
                onClick={addColumn}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Column</span>
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {columns.map((column, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Column {index + 1}
                    </span>
                    {columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Column Name */}
                  <div>
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) =>
                        updateColumn(index, "name", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Column name..."
                      required
                    />
                  </div>

                  {/* Column Type and Icon */}
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={column.type}
                      onChange={(e) =>
                        updateColumn(index, "type", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="status">Status</option>
                      <option value="priority">Priority</option>
                      <option value="date">Date</option>
                      <option value="number">Number</option>
                    </select>

                    <select
                      value={column.icon || ""}
                      onChange={(e) =>
                        updateColumn(index, "icon", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Icon</option>
                      {AVAILABLE_ICONS.map((iconConfig) => (
                        <option key={iconConfig.name} value={iconConfig.name}>
                          {iconConfig.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
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
              <span>Add Group</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColumnModal;
