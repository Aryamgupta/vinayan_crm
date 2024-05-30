import React, { useEffect, useState } from "react";
import AddOrderModal from "./AddOrderModal";
import { AppState } from "../../components/Context/context";
import ViewOrderModal from "./ViewOrderModal";
import "./orders.css";
import axios from "axios";

const Orders = () => {
  const { orders, setOrders, fetchOrders,formatDate } = AppState();
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
            <div className="p-4  rounded-md relative">
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 rounded-tr-md rounded-bl-md text-xs font-semibold">
                {order.status}
              </div>

              <img
                src={`http://localhost:5000${order.productDetails.productImage}`}
                style={{ display: "block", margin: "0 auto" }}
              />

              <div className="text-md text-left " style={{padding:"10px 0px 0px"}}>
                <div className=" ">
                  <span className="font-bold text-orange-500 mr-2 " >
                    Order Id:
                  </span>
                  <span className="text-sm" style={{color:"gray",fontWeight:"400"}}>
                    {order._id}
                  </span>
                </div>
                <div className="">
                  <span className="font-bold text-orange-500 text-center mr-2">
                    Customer Name:
                  </span>
                  <span className="text-sm" style={{color:"gray",fontWeight:"400"}}>
                    {order.customerName}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-orange-500 mr-2">
                    Product Name:
                  </span>
                  <span className="text-sm" style={{color:"gray",fontWeight:"400"}}>
                    {order.productDetails.productName}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-orange-500 mr-2 ">
                    Order Quantity:
                  </span>
                  <span className="text-sm" style={{color:"gray",fontWeight:"400"}}>
                    {order.productQuantity}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-orange-500 mr-2 ">
                    Order Start Date:
                  </span>
                  <span className="text-sm" style={{color:"gray",fontWeight:"400"}}>
                    {formatDate(order.orderStartDate)}
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
