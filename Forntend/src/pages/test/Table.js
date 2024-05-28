import React, { useState, useEffect } from "react";
import EditModel from "../../pages/records/EditModel";
import AddModel from "../../pages/records/AddModel";
import InModel from "../records/InModel";
import { mockTableData } from "../../utils/data";
import Card from "../../components/card/Card";
import { AppState } from "../../components/Context/context";
import axios from "axios";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

const DataTable = () => {
  const router = useNavigate();
  if (!localStorage.getItem("token")) {
    router("/");
  }
  const { tableData, setTableData, fetchCompleteTable } = AppState();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortAscending, setSortAscending] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [addedRow, setAddedRow] = useState({
    _id: "",
    pdtName: "",
    pdtQuantity: "",
    pdtCost: "",
    vendorName: "",
    ProductBill: "",
  });

  useEffect(() => {
    fetchCompleteTable();
  }, []);

  const handleEdit = (rowData) => {
    setEditedRow(rowData);
    setIsEditing(true);
  };

  //   const handleSave = () => {
  //     // Update tableData with editedRow
  //     setIsEditing(false);
  //   };

  const handleSave = async (updatedRow) => {
    // Update tableData with editedRow
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
      };
      const body = {
        pdtName: updatedRow.pdtName,
        pdtQuantity: Number(updatedRow.pdtQuantity),
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/material/materialOut",
        body,
        config
      );
      updatedRow = data;
      const updatedTableData = tableData.map((row) => {
        if (row._id === updatedRow._id) {
          return updatedRow;
        }
        return row;
      });
      setTableData(updatedTableData);
      setIsEditing(false);
    } catch {
      toast.error("Failed to Upadate Data");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddSave = () => {
    // Add the addedRow to tableData
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setAddedRow({
      _id: "",
      pdtName: "",
      pdtQuantity: "",
      pdtCost: "",
      vendorName: "",
      ProductBill: "",
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleSort = (search_id) => {
    if (sortBy === search_id) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(true);
      setSortBy(search_id);
    }
  };

  //   const filteredData = tableData.filter((item) => {
  //     const itemName = (item._id || "").toLowerCase();
  //     return itemName.includes(searchQuery.toLowerCase());
  //   });

  //add data//
  const openAddModel = () => {
    setIsAddModelOpen(true);
  };

  const closeAddModel = () => {
    setIsAddModelOpen(false);
  };

  const handleAddData = (data) => {
    // Logic to handle adding data
  };
  const filteredData = tableData.filter((item) => {
    const itemName = (item._id || "").toLowerCase();
    const pdtName = (item.pdtName || "").toLowerCase();
    const pdtQuantity = item.pdtQuantity || "";
    const pdtCost = item.pdtCost || "";
    const vendorName = (item.vendorName || "").toLowerCase();
    const productBill = (item.ProductBill || "").toLowerCase();
    // Add more fields if needed

    // Check if any of the fields match the search query
    return (
      itemName.includes(searchQuery.toLowerCase()) ||
      pdtName.includes(searchQuery.toLowerCase()) ||
      vendorName.includes(searchQuery.toLowerCase()) ||
      productBill.includes(searchQuery.toLowerCase())
      // Add more fields if needed
    );
  });

  const sortedTableData = [...filteredData].sort((a, b) => {
    const valueA =
      typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
    const valueB =
      typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
    if (valueA < valueB) {
      return sortAscending ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortAscending ? 1 : -1;
    }
    return 0;
  });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const visibleTableData = sortedTableData.slice(startIndex, endIndex);

  const convertToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      tableData.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDownload = () => {
    convertToCSV();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4 mt-4 ">
        <span className="bg-black text-white rounded-md font-bold shadow-md px-4 py-3  inline-block">
          Material Out
        </span>

        <div className="flex justify-end gap-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border-stroke shadow-md rounded-md mr-2"
          />

          <button
            onClick={openAddModel}
            style={{
              backgroundColor: "#fa983d",
              padding: "4px 16px",
              color: "#ffffff",
              borderRadius: "0.375rem",
            }}
          >
            Add Item
          </button>

          {/* AddModel component */}
          <AddModel
            rowData={addedRow}
            isOpen={isAddModelOpen}
            onSave={handleAddData}
            onCancel={closeAddModel}
          />

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-700 text-white rounded-md"
          >
            Download
          </button>
        </div>
      </div>
      <div class="card-container flex flex-col gap-4 md:flex-row md:justify-between">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <div className="overflow-x-auto text-center mt-6">
        <table className="table-auto min-w-full border bg-white">
          <thead className="tableHead">
            <tr className="bg-gray-400">
              <th
                onClick={() => handleSort("_id")}
                className="px-4 py-2 cursor-pointer "
              >
                Item ID
              </th>
              <th
                onClick={() => handleSort("pdtName")}
                className="px-4 py-2 cursor-pointer"
              >
                pdtName
              </th>
              <th
                onClick={() => handleSort("Product Quantity")}
                className="px-4 py-2 cursor-pointer"
              >
                {" "}
                Product Quantity
              </th>
              <th
                onClick={() => handleSort("pdtCost")}
                className="px-4 py-2 cursor-pointer"
              >
                pdtCost
              </th>
              <th
                onClick={() => handleSort("vendorName")}
                className="px-4 py-2 cursor-pointer"
              >
                Product vender Name
              </th>

              <th
                onClick={() => handleSort("jobTitle")}
                className="px-4 py-2 cursor-pointer"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTableData.map((rowData, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{rowData?._id}</td>
                <td className="border px-4 py-2">{rowData?.pdtName}</td>
                <td className="border px-4 py-2">{rowData?.pdtQuantity}</td>
                <td className="border px-4 py-2">{rowData?.pdtCost}</td>
                <td className="border px-4 py-2">{rowData.vendorName}</td>

                <td className="border px-4 py-2">
                  <div className="flex">
                    {/* <button
                      onClick={handleAdd}
                      className="px-3 py-1 bg-red-500 text-white border-stroke shadow-lg rounded-md mr-2"
                    >
                      Out
                    </button>
                    <InModel
                      isOpen={isAdding}
                      rowData={addedRow}
                      onSave={handleAddSave}
                      onCancel={handleAddCancel}
                    /> */}
                    <button
                      onClick={() => handleEdit(rowData)}
                      className="px-3 py-1 bg-red-500 text-white border-stroke shadow-lg rounded-md mr-2"
                    >
                      Out
                    </button>
                    <EditModel
                      isOpen={isEditing}
                      rowData={editedRow}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center ">
          <label className="mr-2">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="p-2"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 ml-2 ${
                page === index + 1
                  ? "bg-black rounded-md text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-md text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, tableData.length)} of{" "}
        {tableData.length} entries
      </div>
    </div>
  );
};

export default DataTable;
