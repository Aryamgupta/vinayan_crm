// src/pages/records/DataTable.js

import React, { useState, useEffect } from "react";
import EditModel from "../../pages/records/EditModel";
import AddModel from "../../pages/records/AddModel";
import FileUploadModal from "../records/FileUploadModel"; // Import the new modal
import { mockTableData } from "../../utils/data";
import Invoice from "../../components/invoice/Invoice";
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
  // const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // State for upload modal
  const [currentUploadRow, setCurrentUploadRow] = useState(null); // State for the row being uploaded
  const [fileUploads, setFileUploads] = useState({}); // State to store file uploads

  useEffect(() => {
    fetchCompleteTable();
  }, []);

  const formatDate = function (isoDateStr) {
    const date = new Date(isoDateStr);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getUTCFullYear();

    // Format the date into the desired string
    const formattedDate = `${day} ${month} ${year}`;

    // console.log(formattedDate);
    return formattedDate;
  };

  const [addedRow, setAddedRow] = useState({
    ProductId: "",
    pdtName: "",
    pdtQuantity: "",
    pdtCost: "",
    vendorName: "",
    modifyDate: "",
  });

  const handleAddData = (data) => {
    // Update tableData with the new data
    setTableData([...tableData, data]);

    // Close the modal
    setIsAddModelOpen(false);
  };

  useEffect(() => {
    setTableData(mockTableData);
  }, []);

  const handleEdit = (rowData) => {
    setEditedRow(rowData);
    setIsEditing(true);
  };

  const handleSave = async (updatedRow) => {
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
        pdtCost: Number(updatedRow.pdtCost),
        vendorName: updatedRow.vendorName,
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/material/materialEdit",
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

  const handleAddSave = () => {
    // Add the addedRow to tableData
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setAddedRow({
      ProductId: "",
      pdtName: "",
      pdtQuantity: "",
      pdtCost: "",
      vendorName: "",
      ProductBill: "",
      modifyDate: "",
      invoice: "",
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleSort = (searchProductId) => {
    if (sortBy === searchProductId) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(true);
      setSortBy(searchProductId);
    }
  };

  const filteredData = tableData.filter((item) => {
    const ProductId = (item.ProductId || "").toLowerCase();
    const pdtName = (item.pdtName || "").toLowerCase();
    const pdtQuantity = item.pdtQuantity || "";
    const pdtCost = item.pdtCost || "";
    const vendorName = (item.vendorName || "").toLowerCase();
    const productBill = (item.ProductBill || "").toLowerCase();
    const modifyDate = (item.modifyDate || "").toLowerCase();
    const invoice = (item.Invoice || "").toLowerCase();

    return (
      ProductId.includes(searchQuery.toLowerCase()) ||
      pdtName.includes(searchQuery.toLowerCase()) ||
      vendorName.includes(searchQuery.toLowerCase()) ||
      productBill.includes(searchQuery.toLowerCase()) ||
      modifyDate.includes(searchQuery.toLowerCase()) 
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

  const handleOpenAddModel = () => {
    setIsAddModelOpen(true);
  };

  const handleCloseAddModel = () => {
    setIsAddModelOpen(false);
  };

  const handleOpenUploadModal = (rowData) => {
    setCurrentUploadRow(rowData);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentUploadRow(null);
  };

  const handleUploadFiles = (files) => {
    setFileUploads({
      ...fileUploads,
      [currentUploadRow.ProductId]: files,
    });
  };

  return (
    <div className="container mx-auto p-2">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <span className="bg-black text-white rounded-md font-bold shadow-md px-4 py-3 inline-block">
             MaterialIn
        </span> */}
      </div>
      <div className="Button-header flex justify-between mb-2 mt-2">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md w-1/11 h-10 text-center border-stroke mt-4 "
        />
        {/* <Invoice /> */}
        <div className="flex justify-end gap-4 w-full sm:w-1/4 md:w-1/3 flex-sm-col border-stroke">
          <button
            onClick={handleOpenAddModel} // Corrected function name
            style={{
              backgroundColor: "#fa983d",
              padding: "2px 12px",
              color: "#ffffff",
              borderRadius: "0.375rem",
            }}
          >
            Add Item
          </button>

          <AddModel
            rowData={addedRow}
            isOpen={isAddModelOpen}
            onSave={handleAddData}
            onCancel={handleCloseAddModel}
          />

          <button
            onClick={handleDownload}
            className="bg-black text-white rounded-md font-bold shadow-md px-4 py-2 inline-block hover:bg-black hover:text-white"
          >
            Download
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border bg-white ">
          <thead className="bg-black text-white ">
            <tr className="bg-gray-200 text-left ">
              <th
                onClick={() => handleSort("ProductId")}
                className="px-4 py-2 cursor-pointer text-center"
              >
                Product Id
              </th>
              <th
                onClick={() => handleSort("pdtName")}
                className="px-4 py-2 cursor-pointer"
              >
                Product Name
              </th>
              <th
                onClick={() => handleSort("pdtQuantity")}
                className="px-4 py-2 cursor-pointer"
              >
                Product Quantity
              </th>
              <th
                onClick={() => handleSort("pdtCost")}
                className="px-4 py-2 cursor-pointer"
              >
                Product Cost
              </th>
              <th
                onClick={() => handleSort("vendorName")}
                className="px-4 py-2 cursor-pointer"
              >
                Product Vender Name
              </th>
              <th
                onClick={() => handleSort("modifyDate")}
                className="px-4 py-2 cursor-pointer"
              >
                Modify Date
              </th>
              {/* <th
                onClick={() => handleSort("Invoice")}
                className="px-4 py-2 cursor-pointer  "
              >
                Invoice
              </th> */}
             
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTableData.map((rowData, index) => (
              <tr key={rowData._id}>
                <td className="border px-4 py-2 text-center">{rowData._id}</td>
                <td className="border px-4 py-2 text-center">{rowData?.pdtName}</td>
                <td className="border px-4 py-2 text-center">{rowData?.pdtQuantity}</td>
                <td className="border px-4 py-2 text-center">{rowData?.pdtCost}</td>
                <td className="border px-4 py-2 text-center">{rowData.vendorName}</td>
                <td className="border px-4 py-2 text-center">
                  {formatDate(rowData.modifyDate)}
                </td>
                {/* <td className="border px-4 py-2 ">{rowData.Invoice}</td> */}
                {/* <td className="border px-4 py-2">
                  {fileUploads[rowData.ProductId]?.map((file, idx) => (
                    <div key={idx}>
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {file.name}
                      </a>
                    </div>
                  )) || (
                    <button
                      onClick={() => handleOpenUploadModal(rowData)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Uploadfile
                    </button>
                  )}
                </td> */}
                <td className="border px-4 py-2">
                  <div className="flex">
                    <button
                      onClick={() => handleEdit(rowData)}
                      className="px-4 py-2 bg-gray text-black shadow-lg rounded-md mx-auto hover:bg-gray"
                    >
                      Add
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
        <div className="flex items-center">
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

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleUploadFiles}
      />
    </div>
  );
};

export default DataTable;
