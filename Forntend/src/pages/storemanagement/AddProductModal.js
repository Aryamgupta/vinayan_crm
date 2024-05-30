import React, { useEffect, useState } from "react";
import { AppState } from "../../components/Context/context";
import axios from "axios";

const AddProductModal = ({ isOpen, onSave, onCancel }) => {
  const {
    fetchAllProducts,
    setProducts,
    products,
    materials,
    fetchCompleteTable,
    setMaterials,
  } = AppState();
  const [productName, setProductName] = useState("");
  const [productDes, setProductDes] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    fetchCompleteTable();
    fetchAllProducts();
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    console.log(products);
  }, [products]);

  const handleSave = async () => {
    const selected = materials.filter(
      (material) =>
        selectedMaterials[material._id] && material.materialQuantity > 0
    );

    if (!productName || !productDes) {
      alert("Please fill in all fields.");
      return;
    }
    if (selected.length == 0) {
      alert("No Material Selected");
      return;
    }

    const selectedMaterialsArray = selected.map((element) => {
      console.log(element);
      return { [element._id]: element.materialQuantity };
    });

    const newData = {
      productName,
      productDes,
      materialList: selectedMaterialsArray,
      productImage:uploadedImageUrl
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // // API call to save data
    axios
      .post(
        "http://localhost:5000/api/finalProduct/addProduct",
        newData,
        config
      )
      .then((response) => {
        setProducts([...products, response.data]);
        onCancel();
        setProductName("");
        setProductDes("");
        setSelectedMaterials([]);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleCancel = () => {
    onCancel();
    // Reset state if cancel is clicked

    setProductName("");
    setProductDes("");
  };

  const handleImageUpload = async (event) => {
    const selectedFile = event.target.files[0];
   
    const formData = new FormData();
    formData.append("image", selectedFile);

    console.log(formData);

    const config = {
      headers: {
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .post("http://localhost:5000/api/upload",formData, config)
      .then((response) => {
        setUploadedImageUrl(response.data.filePath);
        // setUploadedImageUrl("");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="addModalMainDIv addModalA bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#fa983d] addModalA ">
        <h2 className="text-md font-bold text-black pb-2">Add New Product</h2>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="nameIpField  w-full row px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1 col-3">
              Product Name:
            </label>
            <input
              type="text"
              id="pdtName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border px-4 py-2 rounded-md col-6"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className=" nameIpField w-full  px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1">
              Product Description:
            </label>
            <textarea
              type="text"
              id="pdtName"
              value={productDes}
              onChange={(e) => setProductDes(e.target.value)}
              className="border px-4 py-2 rounded-md "
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className=" nameIpField w-full  px-2 mb-2">
            <label htmlFor="pdtName" className="block mb-1">
              Product Description:
            </label>
            <input
              type="file"
              onChange={(e)=>handleImageUpload(e)}
            />
          </div>
        </div>

        <div
          className="materialATble"
          style={{ width: "100%", overflowX: "auto" }}
        >
          <h2
            className="edit-head"
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              zIndex: 1,
            }}
          >
            Select Materials And Quantity
          </h2>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              width: "100%",
              border: "1px solid #ccc",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  position: "sticky",
                  top: "0px",
                  backgroundColor: "#f9f9f9",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderBottom: "2px solid #ccc",
                    }}
                  >
                    Select
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderBottom: "2px solid #ccc",
                    }}
                  >
                    Material
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderBottom: "2px solid #ccc",
                    }}
                  >
                    Quantity
                  </th>
                </tr>
              </thead>

              {materials.map((material) => (
                <tr key={material._id} style={{}}>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMaterials[material._id] || false}
                      onChange={() => handleCheckboxChange(material._id)}
                    />
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {material.materialName}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="number"
                      value={material.materialQuantity}
                      onChange={(e) =>
                        handleQuantityChange(material._id, e.target.value)
                      }
                      disabled={!selectedMaterials[material._id] || false}
                      min={0}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-400 text-white rounded-md mr-2"
            disabled={!uploadedImageUrl}
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

export default AddProductModal;
