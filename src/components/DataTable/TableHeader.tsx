import React from "react";
import { Table } from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  MoreHorizontal,
  ArrowDownFromLine,
  Briefcase,
  Calendar,
  CircleDot,
  User,
  Link,
  UserCheck,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import { JobRequest } from "../../types";
import {
  getColumnGroups,
  getColumnHeaderBg,
  CustomColumnDefinition,
  getIconComponent,
} from "./ColumnHelper";
import { ColumnGroup } from "./AddColumnModal";
import EditableHeader from "./EditableHeader";

interface TableHeaderProps {
  table: Table<JobRequest>;
  onAddNewColumn: () => void;
  getGroupWidth: (groupColumns: string[]) => number;
  isGroupResizing: (groupColumns: string[]) => boolean;
  columnGroups: ColumnGroup[];
  customColumns: CustomColumnDefinition[];
  onColumnNameChange: (columnId: string, newName: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  table,
  onAddNewColumn,
  getGroupWidth,
  isGroupResizing,
  columnGroups,
  customColumns,
  onColumnNameChange,
}) => {
  const columnGroupsConfig = getColumnGroups(columnGroups, customColumns);
  return (
    <thead className="bg-gray-50">
      {/* Top level header - Column Groups */}
      <tr>
        {/* Row number header spanning 2 rows */}
        <th
          rowSpan={1}
          className="w-10 px-2 py-1 text-left text-xs font-medium"
        ></th>

        {/* Q3 Financial Overview group - spans first 4 columns */}
        <th
          colSpan={columnGroupsConfig["q3-financial"]?.count || 0}
          className={`px-4 py-1 text-left text-sm font-medium text-gray-700 border-r border-t border-white-200 bg-[#e3e3e3] relative transition-colors ${
            isGroupResizing(columnGroupsConfig["q3-financial"]?.columns || [])
              ? "bg-blue-100 border-blue-300"
              : ""
          }`}
          style={{
            width: getGroupWidth(
              columnGroupsConfig["q3-financial"]?.columns || []
            ),
            minWidth: getGroupWidth(
              columnGroupsConfig["q3-financial"]?.columns || []
            ),
          }}
        >
          <div className="flex items-center space-x-2">
            <EditableHeader
              value={
                columnGroupsConfig["q3-financial"]?.name ||
                "Q3 Financial Overview"
              }
              onSave={(newName) => {
                // Handle group name change for default groups
                console.log("Group name change:", newName);
              }}
              className="text-gray-800 font-medium"
            />
            <button className="ml-auto p-1 hover:bg-blue-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>{" "}
        </th>
        {/* Extra columns group */}
        <th
          colSpan={columnGroupsConfig["extra"]?.count || 0}
          className="px-4 py-1 text-left text-sm font-medium text-gray-700 border-r border-t-0 "
          style={{
            width: getGroupWidth(columnGroupsConfig["extra"]?.columns || []),
            minWidth: getGroupWidth(columnGroupsConfig["extra"]?.columns || []),
          }}
        ></th>
        <th
          colSpan={columnGroupsConfig["extra"]?.count || 0}
          className={`px-4 py-1 text-left text-sm font-medium text-gray-700 border-r border-gray-200 bg-[#D2E0D4] transition-colors ${
            isGroupResizing(columnGroupsConfig["extra"]?.columns || [])
              ? "bg-green-100 border-green-300"
              : ""
          }`}
          style={{
            width: getGroupWidth(columnGroupsConfig["extra"]?.columns || []),
            minWidth: getGroupWidth(columnGroupsConfig["extra"]?.columns || []),
          }}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full mr-2">
              <ArrowDownFromLine className="w-4 h-4 text-gray-500" />
            </div>
            <EditableHeader
              value={columnGroupsConfig["extra"]?.name || "ABC"}
              onSave={(newName) => {
                // Handle group name change for extra group
                console.log("Extra group name change:", newName);
              }}
              className="text-gray-800 font-medium"
            />
            <button className="ml-auto p-1 hover:bg-blue-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </th>

        {/* Answer a question column header */}
        <th
          colSpan={columnGroupsConfig["answer-question"]?.count || 0}
          className="px-4 py-1 text-center text-sm font-medium border-r border-gray-200 bg-[#DCCFFC]"
          style={{
            width: getGroupWidth(
              columnGroupsConfig["answer-question"]?.columns || []
            ),
            minWidth: getGroupWidth(
              columnGroupsConfig["answer-question"]?.columns || []
            ),
          }}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full mr-2">
              <ArrowDownFromLine className="w-4 h-4 text-gray-500" />
            </div>
            <EditableHeader
              value={
                columnGroupsConfig["answer-question"]?.name ||
                "Answer a question"
              }
              onSave={(newName) => {
                console.log("Answer question group name change:", newName);
              }}
              className="text-gray-800 font-medium"
            />
            <button className="ml-auto p-1 hover:bg-blue-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </th>

        {/* Extract column header */}
        <th
          colSpan={columnGroupsConfig["extract"]?.count || 0}
          className="px-4 py-1 text-center text-sm font-medium  border-r border-gray-200 bg-[#FAC2AF]"
          style={{
            width: getGroupWidth(columnGroupsConfig["extract"]?.columns || []),
            minWidth: getGroupWidth(
              columnGroupsConfig["extract"]?.columns || []
            ),
          }}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full mr-2">
              <ArrowDownFromLine className="w-4 h-4 text-gray-500" />
            </div>
            <EditableHeader
              value={columnGroupsConfig["extract"]?.name || "Extract"}
              onSave={(newName) => {
                console.log("Extract group name change:", newName);
              }}
              className="text-gray-800 font-medium"
            />
            <button className="ml-auto p-1 hover:bg-blue-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </th>

        {/* Add column button header */}
        <th
          rowSpan={2}
          className="px-4 py-1 text-center text-sm border-r border-gray-200 bg-[#e3e3e3] hover:bg-gray-200"
        >
          <button
            onClick={onAddNewColumn}
            className="w-32 h-8 rounded-full flex items-center justify-center transition-colors mx-auto"
            title="Add new column"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </th>
      </tr>

      {/* Second level header - Individual columns */}
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          <th
            rowSpan={2}
            className="w-10 px-2 py-1 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-t"
          >
            #
          </th>
          {headerGroup.headers.map((header) => {
            // Skip the add column button header since it has rowSpan=2
            if (header.id === "add-column") {
              return null;
            }

            // Find custom column config if exists
            const customCol = customColumns.find((col) => col.id === header.id);

            // Ensure EditableHeader value is a string
            let headerValue: string = "";
            let IconComponent = null;

            if (customCol?.name) {
              headerValue = customCol.name;
              IconComponent = getIconComponent(customCol.icon);
            } else {
              // Map default column IDs to their display names and icons
              const defaultColumnConfig: {
                [key: string]: {
                  name: string;
                  icon: React.ComponentType<{ className?: string }>;
                };
              } = {
                jobRequest: { name: "Job Request", icon: Briefcase },
                submitted: { name: "Submitted", icon: Calendar },
                status: { name: "Status", icon: CircleDot },
                submitter: { name: "Submitter", icon: User },
                url: { name: "URL", icon: Link },
                assigned: { name: "Assigned", icon: UserCheck },
                priority: { name: "Priority", icon: AlertTriangle },
                dueDate: { name: "Due Date", icon: Clock },
                estValue: { name: "Est. Value", icon: DollarSign },
              };
              const config = defaultColumnConfig[header.id];
              headerValue = config?.name || header.id;
              IconComponent = config?.icon;
            }

            return (
              <th
                key={header.id}
                className="px-2 py-1 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0 relative min-w-32 overflow-hidden"
                style={{
                  width: Math.max(header.getSize(), 128), // Ensure minimum 128px (w-32)
                  position: "relative",
                  backgroundColor: getColumnHeaderBg(header.column.id),
                }}
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={`flex items-center space-x-1 ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:text-gray-700 transition-colors"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {/* Icon and editable column name */}
                    <div className="flex items-center space-x-2">
                      {IconComponent && (
                        <IconComponent className="w-4 h-4 text-gray-500" />
                      )}
                      <EditableHeader
                        value={headerValue}
                        onSave={(newName) =>
                          onColumnNameChange(header.id, newName)
                        }
                        className="truncate"
                      />
                    </div>

                    {header.column.getCanSort() && (
                      <span className="flex flex-col">
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-3 h-3 text-gray-600" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="w-3 h-3 text-gray-600" />
                        ) : (
                          <ChevronUp className="w-3 h-3 text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                )}
                {/* Resize handle */}
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`absolute right-0 top-0 h-full w-2 bg-transparent cursor-col-resize hover:bg-blue-500 hover:opacity-50 transition-all duration-200 ${
                      header.column.getIsResizing()
                        ? "bg-blue-500 opacity-75 w-1"
                        : ""
                    }`}
                    style={{
                      transform: "translateX(50%)",
                    }}
                    title={`Resize ${header.column.id} column`}
                  />
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
