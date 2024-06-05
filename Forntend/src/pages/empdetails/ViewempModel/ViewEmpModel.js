import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const ViewEmpModal = ({
  isOpen,
  onRequestClose,
  selectedProduct,
  setSelectedProduct,
}) => {
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
      if (!materials) {
        // Handle the case when materials is undefined
        return;
      }

      const updatesMap = new Map();
      let newArr = {};
      updates.forEach((update) => {
        newArr[update.materialKey._id] = true;
        updatesMap.set(update.materialKey._id, update.quantity);
      });

      materials.forEach((material) => {
        if (updatesMap.has(material._id)) {
          material.materialQuantity = updatesMap.get(material._id);
        } else {
          material.materialQuantity = 0;
        }
      });
      setSelectedMaterials(newArr);
    }

    updateMaterialQuantity(
      selectedProduct.materials,
      selectedProduct.productMaterialList
    );
  }, [selectedProduct]);

  const handleCheckboxChange = (id) => {
    setSelectedMaterials((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleQuantityChange = (id, materialQuantity) => {
    // Update material quantity locally
    const updatedMaterials = listedMaterials.map((material) =>
      material._id === id
        ? { ...material, materialQuantity: Number(materialQuantity) }
        : material
    );
    setListedMaterials(updatedMaterials);
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
    const selected = listedMaterials.filter(
      (material) =>
        selectedMaterials[material._id] && material.materialQuantity > 0
    );

    if (selected.length === 0) {
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
      
        <button onClick={onRequestClose} className="close-button">
          X
        </button>
      </div>
      <div className="modal-body" style={{ display: "flex" }}>
        <div className="content-wrapper gap-48 ">
        <div className="image-section border" style={{ width: "100px" }}>
  <img src={productData.productImage} alt="empimg" style={{ Width: "100px", height: "auto" }} />
</div>
          <div
            className="product-info w-1/2"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Employee Details */}
            <p>
              Employee ID: <span style={{ fontSize: "small" }}>1</span>
            </p>
            <p>
              Name: <span style={{ fontSize: "small" }}>John Doe</span>
            </p>
            <p>
              Phone Number:{" "}
              <span style={{ fontSize: "small" }}>123-456-7890</span>
            </p>
            <p>
              Email:{" "}
              <span style={{ fontSize: "small" }}>john.doe@example.com</span>
            </p>
            <p>
              Role: <span style={{ fontSize: "small" }}>Manager</span>
            </p>
            <p>
              Department: <span style={{ fontSize: "small" }}>Sales</span>
            </p>
          </div>
        </div>

        <div style={{ flex: 2 , width: '100%' }}>
          {!isEditing ? (
            <table className="materials-table mt-5 ">
              <thead>
                <tr>
                  <th>Material id</th>
                  <th>Material Name</th>
                  <th>Material Quantity</th>
                  <th>Allotment Date</th>
                  <th>Return Date </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  listedMaterials.map((material) => (
                    <tr key={material.materialKey._id}>
                      <td> {material.materialKey._id}</td>
                      <td> {material.materialKey.pdtName}</td>
                      <td style={{ textAlign: "center" }}>
                        {material.materialKey.pdtCost}
                      </td>
                      <td>{material.quantity}</td>
                      <td>2024-06-05</td>
        <td><button>De Allot</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div
            className="materialATble"
            style={{
              overflowX: "auto",
            }}
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
                height: "300px",
                overflowY: "scroll",
                border: "1px solid #ccc",
              }}
            >
              <table
                style={{
                  width: "100%", // This will make the table take up the full width
                  borderCollapse: "collapse",
                }}
              >
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
                        padding: "20px",
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
                <tbody>
                  {listedMaterials.map((material) => (
                    <tr key={material._id}>
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
                </tbody>
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
      </div>
    </Modal>
  );
};

export default ViewEmpModal;
