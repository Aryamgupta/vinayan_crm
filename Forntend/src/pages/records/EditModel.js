import React, { useState, useEffect } from "react";
import { AppState } from "../../components/Context/context";

const EditModel = ({ isOpen, rowData, onSave, onCancel }) => {

  // State variables to hold edited values
  const [edited_id, setEdited_id] = useState("");
  const [editedpdtName, setEditedpdtName] = useState("");
  const [editedpdtQuantity, setEditedpdtQuantity] = useState("");
  const [editedpdtCost, setEditedpdtCost] = useState("");

  const [editedvendorName, setEditedvendorName] = useState("");
  const [editedmodifyDate, setEditedmodifyDate] = useState("");
  // Update useEffect to set edited state variables with rowData
  useEffect(() => {
    if (rowData) {
      setEdited_id(rowData._id || "");
      setEditedpdtName(rowData.pdtName || "");
      setEditedpdtQuantity("");
      setEditedpdtCost(rowData.pdtCost || "");
      setEditedvendorName(rowData.vendorName || "");
      setEditedmodifyDate(rowData.modifyDate || "");
    }
  }, [rowData]);

  if (!isOpen || !rowData) return null;

  const handleSave = () => {
    
    // onSave({
    //   ...rowData, // Maintain other fields
    //   _id: edited_id,
    //   pdtName: editedpdtName,
    //   pdtQuantity: editedpdtQuantity,
    //   vendorName: editedvendorName,
    //   pdtCost: editedpdtCost,
    //   modifyDate: editedmodifyDate,
    // });

    onSave({
      ...rowData, // Maintain other fields
      _id: edited_id,
      pdtName: editedpdtName,
      pdtQuantity: editedpdtQuantity,
      vendorName: editedvendorName,
      pdtCost: editedpdtCost,
      modifyDate: editedmodifyDate,
    });
  };

  const handleCancel = () => {
    // Reset state if cancel is clicked
    onCancel();
    setEdited_id("");
    setEditedpdtName("");
    setEditedpdtQuantity("");
    setEditedpdtCost("");
    setEditedvendorName("");
    setEditedmodifyDate("");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#fa983d]">
      <h1 class="text-md font-bold text-black pb-2 flex justify-start text-lg">Edit Data</h1>
        <div className="flex flex-wrap -mx-2 mb-4">
          {" "}
          {/* Wrapper for flex layout */}
          {/* Label and input field for _id */}
          <div className="w-full md:w-1/2 px-2 mb-2 ">
            <label htmlFor="_id" className="block mb-1">
              _id:
            </label>
            <input
              type="text"
              id="_id"
              value={edited_id}
              onChange={(e) => setEdited_id(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>
          {/* Label and input field for pdtCost */}
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtCost" className="block mb-1">
              Product Cost:
            </label>
            <input
              type="text"
              id="pdtCost"
              value={editedpdtCost}
              onChange={(e) => setEditedpdtCost(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          {" "}
          {/* Wrapper for flex layout */}
          {/* Label and input field for Product Bill */}
         {/* { <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="ProductBill" className="block mb-1">
              {" "}
              Product Bill:
            </label>
            <input
              type="text"
              id="ProductBill"
              value={editedProductBill}
              onChange={(e) => setEditedProductBill(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>} */}
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="modifyDate" className="block mb-1">
              Modify Date:
            </label>
            <input
              type="text"
              id="modifyDate"
              value={editedmodifyDate}
              onChange={(e) => setEditedmodifyDate(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>
          {/* Label and input field for Product Name */}
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1">
              Product Name:
            </label>
            <input
              type="text"
              id="pdtName"
              value={editedpdtName}
              onChange={(e) => setEditedpdtName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          {" "}
          {/* Wrapper for flex layout */}
          {/* Label and input field for Product Quantity */}
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtQuantity" className="block mb-1">
              Product Quantity:
            </label>
            <input
              type="text"
              id="pdtQuantity"
              value={editedpdtQuantity}
              onChange={(e) => setEditedpdtQuantity(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
          {/* Label and input field for Product Vender Name */}
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="vendorName" className="block mb-1">
              Product Vender Name:
            </label>
            <input
              type="text"
              id="vendorName"
              value={editedvendorName}
              onChange={(e) => setEditedvendorName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
              disabled
            />
          </div>
          
        </div>

        {/* Save and cancel buttons */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-500"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModel;
