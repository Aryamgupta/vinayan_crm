import React, { useState } from "react";
import axios from "axios";
import { AppState } from "../../components/Context/context";

const AddModel = ({ isOpen, onSave, onCancel }) => {
  const [newpdtName, setNewpdtName] = useState("");
  const [newpdtQuantity, setNewpdtQuantity] = useState("");
  const [newpdtCost, setNewpdtCost] = useState("");
  const [newvendorName, setNewvendorName] = useState("");

  const handleSave = () => {
    if (!newpdtName || !newpdtQuantity || !newpdtCost || !newvendorName) {
      alert("Please fill in all fields.");
      return;
    }

    const newData = {
      pdtName: newpdtName,
      pdtQuantity: newpdtQuantity,
      vendorName: newvendorName,
      pdtCost: newpdtCost,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // API call to save data
    axios
      .post("http://localhost:5000/api/material/materialIn", newData, config)
      .then((response) => {
        console.log("Data saved successfully:", response.data);
        onSave(response.data); // Call the onSave function passed via props with the new data
        // Reset state after saving
        setNewpdtName("");
        setNewpdtQuantity("");
        setNewpdtCost("");
        setNewvendorName("");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleCancel = () => {
    onCancel();
    // Reset state if cancel is clicked

    setNewpdtName("");
    setNewpdtQuantity("");
    setNewpdtCost("");
    setNewvendorName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#fa983d] ">
        <h2 className="text-md font-bold text-black pb-2">Add New Data</h2>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1">
              Product Name:
            </label>
            <input
              type="text"
              id="pdtName"
              value={newpdtName}
              onChange={(e) => setNewpdtName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtCost" className="block mb-1">
              Product Cost:
            </label>
            <input
              type="text"
              id="pdtCost"
              value={newpdtCost}
              onChange={(e) => setNewpdtCost(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="vendorName" className="block mb-1">
              Product Vender Name:
            </label>
            <input
              type="text"
              id="vendorName"
              value={newvendorName}
              onChange={(e) => setNewvendorName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="itemID" className="block mb-1">
              Product Quantity:
            </label>
            <input
              type="text"
              id="itemID"
              value={newpdtQuantity}
              onChange={(e) => setNewpdtQuantity(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4"></div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 "
          >
            Add
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModel;
