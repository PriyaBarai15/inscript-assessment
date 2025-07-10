# DataTable Components

This directory contains the componentized DataTable structure, broken down into smaller, reusable components for better maintainability and code organization.

## Component Structure

### Main Components

- **`DataTable.tsx`** - Main component that orchestrates all other components
- **`TableHeader.tsx`** - Handles the complex header structure with column groups
- **`TableBody.tsx`** - Manages table body rendering with data and empty rows

### Cell Components

- **`EditableCell.tsx`** - Unified editable cell component supporting both regular cells and empty cells with different types (text, status, priority)

### Utilities

- **`ColumnHelper.tsx`** - Contains column definitions, utilities, and configuration
- **`index.ts`** - Barrel export file for easy imports

## Key Features

### Column Management

- Dynamic column generation
- Column grouping with visual headers
- Resizable columns with minimum width enforcement (w-32 / 128px)
- Background color mapping for different column groups
- Text truncation with ellipsis when columns are resized below content width

### Cell Editing

- Click-to-edit functionality for both regular and empty cells
- Different input types (text, dropdown for status/priority)
- Keyboard navigation (Enter to save, Escape to cancel)
- Unified component handling both regular and empty cell editing modes

### Grid Expansion

- Dynamic row addition on scroll
- Dynamic column addition via "Add Column" button (always positioned at the end)
- Empty cell management for expandable grid
- Plus column consistently stays at the rightmost position when new columns are added

### Styling

- Consistent color scheme for column groups
- Hover effects and transitions
- Responsive design

## Usage

```tsx
import { DataTable } from "./components/DataTable";

<DataTable
  data={jobRequests}
  loading={loading}
  error={error}
  selectedRows={selectedRows}
  onDataUpdate={handleDataUpdate}
/>;
```

## Column Groups

The table supports several column groups with distinct styling:

1. **Q3 Financial Overview** (`#e3e3e3` header, `#eeeeee` columns)

   - Job Request, Submitted, Status, Submitter

2. **ABC Group** (`#D2E0D4` header, `#E8F0E9` columns)

   - Assigned

3. **Answer a Question** (`#DCCFFC` header, `#EAE3FC` columns)

   - Priority, Due Date

4. **Extract** (`#FAC2AF` header, `#FFE9E0` columns)

   - Est. Value

5. **URL Column** (standalone, `#f9f9f9` background)

## Extending

To add new column types or groups:

1. Update `ColumnHelper.tsx` with new column definitions
2. Add corresponding group configuration in `getColumnGroups()`
3. Update `getColumnHeaderBg()` for column background colors
4. Modify `TableHeader.tsx` if new group headers are needed
