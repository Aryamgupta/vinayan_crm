import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppState } from "../../components/Context/context";

const AddOrderModal = ({ isOpen, onSave, onCancel }) => {
  const { fetchAllProducts,products,setOrders,orders } = AppState();
  const [customerName, setCustomerName] = useState("");
  const [newpdtQuantity, setNewpdtQuantity] = useState("");
  const [newProduct, setNewProduct] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(()=>{
    console.log(products);
  },[products])

  const handleSave = async() => {
    if (!customerName || !newpdtQuantity || !newProduct ) {
      alert("Please fill in all fields.");
      return;
    }

    const newData = {
        customerName,
        productDetails: newProduct,
        productQuantity: newpdtQuantity,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // API call to save data
    axios
      .post("http://localhost:5000/api/order/addOrder", newData, config)
      .then((response) => {
        setOrders([...orders,response.data]);
        onCancel();
        setCustomerName("");
        setNewpdtQuantity("");
        setNewProduct("");
      
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleCancel = () => {
    onCancel();
    // Reset state if cancel is clicked

    setCustomerName("");
    setNewpdtQuantity("");
    setNewProduct("");
  
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center" style={{zIndex:"10"}}>
      <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#fa983d] ">
        <h2 className="text-md font-bold text-black pb-2">Add New Order</h2>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1">
              Customer Name:
            </label>
            <input
              type="text"
              id="pdtName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="pdtCost" className="block mb-1">
              Select Product:
            </label>
            <select
              type="text"
              id="pdtCost"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            >
              <option value="Select Product">Select Product</option>
              {products.map(pdt=>{
                return <option value={pdt._id}>{pdt.productName}</option>
              })}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          
          <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="productQuantity" className="block mb-1">
              Product Quantity:
            </label>
            <input
              type="text"
              id="productQuantity"
              value={newpdtQuantity}
              onChange={(e) => setNewpdtQuantity(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-2"></div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-400 text-white rounded-md mr-2"
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

export default AddOrderModal;
