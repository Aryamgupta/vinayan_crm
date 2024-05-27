import React, { useEffect, useState } from "react";
import AddOrderModal from "./AddOrderModal";
import { AppState } from "../../components/Context/context";
import ViewOrderModal from "./ViewOrderModal";
import "./orders.css";
import axios from "axios";

const Orders = () => {
  const { orders, setOrders, fetchOrders } = AppState();
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCloseAddModel = () => {
    setIsAddModelOpen(false);
  };

  useEffect(() => {
    fetchOrders();
    console.log(orders);
  }, []);

  const handleAddData = (order) => {
    // Update tableData with the new data
    setOrders([...orders, order]);

    console.log(orders);

    // Close the modal
    setIsAddModelOpen(false);
  };

  const fetchOrderData = function (id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // API call to save data
    axios
      .get(`http://localhost:5000/api/order/${id}`, config)
      .then((response) => {
        setSelectedOrder(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsAddModelOpen(true);
        }} // Corrected function name
        style={{
          backgroundColor: "#fa983d",
          padding: "4px 16px",
          color: "#ffffff",
          borderRadius: "0.375rem",
        }}
      >
        Add Order
      </button>
      <AddOrderModal
        isOpen={isAddModelOpen}
        onSave={handleAddData}
        onCancel={handleCloseAddModel}
      />
      <div className="grid grid-cols-3 gap-4 p-2">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border-t-2 border-[#fa983d] rounded-lg shadow-lg bg-white cursor-pointer"
            onClick={() => fetchOrderData(order._id)}
          >
            <div className="p-4">
              <div className="text-md gap-4 font-semibold">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Customer Name:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {order.customerName}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Product Name:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {order.productDetails.productName}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Order Quantity:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {order.productQuantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <ViewOrderModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
