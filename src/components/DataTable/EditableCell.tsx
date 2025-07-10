import React from "react";
import { JobRequest } from "../../types";

interface EditableCellProps {
  // For regular cells
  value?: string;
  id?: number;
  field?: keyof JobRequest;
  editingCell?: { id: number; field: keyof JobRequest } | null;
  editValue?: string;
  onCellClick?: (
    id: number,
    field: keyof JobRequest,
    currentValue: string
  ) => void;
  onEditValueChange?: (value: string) => void;
  onCellSave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;

  // For empty cells (grid mode)
  row?: number;
  col?: number;
  gridData?: { [key: string]: string };
  onUpdateGridData?: (row: number, col: number, value: string) => void;

  // Common props
  className?: string;
  isStatus?: boolean;
  isPriority?: boolean;
  isEmptyCell?: boolean; // Flag to determine which mode to use
}

const EditableCell: React.FC<EditableCellProps> = ({
  // Regular cell props
  value = "",
  id,
  field,
  editingCell,
  editValue = "",
  onCellClick,
  onEditValueChange,
  onCellSave,
  onKeyDown,

  // Empty cell props
  row,
  col,
  gridData,
  onUpdateGridData,

  // Common props
  className = "",
  isStatus = false,
  isPriority = false,
  isEmptyCell = false,
}) => {
  // State for empty cell editing
  const [editingEmptyCell, setEditingEmptyCell] = React.useState<string | null>(
    null
  );
  const [editEmptyValue, setEditEmptyValue] = React.useState<string>("");

  // Determine the actual value and editing state
  let cellValue: string;
  let isEditing: boolean;

  if (
    isEmptyCell &&
    typeof row === "number" &&
    typeof col === "number" &&
    gridData
  ) {
    const cellKey = `${row}-${col}`;
    cellValue = gridData[cellKey] || "";
    isEditing = editingEmptyCell === cellKey;
  } else {
    cellValue = value;
    isEditing = editingCell?.id === id && editingCell?.field === field;
  }

  // Determine if this is a status or priority column for empty cells
  const isStatusColumn = isEmptyCell && col === 2;
  const isPriorityColumn = isEmptyCell && col === 6;
  const effectiveIsStatus = isStatus || isStatusColumn;
  const effectiveIsPriority = isPriority || isPriorityColumn;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In-process":
        return "bg-[#FFF3D6] text-[#85640B]";
      case "Need to start":
        return "bg-[#E2E8F0] text-[#475569]";
      case "Complete":
        return "bg-[#D3F2E3] text-[#0A6E3D]";
      case "Blocked":
        return "bg-[#FFE1DE] text-[#C22219]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 font-medium";
      case "Medium":
        return "text-yellow-600 font-medium";
      case "Low":
        return "text-blue-600 font-medium";
      default:
        return "text-gray-600 font-medium";
    }
  };

  // Empty cell handlers
  const handleEmptyCellClick = () => {
    if (isEmptyCell && typeof row === "number" && typeof col === "number") {
      const cellKey = `${row}-${col}`;
      setEditingEmptyCell(cellKey);
      setEditEmptyValue(cellValue);
    }
  };

  const handleEmptyCellSave = () => {
    if (
      isEmptyCell &&
      typeof row === "number" &&
      typeof col === "number" &&
      onUpdateGridData
    ) {
      onUpdateGridData(row, col, editEmptyValue);
      setEditingEmptyCell(null);
      setEditEmptyValue("");
    }
  };

  const handleEmptyCellCancel = () => {
    setEditingEmptyCell(null);
    setEditEmptyValue("");
  };

  const handleEmptyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEmptyCellSave();
    } else if (e.key === "Escape") {
      handleEmptyCellCancel();
    }
  };

  // Cell click handler
  const handleCellClick = () => {
    if (isEmptyCell) {
      handleEmptyCellClick();
    } else if (onCellClick && typeof id === "number" && field) {
      onCellClick(id, field, cellValue);
    }
  };

  // Editing mode render
  if (isEditing) {
    const currentEditValue = isEmptyCell ? editEmptyValue : editValue;
    const handleValueChange = isEmptyCell
      ? (value: string) => setEditEmptyValue(value)
      : onEditValueChange || (() => {});
    const handleSave = isEmptyCell
      ? handleEmptyCellSave
      : onCellSave || (() => {});
    const handleKeyDownEvent = isEmptyCell
      ? handleEmptyKeyDown
      : onKeyDown || (() => {});

    if (effectiveIsStatus) {
      return (
        <select
          value={currentEditValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDownEvent}
          className="w-full border border-blue-500 rounded px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        >
          {isEmptyCell && <option value="">Select status...</option>}
          <option value="In-process">In-process</option>
          <option value="Need to start">Need to start</option>
          <option value="Complete">Complete</option>
          <option value="Blocked">Blocked</option>
        </select>
      );
    } else if (effectiveIsPriority) {
      return (
        <select
          value={currentEditValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDownEvent}
          className="w-full border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        >
          {isEmptyCell && <option value="">Select priority...</option>}
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      );
    } else {
      return (
        <input
          type="text"
          value={currentEditValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDownEvent}
          className="w-full border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      );
    }
  }

  // Display mode render
  return (
    <div
      onClick={handleCellClick}
      className={`cursor-pointer hover:bg-gray-100 transition-colors rounded px-1 py-0.5 overflow-hidden ${className}`}
      title="Click to edit"
    >
      {cellValue ? (
        effectiveIsStatus ? (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full truncate ${getStatusColor(
              cellValue
            )}`}
          >
            {cellValue}
          </span>
        ) : effectiveIsPriority ? (
          <span className={`text-sm truncate ${getPriorityColor(cellValue)}`}>
            {cellValue}
          </span>
        ) : (
          <span className="text-sm text-gray-900 truncate block">
            {cellValue}
          </span>
        )
      ) : (
        <span className="text-gray-400 text-xs select-none">&nbsp;</span>
      )}
    </div>
  );
};

export default EditableCell;
