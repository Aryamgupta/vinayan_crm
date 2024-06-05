//products details//
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";
import ViewProductModal from "./ViewProductModal";
import AddProductModal from "./AddProductModal";
import { AppState } from "../../components/Context/context";
import "./storeM.css";
import axios from "axios";

const ProductForm = () => {
  const router = useNavigate();
  if (!localStorage.getItem("token")) {
    router("/");
  }

  const { products, setProducts, fetchAllProducts,formatToRupees } = AppState();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);

  const handleCloseAddModel = () => {
    setSelectedProduct(null);
    setIsAddModelOpen(false);
  };

  const fetchSingleProduct = function (id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };

    axios
      .get(`http://localhost:5000/api/finalProduct/${id}`, config)
      .then((response) => {
        setSelectedProduct(response.data);
        setViewIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleDeleteProduct = (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: `${localStorage.getItem("token")}`,
      },
    };
    axios
      .delete(
        `http://localhost:5000/api/finalProduct/deleteProduct/${id}`,
        config
      )
      .then((response) => {
        let newProductsData = products.filter((p) => {
          return p._id !== id;
        });
        setProducts(newProductsData);
        setSelectedProduct(null);
        setViewIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const handleAddData = (product) => {
    // Update tableData with the new data
    setProducts([...products, product]);

    // Close the modal
    setIsAddModelOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
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
        Add New Product
      </button>
      <AddProductModal
        isOpen={isAddModelOpen}
        onSave={handleAddData}
        onCancel={handleCloseAddModel}
      />
      <div className="grid grid-cols-3 gap-4 p-2">
        {products.map((product) => (
          <div
            key={product._id}
            className="border-t-2 border-[#fa983d] rounded-lg shadow-lg bg-white cursor-pointer py-6"
            onClick={() => fetchSingleProduct(product._id)}
          >
            <div className="p-4">
              <img src={`http://localhost:5000${product.productImage}`} style={{height:"200px",margin:"0 auto 20px"}}/>
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Product Name:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productName}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Product Description:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productDes}
                </span>
              </div>
              <div className="text-md  font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Product Material Cost (Approx):
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                 {formatToRupees(product.approximateMaterialCost)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ViewProductModal
          isOpen={isViewModalOpen}
          selectedProduct={selectedProduct}
          onRequestClose={() => setViewIsModalOpen(false)}
          setSelectedProduct={setSelectedProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default ProductForm;