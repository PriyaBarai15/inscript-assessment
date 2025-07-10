import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { JobRequest } from "../../types";
import {
  createBaseColumns,
  ColumnConfig,
  generateCustomColumns,
  CustomColumnDefinition,
  getDefaultColumnGroups,
} from "./ColumnHelper";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<JobRequest>();
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import AddColumnModal, { NewGroupConfig, ColumnGroup } from "./AddColumnModal";

interface DataTableProps {
  data: JobRequest[];
  loading: boolean;
  error: string | null;
  selectedRows: number[];
  onDataUpdate?: (id: number, field: keyof JobRequest, value: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  error,
  selectedRows,
  onDataUpdate,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnSizing, setColumnSizing] = React.useState({});
  const [editingCell, setEditingCell] = React.useState<{
    id: number;
    field: keyof JobRequest;
  } | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");
  const [tableData, setTableData] = React.useState<JobRequest[]>(data);
  const [minRows, setMinRows] = React.useState(50);
  const [gridData, setGridData] = React.useState<{ [key: string]: string }>({});
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = React.useState(false);
  const [customColumns, setCustomColumns] = React.useState<
    CustomColumnDefinition[]
  >([]);
  const [columnGroups, setColumnGroups] = React.useState<ColumnGroup[]>(
    getDefaultColumnGroups()
  );
  const [customColumnCounter, setCustomColumnCounter] = React.useState(0);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Function to add a new column
  const addNewColumn = () => {
    setIsAddColumnModalOpen(true);
  };

  // Handle adding a new column group from modal
  const handleAddColumns = (groupConfig: NewGroupConfig) => {
    // Create the new group
    const colors = [
      "#FFE5E5",
      "#E5F3FF",
      "#E5FFE5",
      "#FFF5E5",
      "#F0E5FF",
      "#E5FFF5",
    ];
    const groupId = groupConfig.groupName.toLowerCase().replace(/\s+/g, "-");
    const newGroup: ColumnGroup = {
      id: groupId,
      name: groupConfig.groupName,
      color: colors[columnGroups.length % colors.length],
    };

    // Create the columns for this group
    const newColumns: CustomColumnDefinition[] = groupConfig.columns.map(
      (columnConfig, index) => ({
        id: `custom-${customColumnCounter + index}`,
        name: columnConfig.name,
        groupId: groupId,
        type: columnConfig.type,
        icon: columnConfig.icon,
      })
    );

    // Update state
    setColumnGroups((prev) => [...prev, newGroup]);
    setCustomColumns((prev) => [...prev, ...newColumns]);
    setCustomColumnCounter((prev) => prev + groupConfig.columns.length);
  };

  // Handle column name changes
  const handleColumnNameChange = (columnId: string, newName: string) => {
    setCustomColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, name: newName } : col))
    );
  };

  // Handle column group changes
  const handleColumnGroupChange = (columnId: string, groupId: string) => {
    setCustomColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, groupId } : col))
    );
  };

  // Update table data when prop data changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Handle column size changes and update groups
  React.useEffect(() => {
    // Force re-render when column sizing changes to update colspans
    const timer = setTimeout(() => {
      // This effect ensures the header groups recalculate when columns are resized
      console.log("Column sizing changed:", columnSizing);
    }, 0);
    return () => clearTimeout(timer);
  }, [columnSizing]);

  // Handle scroll to detect when user reaches the bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // Check if scrolled to bottom (with 50px threshold for better detection)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isAtBottom) {
      // Add more rows when reaching the bottom
      console.log("Near bottom - checking if we need more rows...");
      console.log(
        `Current minRows: ${minRows}, tableData length: ${tableData.length}`
      );

      const currentEmptyRows = Math.max(0, minRows - tableData.length);
      console.log(`Current empty rows: ${currentEmptyRows}`);

      if (currentEmptyRows <= 15) {
        console.log("Expanding table rows - adding 25 more rows...");
        setMinRows((prev) => {
          const newMinRows = prev + 25;
          console.log(`Updating minRows from ${prev} to ${newMinRows}`);
          return newMinRows;
        });
      }
    }
  };

  // Function to handle clicking on empty cells to add new data
  const handleEmptyClick = (rowNumber: number, colIndex: number) => {
    console.log(
      `Clicked on empty cell at row ${rowNumber}, column ${colIndex}`
    );
  };

  // Update grid data for extra cells
  const updateGridData = (row: number, col: number, value: string) => {
    const key = `${row}-${col}`;
    setGridData((prev) => {
      const newData = { ...prev };
      if (value === "" && col >= 11) {
        // For extra columns, keep empty values to maintain column structure
        newData[key] = value;
      } else if (value === "") {
        // For main/fixed columns, remove completely empty values
        delete newData[key];
      } else {
        newData[key] = value;
      }
      return newData;
    });
  };

  const handleCellClick = (
    id: number,
    field: keyof JobRequest,
    currentValue: string
  ) => {
    if (field === "id") return; // Don't allow editing ID field
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (editingCell && onDataUpdate) {
      onDataUpdate(editingCell.id, editingCell.field, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellSave();
    } else if (e.key === "Escape") {
      handleCellCancel();
    }
  };

  // Get the total width of columns in a group
  const getGroupWidth = (groupColumns: string[]) => {
    return groupColumns.reduce((total, columnId) => {
      const column = table.getColumn(columnId);
      if (column) {
        return total + column.getSize();
      }
      return total;
    }, 0);
  };

  // Check if any column in a group is being resized
  const isGroupResizing = (groupColumns: string[]) => {
    return groupColumns.some((columnId) => {
      const column = table.getColumn(columnId);
      return column?.getIsResizing();
    });
  };

  // Create column configuration for the components
  const columnConfig: ColumnConfig = {
    editingCell,
    editValue,
    onCellClick: handleCellClick,
    onEditValueChange: setEditValue,
    onCellSave: handleCellSave,
    onKeyDown: handleKeyDown,
    gridData,
    onUpdateGridData: updateGridData,
    customColumns,
    columnGroups,
    onColumnNameChange: handleColumnNameChange,
    onColumnGroupChange: handleColumnGroupChange,
  };

  // Create base columns using the helper
  const baseColumns = createBaseColumns(columnConfig);

  // Generate custom columns
  const customColumnComponents = generateCustomColumns(columnConfig);

  // Add the "Add Column" button as the last column
  const addColumnButton = columnHelper.display({
    id: "add-column",
    header: () => null, // Header is handled in TableHeader component
    cell: () => null, // Cell is handled in TableBody component
    size: 50,
    enableResizing: false,
  });

  const allColumns = [
    ...baseColumns,
    ...customColumnComponents,
    addColumnButton,
  ];

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    state: {
      sorting,
      rowSelection,
      columnSizing,
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange" as const,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: (updater) => {
      setColumnSizing(updater);
      // Trigger a re-render for group headers
      setTimeout(() => {
        console.log("Column sizing updated, headers should re-render");
      }, 0);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  // Sync row selection with parent component
  React.useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    if (
      JSON.stringify(selectedIds.sort()) !== JSON.stringify(selectedRows.sort())
    ) {
      const newSelection: RowSelectionState = {};
      selectedRows.forEach((id) => {
        newSelection[id.toString()] = true;
      });
      setRowSelection(newSelection);
    }
  }, [selectedRows, rowSelection]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error loading data</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="bg-white border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📋 No data found</div>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  // Generate empty rows to fill the grid (dynamic based on scroll)
  const emptyRowsCount = Math.max(0, minRows - tableData.length);
  console.log(
    `Calculating empty rows: minRows=${minRows}, tableData.length=${tableData.length}, emptyRowsCount=${emptyRowsCount}`
  );

  const emptyRows = Array.from(
    { length: emptyRowsCount },
    (_, index) => index + tableData.length + 1
  );

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        <table
          className="w-full border-collapse"
          style={{
            width: table.getCenterTotalSize(),
            whiteSpace: "nowrap",
          }}
        >
          <TableHeader
            table={table}
            onAddNewColumn={addNewColumn}
            getGroupWidth={getGroupWidth}
            isGroupResizing={isGroupResizing}
            columnGroups={columnGroups}
            customColumns={customColumns}
            onColumnNameChange={handleColumnNameChange}
          />
          <TableBody
            table={table}
            emptyRows={emptyRows}
            gridData={gridData}
            onUpdateGridData={updateGridData}
            onEmptyClick={handleEmptyClick}
          />
        </table>
      </div>

      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumns={handleAddColumns}
      />
    </div>
  );
};

export default DataTable;
