import React, { useState, useEffect } from "react";
import EditModel from "../../pages/records/EditModel";
import AddModel from "../../pages/records/AddModel";
// import InModel from "../records/InModel";
import { mockTableData } from "../../utils/data";
import { useNavigate } from "react-router";

const DataTable = () => {
  const router = useNavigate();
  if(!localStorage.getItem("token")){
    router("/")
  }
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortAscending, setSortAscending] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [addedRow, setAddedRow] = useState({
    ItemID: "",
    ProductName: "",
    ProductQuantity: "",
    ProductCost: "",
    ProductVenderName: "",
    ProductBill: "",
    ModifyDate: "",
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

  //   const handleSave = () => {
  //     // Update tableData with editedRow
  //     setIsEditing(false);
  //   };

  const handleSave = (updatedRow) => {
    // Update tableData with editedRow
    const updatedTableData = tableData.map((row) => {
      if (row.ItemID === updatedRow.ItemID) {
        return updatedRow;
      }
      return row;
    });
    setTableData(updatedTableData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // const handleAdd = () => {
  //   setIsAdding(true);
  // };

  const handleAddSave = () => {
    // Add the addedRow to tableData
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setAddedRow({
      ItemID: "",
      ProductName: "",
      ProductQuantity: "",
      ProductCost: "",
      ProductVenderName: "",
      ProductBill: "",
      ModifyDate: "",
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleSort = (searchItemID) => {
    if (sortBy === searchItemID) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(true);
      setSortBy(searchItemID);
    }
  };

  //   const filteredData = tableData.filter((item) => {
  //     const itemName = (item.ItemID || "").toLowerCase();
  //     return itemName.includes(searchQuery.toLowerCase());
  //   });

  //add data//
  const openAddModel = () => {
    setIsAddModelOpen(true);
  };

  const closeAddModel = () => {
    setIsAddModelOpen(false);
  };

  // const handleAddData = (data) => {
  //   // Logic to handle adding data
  // };
  const filteredData = tableData.filter((item) => {
    const itemName = (item.ItemID || "").toLowerCase();
    const productName = (item.ProductName || "").toLowerCase();
    const productQuantity = (item.ProductQuantity || "").toLowerCase();
    const productCost = (item.ProductCost || "").toLowerCase();
    const productVenderName = (item.ProductVenderName || "").toLowerCase();
    const productBill = (item.ProductBill || "").toLowerCase();
    const modifyDate = (item.ModifyDate || "").toLowerCase();
    // Add more fields if needed

    // Check if any of the fields match the search query
    return (
      itemName.includes(searchQuery.toLowerCase()) ||
      productName.includes(searchQuery.toLowerCase()) ||
      productQuantity.includes(searchQuery.toLowerCase()) ||
      productCost.includes(searchQuery.toLowerCase()) ||
      productVenderName.includes(searchQuery.toLowerCase()) ||
      productBill.includes(searchQuery.toLowerCase()) ||
      modifyDate.includes(searchQuery.toLowerCase())

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

  function updateProductBill() {
    var productBillInput = document.getElementById("productBillInput").value;
    var productBillCell = document.getElementById("productBillCell");
    productBillCell.innerHTML = productBillInput;
  }

  const handleOpenAddModel = () => {
    setIsAddModelOpen(true);
  };

  const handleCloseAddModel = () => {
    setIsAddModelOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="bg-black text-white rounded-md font-bold shadow-md px-4 py-3 inline-block">
          Material In
        </span>
      </div>

      <div className=" Button-header flex justify-between mb-4 mt-4">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md mr-2"
        />
        <div className="flex justify-end gap-4 w-full sm:w-1/4 md:w-1/3 flex-sm-col ">
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
            onCancel={handleCloseAddModel}
          />

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-700 text-white rounded-md border-stroke shadow-lg"
          >
            Download
          </button>
        </div>
      </div>
      <div className="overflow-x-auto text-center">
        <table className="table-auto min-w-full border-storke bg-white rounded-lg shadow-2xl mt-2">
          <thead className="tableHead">
            <tr className="bg-gray-400">
              <th
                onClick={() => handleSort("ItemID")}
                className="px-4 py-2 cursor-pointer "
              >
                Item ID
              </th>
              <th
                onClick={() => handleSort("ProductName")}
                className="px-4 py-2 cursor-pointer"
              >
                ProductName
              </th>
              <th
                onClick={() => handleSort("Product Quantity")}
                className="px-4 py-2 cursor-pointer"
              >
                {" "}
                Product Quantity
              </th>
              <th
                onClick={() => handleSort("ProductCost")}
                className="px-4 py-2 cursor-pointer"
              >
                ProductCost
              </th>
              <th
                onClick={() => handleSort("ProductVenderName")}
                className="px-4 py-2 cursor-pointer"
              >
                Product vender Name
              </th>
              <th
                onClick={() => handleSort("ModifyDate")}
                className="px-4 py-2 cursor-pointer"
              >
                ModifyDate
              </th>
              <th
                onClick={() => handleSort("ProductBill")}
                className="px-4 py-2 cursor-pointer"
              >
                Product Bill
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTableData.map((rowData, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{rowData?.ItemID}</td>
                <td className="border px-4 py-2">{rowData?.ProductName}</td>
                <td className="border px-4 py-2">{rowData?.ProductQuantity}</td>
                <td className="border px-4 py-2">{rowData?.ProductCost}</td>
                <td className="border px-4 py-2">
                  {rowData.ProductVenderName}
                </td>
                <td className="border px-4 py-2">{rowData.ModifyDate}</td>
                <td className="border" id="productBillCell">
                  {/* <input type="file" id="productBillInput" name="productBill" /> */}
                  <input
                    type="file"
                    class="custom-file-input  w-2/3 mx-auto"
                  ></input>
                  <button type="button" onClick={updateProductBill}></button>
                </td>

                <td className="border px-4 py-2">
                  <div className="flex">
                    {/* <button
                      onClick={handleAdd}
                      className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                    >
                      In
                    </button>
                    <InModel
                      isOpen={isAdding}
                      rowData={addedRow}
                      onSave={handleAddSave}
                      onCancel={handleAddCancel}
                    /> */}
                    <button
                      onClick={() => handleEdit(rowData)}
                      className="px-4 py-2 bg-[#E7E4E4] text-black shadow-lg rounded-md justify-center mx-auto"
                    >
                      Edit
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
