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
            <div className="p-4 border border-gray-200 rounded-md relative">
              
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 rounded-tr-md rounded-bl-md text-xs font-semibold">
                {order.status}
              </div>

              
              <div className="text-md gap-4 font-semibold">
                <div>
                  <span className="font-bold text-orange-500">
                    Customer Name:{" "}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {" "}{order.customerName}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-orange-500">
                    Product Name:
                  </span>
                  <span className="text-gray-500 text-sm">
                    {order.productDetails.productName}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-orange-500">
                    Order Quantity:
                  </span>
                  <span className="text-gray-500 text-sm">
                    {order.productQuantity}
                  </span>
                </div>
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
