
import React, { useState } from "react";
import Vinayan from "../../../src/images/vinayan-logo.png";
// import AddProductModel from "../storemanagement/addmodel/Addmodel"
const products = [
  {
    id: 1,
    name: "Lidar 1",
    cost: "$10",
    description: "Lorem ipsum Duis aute irure.",
    quentity: "7",
    customername: "Nandani Pandey",
    image: "https://assets.rbl.ms/25582093/origin.jpg",
  },
  {
    id: 2,
    name: "Lidar 2",
    cost: "$20",
    description: "Ut enim ad Duis aute irure.",
    quentity: "9",
    customername: "Nandu Pandey",
    image:
      "https://cdn.arstechnica.net/wp-content/uploads/2017/01/Velodyne-Lidar-sensors-800x500.jpg",
  },
  {
    id: 3,
    name: "Lidar 3",
    cost: "$30",
    description: "Duis aute irure Duis aute irure.",
    quentity: "8",
    customername: "Lalita Pandey",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdOH7UVvxE5-AzxwPrXmSgE6AvGhgJGGTrNZk3RY1hBQ&s",
  },
  // Add more products as needed
];

const CardContainer = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedDetails, setEditedDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [visibleTable, setVisibleTable] = useState("");
  const [value, setValue] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(1);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditedDetails(product.details); // Initialize edited details with product details
  };
  //table//

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

  return (
    <div>
      


      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-12 rounded overflow-auto  border-t-2 border-[#fa983d] w-3/4 h-full">
            <div className="popup-content flex justify-between mb-2">
              <div className="text-sm font-bold text-center">
                OrderNumber:{" "}
                <span className="text-orange-500 font-medium">
                  {selectedProduct.name}
                </span>
              </div>
              <button
                className="close-button bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>

            <div className="mb-4">
              <div className="flex gap-5 mb-4">
                <h1 className="text-sm font-bold">Customer Name:</h1>
                <span className="text-sm">{selectedProduct.customername}</span>
              </div>
              <h1 className="text-lg font-bold text-center">
                Product Details:
              </h1>
              <div className="flex gap-5 p-4">
                <ul className="flex space-x-8">
                  <li className="flex items-center space-x-2">
                    <strong className="text-gray-700">Product Name:</strong>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.name}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <strong className="text-gray-700">Product Quantity:</strong>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.quentity}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <strong className="text-gray-700">
                      Product Description:
                    </strong>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.description}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-500">
                  Total Material Cost:
                  <span className="text-sm text-orange-500 ml-4">
                    {selectedProduct.cost}
                  </span>
                </h1>

                <div className="flex flex-row space-x-5 mb-4">
                  <div className="flex items-center mb-4">
                    <p className="flex text-lg font-bold mr-4">Extra Cost:</p>
                    <div className="flex items-center  px-4 py-1  rounded-md">
                      <input
                        type="number"
                        className="px-4 py-2 bg-white text-black rounded-lg font-semibold border"
                        value={value}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg"
                      onClick={handleAddClick}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-end gap-5">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-lg"
                      onClick={() => handleButtonClick("extraMaterials")}
                    >
                      Add Extra Materials
                    </button>
                    <button
                      className="px-4 py-2 border text-black rounded-lg font-semibold shadow-lg"
                      onClick={() => handleButtonClick("checkDetails")}
                    >
                      Check Details
                    </button>
                    <button
                      className="px-4 py-2 bg-[#fa983d] text-white rounded-lg font-semibold shadow-lg"
                      onClick={() => handleButtonClick("allotMaterials")}
                    >
                      Allot Materials
                    </button>
                  </div>

                  {visibleTable === "extraMaterials" && (
                    <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                      <p>Here are some extra materials...</p>
                      <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Product Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Product Cost
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Product Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Product 1
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">$10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              This is a description of product 1.
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Product 2
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">$20</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">
                                {selectedProduct.description}
                              </span>
                            </td>
                          </tr>
                        
                          <button
                            onClick={handleClose}
                            className="  bg-red-500 text-white px-2 py-1 rounded "
                          >
                            Close
                          </button>
                        
                          {/* Add more rows as needed */}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {visibleTable === "checkDetails" && (
                    <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                      <p>Here are the details...</p>
                      <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Detail Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Detail Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Detail 1
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Value 1
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Detail 2
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Value 2
                            </td>
                          </tr>
                          <button
                            onClick={handleClose}
                            className=" flex justify-end bg-red-500 text-white px-2 py-1 rounded "
                          >
                            Close
                          </button>
                          {/* Add more rows as needed */}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {visibleTable === "allotMaterials" && (
                    <div className="w-full top-10 left-0 mt-2 p-2 border rounded-lg shadow-lg bg-white z-10">
                      <p>Allot materials details...</p>
                      <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Material Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Material 1
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">5</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Notes about material 1.
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Material 2
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              Notes about material 2.
                            </td>
                          </tr>
                          {/* Add more rows as needed */}

                          <button
                            onClick={handleClose}
                            className=" flex justify-end bg-red-500 text-white px-2 py-1 rounded "
                          >
                            Close
                          </button>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContainer;