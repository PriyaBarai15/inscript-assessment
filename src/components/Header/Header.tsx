import React, { useRef } from "react";
import {
  Search,
  Bell,
  User,
  ChevronRight,
  PanelRight,
} from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside

  const handleBreadcrumbClick = (item: string) => {
    console.log(`Breadcrumb clicked: ${item}`);
  };


  const breadcrumbs = [
    {
      name: "Workspace",
    },
    {
      name: "Folder 2",
    },
    {
      name: "Spreadsheet 3",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-1">
      <div className="flex items-center justify-between">
        {/* Enhanced Breadcrumb Navigation */}
        <div ref={breadcrumbRef} className="flex items-center space-x-1">
          <PanelRight className="h-4 w-4 mr-5 text-[#618666]" />
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.name} className="flex items-center">
              {/* Breadcrumb Item */}
              <div className="relative">
                <div className="flex items-center">
                  <button
                    onClick={() => handleBreadcrumbClick(breadcrumb.name)}
                    className="flex items-center px-1 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <span
                      className={`${
                        index === breadcrumbs.length - 1
                          ? "font-semibold text-gray-900"
                          : "font-medium text-gray-600 group-hover:text-gray-800"
                      }`}
                    >
                      {breadcrumb.name}
                    </span>
                  </button>
                </div>
              </div>

              {/* Separator */}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search within sheet"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">John Doe</div>
              <div className="text-gray-500 text-xs">john.doe@...</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
