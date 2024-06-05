import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const random = "random";
  const [tableData, setTableData] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [materials, setMaterials] = useState([]);

  // useEffect(() => {
  //   tableData.forEach((item) => {
  //     let newObj = {
  //       _id: item._id,
  //       materialName: item.pdtName,
  //       materialQuantity: 0,
  //     };
  //     setMaterials([...materials, newObj]);
  //   });
  //   console.log(tableData);
  // }, [tableData]);

  const fetchAllProducts = async function () {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
      };

      // console.log(config);
      const { data } = await axios.get(
        `http://localhost:5000/api/finalProduct/getAllProducts`,
        config
      );
      setProducts(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async function () {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: `${localStorage.getItem("token")}`,
        },
      };

      // console.log(config);
      const { data } = await axios.get(
        `http://localhost:5000/api/order`,
        config
      );
      setOrders(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompleteTable = async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // console.log(config);
    const { data } = await axios.get(
      "http://localhost:5000/api/material",
      config
    );
    setTableData(data);
    let mData = [];
    data.forEach((item) => {
      let newObj = {
        _id: item._id,
        materialName: item.pdtName,
        materialQuantity: 0,
      };
      mData.push(newObj);
    });
    setMaterials(mData);
    // console.log(materials);
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Define an array of month names
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the day, month, and year
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Function to get the ordinal suffix for the day
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // covers 4th to 20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Construct the formatted date string
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  }

  function formatToRupees(amount) {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }


  return (
    <AppContext.Provider
      value={{
        fetchCompleteTable,
        tableData,
        setTableData,
        fetchAllProducts,
        products,
        setProducts,
        fetchOrders,
        orders,
        setOrders,
        materials,
        formatDate,
        setMaterials,
        formatToRupees
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppState = () => {
  return useContext(AppContext);
};

export default AppProvider;
