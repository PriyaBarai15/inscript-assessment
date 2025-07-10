import Header from "./components/Header/Header";
import ActionBar from "./components/ActionBar/ActionBar";
import DataTable from "./components/DataTable/DataTable";
import TabNavigation from "./components/TabNavigation/TabNavigation";
import { useSpreadsheetData } from "./hooks/useSpreadsheetData";

function App() {
  const {
    data,
    loading,
    error,
    searchTerm,
    activeTab,
    selectedRows,
    handleSearch,
    handleTabChange,
    handleDataUpdate,
  } = useSpreadsheetData();

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header searchTerm={searchTerm} onSearchChange={handleSearch} />

      <ActionBar />

      <main className="flex-1 py-0 overflow-hidden">
        <DataTable
          data={data}
          loading={loading}
          error={error}
          selectedRows={selectedRows}
          onDataUpdate={handleDataUpdate}
        />
      </main>

      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
