import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import axios from "axios";

const API_URL = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${process.env.REACT_APP_API_KEY}`;

const App: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [filteredRows, setFilteredRows] = useState<GridRowsProp>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [revenueRange, setRevenueRange] = useState({ min: "", max: "" });
  const [netIncomeRange, setNetIncomeRange] = useState({ min: "", max: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data.map((item: any, index: number) => ({
          id: index,
          date: item.date,
          revenue: item.revenue,
          netIncome: item.netIncome,
          grossProfit: item.grossProfit,
          eps: item.eps,
          operatingIncome: item.operatingIncome,
        }));
        setRows(data);
        setFilteredRows(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = rows;

    if (dateRange.start) {
      filtered = filtered.filter(
        (item) => new Date(item.date) >= new Date(dateRange.start)
      );
    }

    if (dateRange.end) {
      filtered = filtered.filter(
        (item) => new Date(item.date) <= new Date(dateRange.end)
      );
    }

    if (revenueRange.min || revenueRange.max) {
      filtered = filtered.filter(
        (item) =>
          item.revenue >= (revenueRange.min || 0) &&
          item.revenue <= (revenueRange.max || Infinity)
      );
    }

    if (netIncomeRange.min || netIncomeRange.max) {
      filtered = filtered.filter(
        (item) =>
          item.netIncome >= (netIncomeRange.min || 0) &&
          item.netIncome <= (netIncomeRange.max || Infinity)
      );
    }

    setFilteredRows(filtered);
  };

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "revenue", headerName: "Revenue", width: 200, type: "number" },
    {
      field: "netIncome",
      headerName: "Net Income",
      width: 200,
      type: "number",
    },
    {
      field: "grossProfit",
      headerName: "Gross Profit",
      width: 200,
      type: "number",
    },
    { field: "eps", headerName: "EPS", width: 150, type: "number" },
    {
      field: "operatingIncome",
      headerName: "Operating Income",
      width: 250,
      type: "number",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Financial Data Filtering App
      </h1>

      {/* Filter */}
      <div className="space-y-6 mb-6">
        {/* Date Range */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Date Range:
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Revenue Range */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Revenue:
          </label>
          <input
            type="number"
            placeholder="Min Revenue"
            value={revenueRange.min}
            onChange={(e) =>
              setRevenueRange({ ...revenueRange, min: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            type="number"
            placeholder="Max Revenue"
            value={revenueRange.max}
            onChange={(e) =>
              setRevenueRange({ ...revenueRange, max: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Net Income Range */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Net Income:
          </label>
          <input
            type="number"
            placeholder="Min Net Income"
            value={netIncomeRange.min}
            onChange={(e) =>
              setNetIncomeRange({ ...netIncomeRange, min: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            type="number"
            placeholder="Max Net Income"
            value={netIncomeRange.max}
            onChange={(e) =>
              setNetIncomeRange({ ...netIncomeRange, max: e.target.value })
            }
            className="block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          onClick={handleFilter}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto">
        <div style={{ height: 500, minWidth: 900 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </div>
  );
};

export default App;
