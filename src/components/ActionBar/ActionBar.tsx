import React, { useState } from 'react';
import { Download, Upload, Share2, Plus, Grid3X3, EyeOff, Eye, ArrowUpDown, ListFilter, ChevronsRight } from 'lucide-react';

const ActionBar: React.FC = () => {
  const [eyeOpen, setEyeOpen] = useState<boolean>(false);

  const handleClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
  };

  const handleEyeToggle = () => {
    const newEyeState = !eyeOpen;
    setEyeOpen(newEyeState);
    console.log(`Eye toggle clicked: ${newEyeState ? 'Show' : 'Hide'} fields`);
  };

  return (
    <div className="bg-white border-gray-200 px-6 py-1 pb-2">
      {/* Top Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-black">Tool bar</span>
          <ChevronsRight className="w-4 h-4 mr-3" />
          <div className="border-r border-gray-300 h-6 px-1"></div>
          <button
            onClick={handleEyeToggle}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            {eyeOpen ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{eyeOpen ? "Hide" : "Show"} fields</span>
          </button>
          <button
            onClick={() => handleClick("Sort")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
          <button
            onClick={() => handleClick("Filter")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            <ListFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => handleClick("Cell view")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Cell view</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleClick("Import")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors border"
          >
            <Download className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button
            onClick={() => handleClick("Export")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors border"
          >
            <Upload className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => handleClick("Share")}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors border"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => handleClick("New Action")}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#4B6A4F] text-white hover:bg-green-700 rounded transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;