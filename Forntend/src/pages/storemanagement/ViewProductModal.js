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
  const { formatToRupees } = AppState();

  const { products, setProducts, materials, setMaterials } = AppState();
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState(selectedProduct);
  const [loading, setLoading] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [unselectedMaterials, setUnselectedMaterials] = useState([]);
  const [listedMaterials, setListedMaterials] = useState(
    productData.productMaterialList
  );

  const handleEditToggle = async () => {
    if (isEditing) {
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
      productName: productData.productName,
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
      .put(
        "http://localhost:5000/api/finalProduct/editProduct",
        newData,
        config
      )
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
        <h2 className="main-heading">{productData.productName}</h2>
        <button onClick={onRequestClose} className="close-button">
       X
        </button>
      </div>
      <div className="modal-body">
        <div className="content-wrapper">
          <div className="image-section">
            <img src={productData.productImage} alt="Product" />
          </div>
          <div className="data-section">
            
            <div className="product-info">
             
              <p className="sub-heading">{productData.productDes}</p>
            </div>
           
            {!isEditing ? (
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>Material ID</th>
                    <th>Material Name</th>
                    <th>Material Cost</th>
                    <th>Material Quantity</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading &&
                    listedMaterials.map((material) => (
                      <tr key={material.materialKey._id}>
                        <td> {material.materialKey._id}</td>
                        <td> {material.materialKey.pdtName}</td>
                        <td style={{textAlign:"center"}}> {formatToRupees(material.materialKey.pdtCost)}</td>

                        <td>{material.quantity}</td>
                        <td style={{textAlign:"right"}}>
                          {" "}
                          {formatToRupees(
                            material.materialKey.pdtCost * material.quantity
                          )}
                        </td>
                      </tr>
                    ))}                    
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" class="tFoott">
                      Total Extra Material Cost
                    </td>
                    <td id="totalCostB">{formatToRupees(productData.approximateMaterialCost)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="materialATble" style={{ width: "100%", overflowX: "auto" }}>
              <h2 className="edit-head" style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                Select Materials And Quantity
              </h2>
              <div style={{height: "300px", overflowY: "scroll", width: "100%", border:"1px solid #ccc"}} >
                  <table style={{ width: "100%", borderCollapse: "collapse",}}>
                    <thead style={{ position: "sticky", top: "0px", backgroundColor: "#f9f9f9", zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: "10px", textAlign: "center",border: "1px solid #ddd", borderBottom: "2px solid #ccc" }}>Select</th>
                        <th style={{ padding: "10px", textAlign: "center",border: "1px solid #ddd", borderBottom: "2px solid #ccc" }}>Material</th>
                        <th style={{ padding: "10px", textAlign: "center",border: "1px solid #ddd", borderBottom: "2px solid #ccc" }}>Quantity</th>
                      </tr>
                    </thead>

                      {materials.map((material) => (
                        <tr key={material._id} style={{}}>
                          <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>
                            <input
                              type="checkbox"
                              checked={selectedMaterials[material._id] || false}
                              onChange={() => handleCheckboxChange(material._id)}
                            />
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{material.materialName}</td>
                          <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>
                            <input
                              type="number"
                              value={material.materialQuantity}
                              onChange={(e) => handleQuantityChange(material._id, e.target.value)}
                              disabled={!selectedMaterials[material._id] || false}
                              min={0}
                            />
                          </td>
                        </tr>
                      ))}
                  </table>
              </div>
            </div>
            
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleEditToggle}>
            {isEditing ? "Save" : "Edit"}
          </button>
          <button onClick={handleRecalculateCost}>
            {loading ? "laoding" : "Recalculate Cost"}
          </button>
          <button onClick={() => handleDeleteProduct(productData._id)}>
          Remove Product
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
