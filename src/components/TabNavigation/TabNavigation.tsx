import React from 'react';
import { Plus } from 'lucide-react';
import { tabs } from '../../data/mockData';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex items-center px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-t-[3px] transition-colors ${
              activeTab === tab.id
                ? "border-[#4B6A4F] text-[#4B6A4F] bg-[#E8F0E9]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
        <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;