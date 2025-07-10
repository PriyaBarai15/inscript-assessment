import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { JobRequest } from "../../types";
import EditableCell from "./EditableCell";

interface TableBodyProps {
  table: Table<JobRequest>;
  emptyRows: number[];
  gridData: { [key: string]: string };
  onUpdateGridData: (row: number, col: number, value: string) => void;
  onEmptyClick: (rowNumber: number, colIndex: number) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
  table,
  emptyRows,
  gridData,
  onUpdateGridData,
  onEmptyClick,
}) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {/* Data rows */}
      {table.getRowModel().rows.map((row, index) => (
        <tr
          key={row.id}
          className={`hover:bg-gray-50 transition-colors ${
            row.getIsSelected() ? "bg-blue-50" : ""
          }`}
        >
          {/* Row number */}
          <td className="w-10 px-2 py-1 text-center text-sm text-gray-500 border-r border-gray-200 bg-gray-50 font-medium whitespace-nowrap">
            {index + 1}
          </td>
          {row.getVisibleCells().map((cell) => {
            // Handle add column button cell
            if (cell.column.id === "add-column") {
              return (
                <td
                  key={cell.id}
                  className="px-1 py-1 text-sm border-r border-gray-200 text-center whitespace-nowrap min-h-[32px] w-[50px]"
                >
                  {/* Empty cell for add column button */}
                </td>
              );
            }

            return (
              <td
                key={cell.id}
                className="px-1 py-1 text-sm border-r border-gray-200 last:border-r-0 min-w-32 min-h-[32px] overflow-hidden"
                style={{
                  width: Math.max(cell.column.getSize(), 128),
                  minWidth: 128,
                  maxWidth: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}

      {/* Empty rows */}
      {emptyRows.map((rowNumber) => (
        <tr
          key={`empty-${rowNumber}`}
          className="hover:bg-gray-50 transition-colors"
        >
          {/* Row number */}
          <td className="w-10 px-2 py-1 text-sm text-center text-gray-500 border-r border-gray-200 bg-gray-50 font-medium whitespace-nowrap">
            {rowNumber}
          </td>
          {/* Empty cells for all columns */}
          {table.getAllColumns().map((column, colIndex) => {
            // Handle add column button cell
            if (column.id === "add-column") {
              return (
                <td
                  key={`empty-add-column-${rowNumber}`}
                  className="px-1 py-1 text-sm border-r border-gray-200 text-center whitespace-nowrap min-h-[32px] w-[50px]"
                >
                  {/* Empty cell for add column button */}
                </td>
              );
            }

            // Determine column index for grid data
            const gridColIndex = colIndex;

            return (
              <td
                key={`empty-cell-${rowNumber}-${column.id}`}
                className="p-1 text-sm border-r border-gray-200 last:border-r-0 cursor-pointer transition-colors min-w-32 min-h-[32px] overflow-hidden"
                style={{
                  width: Math.max(column.getSize(), 128),
                  minWidth: 128,
                  maxWidth: column.getSize(),
                }}
                onClick={() => onEmptyClick(rowNumber, gridColIndex)}
                title="Click to add data"
              >
                <EditableCell
                  isEmptyCell={true}
                  row={rowNumber - 1}
                  col={gridColIndex}
                  gridData={gridData}
                  onUpdateGridData={onUpdateGridData}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
