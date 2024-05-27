import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { AppState } from "../../components/Context/context";

const ViewProductModal = ({
  isOpen,
  onRequestClose,
  selectedProduct,
  setSelectedProduct,
  handleDeleteProduct,
}) => {
  const { products, setProducts, materials, setMaterials } = AppState();
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState(selectedProduct);

  const [loading, setLoading] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [unselectedMaterials, setUnselectedMaterials] = useState([]);
  const [listedMaterials, setListedMaterials] = useState(productData.productMaterialList);

  const handleEditToggle = async() => {
    if(isEditing){
      await handleSave();
    }
    setIsEditing(!isEditing);
  };

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

    updateMaterialQuantity(materials, selectedProduct.productMaterialList);
  }, []);

  // const handleMaterialChange = (materialId, key, value) => {
  //   setMaterials((prevMaterials) =>
  //     prevMaterials.map((material) =>
  //       material.materialKey._id === materialId
  //         ? {
  //             ...material,
  //             [key]: value,
  //           }
  //         : material
  //     )
  //   );
  // };

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

  const handleRecalculateCost = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    const body = {};
    axios
      .put(
        `http://localhost:5000/api/finalProduct/recalculateCost/${productData._id}`,
        body,
        config
      )
      .then((response) => {
        setSelectedProduct(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    setLoading(false);
  };



  const handleSave = async () => {
    setLoading(true);
    const selected = materials.filter((material) => selectedMaterials[material._id] && material.materialQuantity > 0);
    
   
    if (selected.length == 0 ) {
        alert("No Material Selected");
        return;
      }

      const selectedMaterialsArray = selected.map((element) => {
        return { [element._id]: element.materialQuantity };
      });

    const newData = {
      productName:productData.productName,
      materialList: selectedMaterialsArray,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    // // API call to save data
    axios
      .put("http://localhost:5000/api/finalProduct/editProduct", newData, config)
      .then((response) => {
        setListedMaterials(response.data.productMaterialList);
        setProductData(response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });

      setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Product Modal"
      className="product-modal"
      overlayClassName="product-modal-overlay"
    >
      <div className="modal-header">
        <h2>Product Details</h2>
        <button onClick={onRequestClose} className="close-button">
          Close
        </button>
      </div>
      <div className="modal-body">
        <div className="product-info">
          <label>Product Name:</label>
          <p>{productData.productName}</p>
        </div>
        <div className="product-info">
          <label>Product Description:</label>
          <p>{productData.productDes}</p>
        </div>
        <div className="product-info">
          <label>Product Material Cost (approx):</label>
          <p> Rs. {productData.approximateMaterialCost}</p>
        </div>
        {!isEditing ? (
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
              {!loading && listedMaterials.map((material) => (
                <tr key={material.materialKey._id}>
                  <td> {material.materialKey._id}</td>
                  <td> {material.materialKey.pdtName}</td>
                  <td> {material.materialKey.pdtCost}</td>
                  <td>
                    {material.quantity}
                    {/* <input
                    type="number"
                    min={1}
                    value={material.quantity}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleMaterialChange(
                        material.materialKey._id,
                        "quantity",
                        parseInt(e.target.value, 10)
                      )
                    }
                  /> */}
                  </td>
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
                      <tr key={materials._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedMaterials[material._id] || false}
                            onChange={() => handleCheckboxChange(material._id)}
                          />
                        </td>
                        <td>{material.materialName}</td>
                        <td>
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
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button onClick={handleEditToggle}>
          {isEditing ? "Save" : "Edit"}
        </button>
        <button onClick={handleRecalculateCost}>
          {loading ? "laoding" : "Recalculate Cost"}
        </button>
        <button onClick={() => handleDeleteProduct(productData._id)}>
          Delete Product
        </button>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
