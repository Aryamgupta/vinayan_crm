import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppState } from "../../components/Context/context";

const ViewOrderModal = ({ selectedOrder, setSelectedOrder }) => {
  console.log(selectedOrder);
  const {
    materials,
    setMaterials,
    fetchCompleteTable,
    formatDate,
    formatToRupees,
    orders,
    setOrders,
  } = AppState();
  const [visibleTable, setVisibleTable] = useState("");
  const [value, setValue] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [extraMaterialEdit, setExtraMaterialEdit] = useState(true);
  const [listedMaterials, setListedMaterials] = useState(
    selectedOrder.extraMaterialNeeded
  );
  const [extraCost, setExtraCost] = useState(selectedOrder.otherCost);
  const [allotStatus, setAllotStatus] = useState(
    "No Materials Alloted , please check inventory and then allot materials"
  );
  const [editExtraCost, setEditExtraCost] = useState(false);

  const handleEditMaterial = async function () {
    if (extraMaterialEdit) {
      await handleSaveExtraMaterialList();
    }
    setExtraMaterialEdit(!extraMaterialEdit);
  };


  const printIframe = (id) => {
    const iframe = document.frames ? document.frames[id] : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
  
    let totalCostA = populateMaterials(iframe, 'materials-used-body', selectedOrder.productDetails.productMaterialList,selectedOrder.productQuantity);
    let totalCostB = populateMaterials(iframe, 'extra-materials-used-body', selectedOrder.extraMaterialNeeded);

    doc.getElementById('totalCostA').textContent = formatToRupees(totalCostA);
    doc.getElementById('totalCostB').textContent = formatToRupees(totalCostB);
    iframe.focus();
    iframeWindow.print();

    let tableBodyA = iframe.contentWindow.document.getElementById("materials-used-body");
    let tableBodyB = iframe.contentWindow.document.getElementById("extra-materials-used-body");

    // Clear the table body
    tableBodyA.innerHTML = "";
    tableBodyB.innerHTML = "";
    return false;
  };


  function populateMaterials(iframe, tableId, materials,qty) {
    let tableBody = iframe.contentWindow.document.getElementById(tableId);
    let qtyy = qty ? qty :1;
    let totalCost = 0;
    console.log(tableBody);
    tableBody.innerHtml = "";
    materials.forEach(material => {
      let row = document.createElement('tr');
  
      let idCell = document.createElement('td');
      idCell.textContent = material.materialKey._id;
      row.appendChild(idCell);
  
      let nameCell = document.createElement('td');
      nameCell.textContent = material.materialKey.pdtName;
      row.appendChild(nameCell);
  
      let costCell = document.createElement('td');
      costCell.textContent = formatToRupees(material.materialKey.pdtCost);
      row.appendChild(costCell);
  
      let quantityCell = document.createElement('td');
      quantityCell.textContent = material.quantity * qtyy; 
      row.appendChild(quantityCell);
  
      let totalCostCell = document.createElement('td');
      let materialCost = material.materialKey.pdtCost * material.quantity * qtyy;
      totalCostCell.textContent = formatToRupees(materialCost);
      row.appendChild(totalCostCell);

      totalCost += materialCost;
      tableBody.appendChild(row);
    });
  
    return totalCost;
  }


  

  useEffect(() => {
    fetchCompleteTable();
    if (selectedOrder.extraMaterialNeeded.length != 0) {
      setExtraMaterialEdit(false);
    }
    handleButtonClick("extraMaterials");
  }, []);

  useEffect(() => {
    function updateMaterialQuantity(materials, updates) {
      // Create a map from updates array for quick lookup
      const updatesMap = new Map();
      let newArr = {};
      updates.forEach((update) => {
        newArr[update.materialKey._id] = true;
        updatesMap.set(update.materialKey._id, update.quantity);
      });

      // Update the materials array based on the map
      materials.forEach((material) => {
        if (updatesMap.has(material._id)) {
          material.materialQuantity = updatesMap.get(material._id);
        } else {
          material.materialQuantity = 0;
        }
      });
      setSelectedMaterials(newArr);
      setMaterials(materials);
    }

    updateMaterialQuantity(materials, selectedOrder.extraMaterialNeeded);
    setMaterials(materials);
  }, [extraMaterialEdit]);

  const handleButtonClick = (table) => {
    setVisibleTable(table);
  };

  const handleAddButtonClick = () => {
    // Logic for handling the click event when "Add Product" button is clicked
  };

  const handleAddClick = () => {
    setCurrentNumber(currentNumber + 1);
    setValue(currentNumber + 1);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleClose = () => {
    setVisibleTable(false);
  };

  const addOtherCost = async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .put(
        `http://localhost:5000/api/order/calculateOrderCost/${selectedOrder._id}`,
        {
          otherCost: Number(extraCost),
        },
        config
      )
      .then((response) => {
        setSelectedOrder(response.data);
        setExtraCost(response.data.otherCost);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const checkInventaryStatus = function () {
    if (selectedOrder.materialAlloted) {
      handleButtonClick("checkDetails");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .put(
        `http://localhost:5000/api/order/checkInventaryStatus/${selectedOrder._id}`,
        {},
        config
      )
      .then((response) => {
        setSelectedOrder(response.data);
        handleButtonClick("checkDetails");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const allotMaterials = function () {
    if (selectedOrder.materialAlloted) {
      handleButtonClick("allotMaterials");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .put(
        `http://localhost:5000/api/order/allotMaterial/${selectedOrder._id}`,
        {},
        config
      )
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setSelectedOrder(response.data);
          setAllotStatus("Materials Alloted SuccessFully !!");
        } else {
          setAllotStatus(response.data.message);
        }
        handleButtonClick("allotMaterials");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });

    // setVisibleTable(table);
  };

  const handleCheckboxChange = (id) => {
    setSelectedMaterials((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleQuantityChange = (id, materialQuantity) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material._id === id
          ? { ...material, materialQuantity: Number(materialQuantity) }
          : material
      )
    );
  };

  const handleSaveExtraMaterialList = async function () {
    const selected = materials.filter(
      (material) =>
        selectedMaterials[material._id] && material.materialQuantity > 0
    );

    if (selected.length == 0) {
      alert("No Material Selected");
      return;
    }

    const selectedMaterialsArray = selected.map((element) => {
      return { [element._id]: element.materialQuantity };
    });

    const newData = {
      extraMaterialsNeeded: selectedMaterialsArray,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .put(
        `http://localhost:5000/api/order/addExtraMaterials/${selectedOrder._id}`,
        newData,
        config
      )
      .then((response) => {
        setListedMaterials(response.data.extraMaterialNeeded);
        setSelectedOrder(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const markCompleteStatus = async function () {
    if (!selectedOrder.materialAlloted) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .put(
        `http://localhost:5000/api/order/markCompleted/${selectedOrder._id}`,
        {},
        config
      )
      .then((response) => {
        setSelectedOrder(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const downLoadSummary = async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };
    axios
      .get(
        `http://localhost:5000/api/order/${selectedOrder._id}`,
        config
      )
      .then((response) => {
        setSelectedOrder(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });

    printIframe("print");
  };

  
  



  return (
    <div className="fixed top-0 left-0 w-full h-80 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className=" ">
        <button
          onClick={() => {
            setSelectedOrder(null);
          }}
        >
          Close
        </button>
        {
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-12 rounded overflow-auto  border-t-2 border-[#fa983d] w-3/4 h-full">
              <div className="popup-content flex justify-between mb-2">
                <div className="text-sm font-bold text-center">
                  OrderNumber:{" "}
                  <span className="text-orange-500 font-medium">
                    {selectedOrder._id}
                  </span>
                </div>
                <div className="text-md font-medium text-center bg-green-200 text-green-800 px-3 py-1 border border-green-400 rounded-lg">
                  Status:{" "}
                  <span className="font-medium">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="mb-4">
                <div
                  className="flex gap-5 mb-4 flex-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <h1 className="text-sm font-bold">
                    Customer Name:
                    <span className="text-sm text-orange-500 ml-4">
                      {selectedOrder.customerName}
                    </span>
                  </h1>

                  <h1 className="text-sm font-bold">
                    Order Start Date:
                    <span className="text-sm text-orange-500 ml-4">
                      {formatDate(selectedOrder.orderStartDate)}
                    </span>
                  </h1>
                  {selectedOrder.status === "Completed" && (
                    <h1 className="text-sm font-bold">
                      Order Complete Date:
                      <span className="text-sm text-orange-500 ml-4">
                        {formatDate(selectedOrder.orderCompleteDate)}
                      </span>
                    </h1>
                  )}
                </div>
                <div className="flex gap-5 mb-4"></div>
                <h1 className="text-lg font-bold text-center py-4 border-b border-gray-300">
                  Product Details:
                </h1>

                <div className="flex gap-5 p-4 w-full border-b border-gray-300">
                  <ul className="flex justify-between w-full flex-wrap">
                    <li className="flex items-center space-x-2">
                      <strong className="text-gray-700">Product Name:</strong>
                      <span className="text-sm text-gray-600">
                        {selectedOrder.productDetails.productName}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <strong className="text-gray-700">
                        Product Quantity:
                      </strong>
                      <span className="text-sm text-gray-600">
                        {selectedOrder.productQuantity}
                      </span>
                    </li>
                    <li
                      className="flex items-center space-x-2"
                      style={{ width: "100%" }}
                    >
                      <strong className="text-gray-700">
                        Product Description:
                      </strong>
                      <span className="text-sm text-gray-600">
                        {selectedOrder.productDetails.productDes}
                      </span>
                    </li>
                    <li
                      className="flex items-center space-x-2"
                      style={{ width: "100%" }}
                    >
                      <strong className="text-gray-700">
                        Cost of One Product Piece (Approximate):
                      </strong>
                      <span className="text-sm text-gray-600">
                        {formatToRupees(
                          selectedOrder.productDetails.approximateMaterialCost
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-col">
                  <h2 className="text-md font-bold text-gray-500">
                    Product Material Cost:
                    <span className="text-sm text-orange-500 ml-4">
                      {formatToRupees(selectedOrder.materialCost)}
                    </span>
                  </h2>{" "}
                  <h2 className="text-md font-bold text-gray-500">
                    Extra Material Cost:
                    <span className="text-sm text-orange-500 ml-4">
                      {formatToRupees(selectedOrder.extraMaterialCost)}
                    </span>
                  </h2>
                  <h2 className="text-md font-bold text-gray-500">
                    Extra Cost:{" "}
                    <span className="text-sm text-orange-500 ml-4">
                      {editExtraCost ? (
                        <input
                          type="number"
                          className=" bg-white text-black font-semibold border-b-2 border-gray-400 focus:border-blue-600 rounded-none"
                          value={extraCost}
                          onChange={(e) => setExtraCost(e.target.value)}
                          style={{
                            all: "unset",
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderBottom: "1px solid black !important",
                          }}
                        />
                      ) : (
                        <span className="text-sm text-orange-500 ml-4">
                          {formatToRupees(extraCost)}
                        </span>
                      )}
                      <button
                        className="px-1 py-1 bg-blue-600 text-white text-sm rounded-md font-medium shadow-md mx-2"
                        onClick={async (e) => {
                          if (editExtraCost) {
                            await addOtherCost(e.target.value);
                          }
                          setEditExtraCost(!editExtraCost);
                        }}
                      >
                        {editExtraCost ? "Save" : "Change"}
                      </button>
                    </span>
                  </h2>
                  <h2 className="text-md font-bold text-gray-500">
                    Total Order Cost (Upto Date):
                    <span className="text-sm text-orange-500 ml-4">
                      {formatToRupees(selectedOrder.overAllOrderCost)}
                    </span>
                  </h2>
                  <div>
                    <div className="flex justify-end gap-5">
                      {selectedOrder.status !== "Completed" && (
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-lg"
                          onClick={() => handleButtonClick("extraMaterials")}
                        >
                          Add Extra Materials
                        </button>
                      )}
                      {selectedOrder.status !== "Completed" && (
                        <button
                          className={`px-4 py-2 border text-white rounded-lg font-semibold shadow-lg ${
                            selectedOrder.status === "Completed"
                              ? "disabled-button"
                              : ""
                          }`}
                          onClick={() => checkInventaryStatus()}
                          disabled={selectedOrder.status === "Completed"}
                        >
                          Check Inventary Status
                        </button>
                      )}
                      {selectedOrder.status !== "Completed" &&
                        selectedOrder.inventarStatus.length === 0 && (
                          <button
                            className={`px-4 py-2 bg-[#fa983d] text-white rounded-lg font-semibold shadow-lg ${
                              selectedOrder.inventarStatus.length !== 0 ||
                              selectedOrder.materialAlloted
                                ? "disabled-button"
                                : ""
                            }`}
                            onClick={() => allotMaterials()}
                            disabled={
                              selectedOrder.inventarStatus.length !== 0 ||
                              selectedOrder.materialAlloted
                            }
                          >
                            {selectedOrder.materialAlloted
                              ? "Materials Alloted"
                              : "Allot Materials"}
                          </button>
                        )}
                    </div>

                    {visibleTable === "extraMaterials" && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {selectedOrder.status !== "Completed" && (
                            <button
                              onClick={() => {
                                handleEditMaterial();
                              }}
                              style={{
                                width: "100px",
                                height: "40px",
                                backgroundColor: "Red",
                              }}
                            >
                              {extraMaterialEdit ? "Save" : "Edit"}
                            </button>
                          )}
                        </div>
                        {!extraMaterialEdit ? (
                          <table className="materials-table">
                            <caption class="text-lg font-semibold text-center">
                              Extra Materials List
                            </caption>
                            <thead>
                              <tr>
                                <th>Material ID</th>
                                <th>Material Name</th>
                                <th>Material Cost</th>
                                <th>Material Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {listedMaterials.map((material) => (
                                <tr key={material.materialKey._id}>
                                  <td> {material.materialKey._id}</td>
                                  <td> {material.materialKey.pdtName}</td>
                                  <td> {material.materialKey.pdtCost}</td>
                                  <td>{material.quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          selectedOrder.status !== "Completed" && (
                            <div className="materialATble  mb-4">
                              <div>
                                <form>
                                  <table>
                                    <caption class="text-lg font-semibold text-center">
                                      Select Materials And Quantity
                                    </caption>
                                    <thead>
                                      <tr>
                                        <th>Select</th>
                                        <th>Material</th>
                                        <th>Quantity</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {materials.map((material) => (
                                        <tr key={material._id}>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                selectedMaterials[
                                                  material._id
                                                ] || false
                                              }
                                              onChange={() =>
                                                handleCheckboxChange(
                                                  material._id
                                                )
                                              }
                                            />
                                          </td>
                                          <td>{material.materialName}</td>
                                          <td>
                                            <input
                                              type="number"
                                              value={material.materialQuantity}
                                              onChange={(e) =>
                                                handleQuantityChange(
                                                  material._id,
                                                  e.target.value
                                                )
                                              }
                                              disabled={
                                                !selectedMaterials[
                                                  material._id
                                                ] || false
                                              }
                                              min={0}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </form>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {visibleTable === "checkDetails" && (
                      <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                        {/* <p>Here are the details of available inventary...</p> */}
                        {selectedOrder.inventarStatus.length == 0 ? (
                          <p className="success-message">
                            {" "}
                            {selectedOrder.materialAlloted
                              ? "Materials Already Alloted"
                              : "All Materials are available in Inventary , you can allocate materials"}
                          </p>
                        ) : (
                          <ul className="danger-list">
                            {selectedOrder.inventarStatus.map((st) => (
                              <li key={st}>{st}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {console.log(selectedOrder.materialAlloted)}
                    {visibleTable === "allotMaterials" && (
                      <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                        {selectedOrder.materialAlloted ? (
                          <p className="success-message">
                            Materials Already Alloted
                          </p>
                        ) : (
                          <p className="danger-list">
                            "No Materials Alloted , please check inventory and
                            then allot materials"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-col">
                  <div>
                    {selectedOrder.materialAlloted && (
                      <div className="flex justify-end gap-5">
                        {selectedOrder.status === "Completed" && (
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold shadow-lg `}
                            onClick={() => downLoadSummary()}
                          >
                            Download Summary
                          </button>
                        )}
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold shadow-lg ${
                            selectedOrder.status === "Completed"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-400"
                          } ${
                            selectedOrder.status === "Completed"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => markCompleteStatus()}
                          disabled={selectedOrder.status === "Completed"}
                        >
                          {selectedOrder.status === "Completed"
                            ? "Order Completed"
                            : "Complete Order"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                let orr = orders.filter((order)=>order._id !== selectedOrder._id); 
                setOrders([...orr,selectedOrder]);
                setSelectedOrder(null);
              }}
              style={{
                // height: "30px",
                width: "30px",
                borderRadius: "30px",
                backgroundColor: "transparent",
                color: "#ccc",
                fontSize: "30px",
                fontWeight: "bold",
                lineHeight: "30px",
                cursor: "pointer",
                position: "absolute",
                top: "-8px",
                right: "13%",
                fontWeight: "500",
                display: "flex",
                flexDirection: "Row",
                justifyContent: "center",
                alignItem: "center",
                padding: "0px !important",
                // zIndex: "999", // Ensure it's above other elements
              }}
            >
              X
            </button>
          </div>
        }
      </div>

      <iframe
            id="print"
            srcDoc={`<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Summary :- ${selectedOrder._id}</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f8f8f8;
                    width:100%;
                    height:100%:
                  }
                  
            .App {
                text-align: center;
              width:900px;
              padding:30px;
                margin:auto;
              }
              .first-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .order-summary {
                flex: 1;
              }
              .print-button {
                margin-left: auto;
              }
              .order-summary {
                display: flex;
                flex-direction: row;
                align-items: end;
              }
              .print-button {
                flex-shrink: 0;
              }
            
              .order-summaryy{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              }

              .main-heading span{
                font-size: 14px;
                font-weight: 300;
              
              }
            
              .order-summaryy img {
                max-width: 100px;
                margin-right: 20px;
                flex: row;
            }
            .print-button{
             padding:5px;
              text-align: end;
              font-weight: 800;
              border-radius: 15px;
            }
             
              .main-heading{
                font-size: 14px;
              text-align: end;
              }
            .Date-Main{
              font-size: 15px;
              text-align: center;
              border-bottom: 1px solid gray;
              width:23%;
            }
              .pro-head{
                text-align: start;
              } 
            .sub-heading{
              font-size: 16px;
              font-weight: 500;
             text-align: start;
            margin:0px;
            }
            
              label {
                flex: 3;
                margin: 10px;
                font-size: 20px;
              }
              
              .main-text{
                width:250px;
                height:300px;
                display: table-column;
                background-color:rgb(204, 204, 204);
                
              }
              .main-div{
                display: flex;
                gap:15px;
              }
             .heading-sign{
              font-size: 20px;
              text-align: end;
             }
             .container {
              width: 80%;
              margin: auto;
              background-color: #fff;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin-top: 20px;
            }
            .heading-main {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .print-button {
              margin: 20px 0;
              text-align: right;
            }
            .print-button button {
              padding: 10px 20px;
              font-size: 16px;
            }
            .second-heading, .sub-heading, .main-heading {
              margin: 0px 0;
            }
            .pro-head {
              margin-top: 40px;
              margin-bottom: 20px;
            }
            .border {
              border-top: 2px solid #ddd;
              margin: 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .heading-sign {
              margin-top: 40px;
              font-size: 18px;
            }
            
            
            /* Print Button */
            
            
            .print-button button {
              padding: 10px 20px;
              font-size: 16px;
              background-color: #007bff;
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            
            .print-button button:hover {
              background-color: #0056b3;
            }
            
            /* Borders */
            .border {
              border-top: 2px solid #ddd;
              margin: 20px 0;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #f2f2f2;
            }
            
            /* Signature Heading */
            .heading-sign {
              margin-top: 40px;
              font-size: 18px;
              color: #555;
            }
            
            @media print {
              .print-button {
                display: none;
              }
            }
            
            
            /* Responsive Styling */
            @media screen and (max-width: 600px) {
              .container {
                padding: 10px;
              }
              .heading-main {
                font-size: 20px;
              }
              .print-button button {
                font-size: 14px;
              }
              th, td {
                padding: 6px;
              }
            }
            
            .order-details >p{
             
              text-align: left;
            }
            
            .tFoot{
              text-align: right;
            }
                </style>
              </head>
              <body>
                <div class="App">
                  <div class="container">
                    <div class="order-summaryy">
                      <img src="https://media.licdn.com/dms/image/D4D22AQH34_zj130NOg/feedshare-shrink_2048_1536/0/1714210571437?e=2147483647&v=beta&t=PeG-sKmSnd0tnQktt96ws1fNewKZ6llFfqV41kK-nl8" alt=" Image">
                      <div class="heading-main">Order Summary :- ${selectedOrder._id}</div>  
                  </div>
                  
                       
                      <div class="border"></div>
                 
                      
                    <div class="first-head">
                      <div class="order-summary">
                        <div class="order-details">
                          <p>Customer Name: ${selectedOrder.customerName}</p>
                          <p>Order Start Date: ${formatDate(selectedOrder.orderStartDate)}</p>
                          <p>Order Completed Date :-  ${formatDate(selectedOrder.orderCompleteDate)}</p>
                        </div>
                        
                      </div>
                      <div class="print-button">
                        <button onclick="window.print()">Print</button>
                      </div>
                    </div>
                   
                    <h3 class="pro-head">Product Details:-</h3>
                    <div class="sub-heading">
                      <p>Product Name:- ${selectedOrder.productDetails.productName}</p>
                      <p>Product Quantity:- ${selectedOrder.productQuantity}</p>
                      <p>Product Description:- ${selectedOrder.productDetails.productDes}</p>
                    </div>
                    
                    <div class="border"></div>
                    <h4>Product Materials Used</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Material ID</th>
                          <th>Material Name</th>
                          <th>Material Cost (per unit)</th>
                          <th>Material Quantity</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody id="materials-used-body">
                      </tbody>
                      <tfoot>
                          <tr>
                            <td colspan="4" class="tFoot" >(A) Products Material Cost:-</td>
                            <td id="totalCostA"></td>
                          </tr>
                        </tfoot>
                    </table>
            
            
                    
                    <div class="border"></div>
                    <h4>Extra Materials Used</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Material ID</th>
                          <th>Material Name</th>
                          <th>Material Cost (per unit)</th>
                          <th>Material Quantity</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody id="extra-materials-used-body">
                      </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="4"  class="tFoot">(B) Total Extra Material Cost</td>
                            <td id="totalCostB"></td>
                          </tr>
                        </tfoot>
                    </table>
                    <div class="border"></div>
                    
                    <div class="main-heading">
                      <h4>(C) Extra Cost:- <span>${formatToRupees(selectedOrder.otherCost)}</span></h4>
                      <h4>(A+B+C) Total Order Cost:- <span>${formatToRupees(selectedOrder.overAllOrderCost)}</span> </h4>
                    </div>
                   
                    <div class="heading-sign">Signature</div>
                  </div>
                </div>
              </body>
            </html>
            `}
            style={{ width:"100%",position: "absolute", top: "-1000px", left: "100%" }}
            title={`Order Summary ${selectedOrder._id}`}
          />
    </div>
  );
};

export default ViewOrderModal;
