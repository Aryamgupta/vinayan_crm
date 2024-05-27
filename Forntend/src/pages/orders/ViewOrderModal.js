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
  } = AppState();
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    fetchCompleteTable();
    if (selectedOrder.extraMaterialNeeded.length != 0) {
      setExtraMaterialEdit(false);
    }
    console.log(listedMaterials);
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
          otherCost: extraCost,
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
          selectedOrder(response.data);
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

    // // API call to save data
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
                          {extraCost}
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
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-lg"
                        onClick={() => handleButtonClick("extraMaterials")}
                      >
                        Add Extra Materials
                      </button>
                      <button
                        className="px-4 py-2 border text-white rounded-lg font-semibold shadow-lg"
                        onClick={() => checkInventaryStatus()}
                      >
                        Check Inventary Status
                      </button>
                      <button
                        className={`px-4 py-2 bg-[#fa983d] text-white rounded-lg font-semibold shadow-lg ${
                          selectedOrder.inventarStatus.length !== 0
                            ? "disabled-button"
                            : ""
                        }`}
                        onClick={() => allotMaterials()}
                        disabled={selectedOrder.inventarStatus.length !== 0}
                      >
                        Allot Materials
                      </button>
                    </div>

                    {visibleTable === "extraMaterials" && (
                      <div>
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
                        {!extraMaterialEdit ? (
                          <table className="materials-table">
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
                          <div className="materialATble  mb-4">
                            <h2>Select Materials And Quantity</h2>
                            <div>
                              <form>
                                <table>
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
                                              selectedMaterials[material._id] ||
                                              false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(material._id)
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
                        )}
                      </div>
                    )}

                    {visibleTable === "checkDetails" && (
                      <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                        <p>Here are the details of available inventary...</p>
                        {selectedOrder.inventarStatus.length == 0 ? (
                          <p className="success-message">
                            {" "}
                            All Materials are available in Inventary , you can
                            allocate materials
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
            </div>
            <button
              onClick={() => {
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
    </div>
  );
};

export default ViewOrderModal;
