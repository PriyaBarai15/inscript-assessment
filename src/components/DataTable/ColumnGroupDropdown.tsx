import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { ColumnGroup } from "./AddColumnModal";

interface ColumnGroupDropdownProps {
  currentGroupId: string;
  groups: ColumnGroup[];
  onGroupChange: (groupId: string) => void;
  onCreateGroup: (groupName: string) => void;
  triggerClassName?: string;
}

const ColumnGroupDropdown: React.FC<ColumnGroupDropdownProps> = ({
  currentGroupId,
  groups,
  onGroupChange,
  onCreateGroup,
  triggerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentGroup = groups.find((g) => g.id === currentGroupId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsCreatingGroup(false);
        setNewGroupName("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isCreatingGroup && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingGroup]);

  const handleGroupSelect = (groupId: string) => {
    onGroupChange(groupId);
    setIsOpen(false);
  };

  const handleCreateNewGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      const groupId = newGroupName.trim().toLowerCase().replace(/\s+/g, "-");
      onCreateGroup(newGroupName.trim());
      onGroupChange(groupId);
      setNewGroupName("");
      setIsCreatingGroup(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors ${triggerClassName}`}
        title="Change column group"
      >
        <span className="text-xs text-gray-600">
          {currentGroup ? currentGroup.name : "No Group"}
        </span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
          <div className="py-1">
            {/* Default option */}
            <button
              onClick={() => handleGroupSelect("")}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
            >
              {!currentGroupId && <Check className="w-4 h-4 text-green-600" />}
              <span className={!currentGroupId ? "font-medium" : ""}>
                No Group
              </span>
            </button>

            {/* Existing groups */}
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                {currentGroupId === group.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: group.color }}
                />
                <span
                  className={currentGroupId === group.id ? "font-medium" : ""}
                >
                  {group.name}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-1" />

            {/* Create new group */}
            {!isCreatingGroup ? (
              <button
                onClick={() => setIsCreatingGroup(true)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Group</span>
              </button>
            ) : (
              <form onSubmit={handleCreateNewGroup} className="px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsCreatingGroup(false);
                      setNewGroupName("");
                    }
                  }}
                />
                <div className="flex justify-end space-x-1 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingGroup(false);
                      setNewGroupName("");
                    }}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnGroupDropdown;
