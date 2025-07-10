import {
  Briefcase,
  Calendar,
  CircleDot,
  User,
  Link,
  UserCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  // Additional icons for custom columns
  Home,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Settings,
  Search,
  Edit,
  File,
  Folder,
  Image,
  Tag,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { JobRequest } from "../../types";
import EditableCell from "./EditableCell";
import { ColumnGroup } from "./AddColumnModal";

const columnHelper = createColumnHelper<JobRequest>();

export interface ColumnConfig {
  editingCell: { id: number; field: keyof JobRequest } | null;
  editValue: string;
  onCellClick: (
    id: number,
    field: keyof JobRequest,
    currentValue: string
  ) => void;
  onEditValueChange: (value: string) => void;
  onCellSave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  gridData: { [key: string]: string };
  onUpdateGridData: (row: number, col: number, value: string) => void;
  customColumns?: CustomColumnDefinition[];
  columnGroups?: ColumnGroup[];
  onColumnNameChange?: (columnId: string, newName: string) => void;
  onColumnGroupChange?: (columnId: string, groupId: string) => void;
}

export interface CustomColumnDefinition {
  id: string;
  name: string;
  groupId: string;
  type: "text" | "status" | "priority" | "date" | "number";
  icon?: string;
}

// Function to generate column letters like Excel (A, B, C, ..., Z, AA, AB, etc.)
export const getColumnLetter = (index: number): string => {
  let result = "";
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

// Helper to map column id to header background color (lower shade of group header)
export const getColumnHeaderBg = (columnId: string): string => {
  switch (columnId) {
    case "jobRequest":
    case "submitted":
    case "status":
    case "submitter":
      return "#eeeeee"; // darker shade of Q3 Financial header
    case "url":
      return "#f9f9f9"; // default light shade for URL column
    case "assigned":
      return "#E8F0E9"; // darker shade of extra group header
    case "priority":
    case "dueDate":
      return "#EAE3FC"; // darker shade of answerQuestion header
    case "estValue":
      return "#FFE9E0"; // darker shade of extract header
    default:
      return "";
  }
};

// Define default column groups and create dynamic ones
export const getDefaultColumnGroups = (): ColumnGroup[] => [
  {
    id: "q3-financial",
    name: "Q3 Financial Overview",
    color: "#e3e3e3",
  },
  {
    id: "extra",
    name: "ABC",
    color: "#D2E0D4",
  },
  {
    id: "answer-question",
    name: "Answer a question",
    color: "#DCCFFC",
  },
  {
    id: "extract",
    name: "Extract",
    color: "#FAC2AF",
  },
];

// Define column group mappings with dynamic sizing support
export const getColumnGroups = (
  customGroups: ColumnGroup[] = [],
  customColumns: CustomColumnDefinition[] = []
) => {
  const allGroups = [...getDefaultColumnGroups(), ...customGroups];

  // Create group mappings
  const groups: {
    [key: string]: {
      start: number;
      count: number;
      name: string;
      columns: string[];
      color: string;
    };
  } = {};

  // Default column mappings
  const defaultMappings = {
    "q3-financial": ["jobRequest", "submitted", "status", "submitter"],
    none: ["url"],
    extra: ["assigned"],
    "answer-question": ["priority", "dueDate"],
    extract: ["estValue"],
  };

  // Add default groups
  let currentStart = 0;
  Object.entries(defaultMappings).forEach(([groupId, columns]) => {
    const group = allGroups.find((g) => g.id === groupId);
    if (group && columns.length > 0) {
      groups[groupId] = {
        start: currentStart,
        count: columns.length,
        name: group.name,
        columns,
        color: group.color,
      };
      currentStart += columns.length;
    }
  });

  // Add custom columns to their respective groups
  customColumns.forEach((column) => {
    const groupId = column.groupId || "extra";
    if (!groups[groupId]) {
      const group = allGroups.find((g) => g.id === groupId);
      groups[groupId] = {
        start: currentStart,
        count: 0,
        name: group?.name || groupId,
        columns: [],
        color: group?.color || "#F0F0F0",
      };
    }
    groups[groupId].columns.push(column.id);
    groups[groupId].count += 1;
  });

  return groups;
};

// Generate custom columns from configuration
export const generateCustomColumns = (config: ColumnConfig) => {
  if (!config.customColumns) return [];

  return config.customColumns.map((columnDef) => {
    const IconComponent = getIconComponent(columnDef.icon);

    return columnHelper.display({
      id: columnDef.id,
      header: () => (
        <div className="flex items-center justify-center min-w-[100px] space-x-2">
          {IconComponent && <IconComponent className="w-4 h-4 text-gray-500" />}
          <span className="font-medium text-gray-600">{columnDef.name}</span>
        </div>
      ),
      cell: ({ row }) => (
        <EditableCell
          isEmptyCell={true}
          row={row.index}
          col={parseInt(columnDef.id.split("-")[1]) || 0}
          gridData={config.gridData}
          onUpdateGridData={config.onUpdateGridData}
        />
      ),
      size: 128,
      minSize: 128,
      maxSize: 250,
    });
  });
};

// Generate extra columns dynamically (for backward compatibility)
export const generateExtraColumns = (count: number, config: ColumnConfig) => {
  const extraCols = [];
  for (let i = 1; i < count + 1; i++) {
    // Start from 1 instead of 0
    const columnLetter = getColumnLetter(i + 10); // Adjust to start from the correct column position
    extraCols.push(
      columnHelper.display({
        id: `extra-${i}`,
        header: () => (
          <div className="flex items-center justify-center min-w-[100px]">
            <span className="font-medium text-gray-600">{columnLetter}</span>
          </div>
        ),
        cell: ({ row }) => (
          <EditableCell
            isEmptyCell={true}
            row={row.index}
            col={i + 10} // Adjust column index accordingly
            gridData={config.gridData}
            onUpdateGridData={config.onUpdateGridData}
          />
        ),
        size: 128,
        minSize: 128,
        maxSize: 250,
      })
    );
  }

  return extraCols;
};

export const createBaseColumns = (config: ColumnConfig) => [
  columnHelper.accessor("jobRequest", {
    header: () => (
      <div className="flex items-center space-x-2">
        <Briefcase className="w-4 h-4 text-gray-500" />
        <span>Job Request</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="jobRequest"
        className="text-sm text-gray-900 font-medium"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 280,
    minSize: 128,
    maxSize: 500,
  }),
  columnHelper.accessor("submitted", {
    header: () => (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>Submitted</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="submitted"
        className="text-sm text-gray-600"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 200,
  }),
  columnHelper.accessor("status", {
    header: () => (
      <div className="flex items-center space-x-2">
        <CircleDot className="w-4 h-4 text-gray-500" />
        <span>Status</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="status"
        isStatus={true}
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 180,
  }),
  columnHelper.accessor("submitter", {
    header: () => (
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-500" />
        <span>Submitter</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="submitter"
        className="text-sm text-gray-900"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 200,
  }),
  columnHelper.accessor("url", {
    header: () => (
      <div className="flex items-center space-x-2">
        <Link className="w-4 h-4 text-gray-500" />
        <span>URL</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="url"
        className="text-sm text-blue-600 hover:text-blue-800 truncate"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 140,
    minSize: 128,
    maxSize: 300,
  }),
  columnHelper.accessor("assigned", {
    header: () => (
      <div className="flex items-center space-x-2">
        <UserCheck className="w-4 h-4 text-gray-500" />
        <span>Assigned</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="assigned"
        className="text-sm text-gray-900"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 200,
  }),
  columnHelper.accessor("priority", {
    header: () => (
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-gray-500" />
        <span>Priority</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="priority"
        isPriority={true}
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 150,
  }),
  columnHelper.accessor("dueDate", {
    header: () => (
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span>Due Date</span>
      </div>
    ),
    cell: (info) => (
      <EditableCell
        value={info.getValue()}
        id={info.row.original.id}
        field="dueDate"
        className="text-sm text-gray-600"
        editingCell={config.editingCell}
        editValue={config.editValue}
        onCellClick={config.onCellClick}
        onEditValueChange={config.onEditValueChange}
        onCellSave={config.onCellSave}
        onKeyDown={config.onKeyDown}
      />
    ),
    size: 128,
    minSize: 128,
    maxSize: 180,
  }),
  columnHelper.accessor("estValue", {
    header: () => (
      <div className="flex items-center space-x-2">
        <DollarSign className="w-4 h-4 text-gray-500" />
        <span>Est. Value</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-sm text-gray-900 font-medium inline-flex items-center">
        <EditableCell
          value={info.getValue()}
          id={info.row.original.id}
          field="estValue"
          className="inline"
          editingCell={config.editingCell}
          editValue={config.editValue}
          onCellClick={config.onCellClick}
          onEditValueChange={config.onEditValueChange}
          onCellSave={config.onCellSave}
          onKeyDown={config.onKeyDown}
        />
        <span className="ml-1 text-gray-400">₹</span>
      </div>
    ),
    size: 128,
    minSize: 128,
    maxSize: 200,
  }),
];

// Available icons for custom columns (20 options)
export const AVAILABLE_ICONS = [
  { name: "briefcase", component: Briefcase, label: "Briefcase" },
  { name: "calendar", component: Calendar, label: "Calendar" },
  { name: "user", component: User, label: "User" },
  { name: "mail", component: Mail, label: "Mail" },
  { name: "phone", component: Phone, label: "Phone" },
  { name: "home", component: Home, label: "Home" },
  { name: "star", component: Star, label: "Star" },
  { name: "heart", component: Heart, label: "Heart" },
  { name: "settings", component: Settings, label: "Settings" },
  { name: "search", component: Search, label: "Search" },
  { name: "edit", component: Edit, label: "Edit" },
  { name: "file", component: File, label: "File" },
  { name: "folder", component: Folder, label: "Folder" },
  { name: "image", component: Image, label: "Image" },
  { name: "tag", component: Tag, label: "Tag" },
  { name: "link", component: Link, label: "Link" },
  { name: "clock", component: Clock, label: "Clock" },
  { name: "alert-triangle", component: AlertTriangle, label: "Alert" },
  { name: "dollar-sign", component: DollarSign, label: "Money" },
  { name: "map-pin", component: MapPin, label: "Location" },
];

// Get icon component by name
export const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  const iconConfig = AVAILABLE_ICONS.find((icon) => icon.name === iconName);
  return iconConfig ? iconConfig.component : null;
};
