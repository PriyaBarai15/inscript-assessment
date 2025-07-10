import { useState, useEffect, useMemo } from 'react';
import { JobRequest } from '../types';
import { mockJobRequests } from '../data/mockData';

export const useSpreadsheetData = () => {
  const [data, setData] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockJobRequests);
        setError(null);
      } catch (e) {
        setError('Failed to fetch data');
        console.error(e);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search and tab
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => {
        switch (activeTab) {
          case 'pending':
            return item.status === 'Need to start' || item.status === 'In-process';
          case 'reviewed':
            return item.status === 'Complete';
          case 'arrived':
            return item.status === 'Blocked';
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, activeTab]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredData.length
        ? []
        : filteredData.map(item => item.id)
    );
  };

  const handleDataUpdate = (id: number, field: keyof JobRequest, value: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
    console.log(`Updated ${field} for ID ${id} to: ${value}`);
  };

  return {
    data: filteredData,
    loading,
    error,
    searchTerm,
    activeTab,
    selectedRows,
    handleSearch,
    handleTabChange,
    handleRowSelect,
    handleSelectAll,
    handleDataUpdate
  };
};