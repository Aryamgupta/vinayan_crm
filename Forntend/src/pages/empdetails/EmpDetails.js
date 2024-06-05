import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ViewEmpModal from "../../pages/empdetails/ViewempModel/ViewEmpModel";
import AddProductModal from "../../pages/empdetails/addempdetails/AddempDetails";
import { AppState } from "../../components/Context/context";
import axios from "axios";

const ProductForm = () => {
  const router = useNavigate();
  if (!localStorage.getItem("token")) {
    router("/");
  }

  const { products, setProducts, fetchAllProducts } = AppState();

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

  const fetchSingleProduct = (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    };

    axios
      .get(`http://localhost:5000/api/finalProduct/${id}`, config)
      .then((response) => {
        setSelectedProduct(response.data);
        setViewIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleDeleteProduct = (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    };
    axios
      .delete(
        `http://localhost:5000/api/finalProduct/deleteProduct/${id}`,
        config
      )
      .then((response) => {
        const newProductsData = products.filter((p) => p._id !== id);
        setProducts(newProductsData);
        setSelectedProduct(null);
        setViewIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handleAddData = (product) => {
    setProducts([...products, product]);
    setIsAddModelOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => setIsAddModelOpen(true)}
        style={{
          backgroundColor: "#fa983d",
          padding: "4px 16px",
          color: "#ffffff",
          borderRadius: "0.375rem",
        }}
      >
       EmpDetails
      </button>
      <AddProductModal
        isOpen={isAddModelOpen}
        onSave={handleAddData}
        onCancel={handleCloseAddModel}
      />
      <div className="grid grid-cols-4 gap-4 p-2">
        {products && products.map((product) => (
          <div
            key={product._id}
            className="border-t-2 border-[#fa983d] rounded-lg shadow-lg bg-white cursor-pointer py-6"
            onClick={() => fetchSingleProduct(product._id)}
          >
            <div className="p-4">
              {/* Assuming productName is a URL, you should use <img src={product.productImageURL} /> instead */}
              <img src={product.productName} style={{width:"100%",height:"150px",margin:"0 0 20px 0", border: "1px solid red"}} alt="empimg" />
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                  Empid:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productName}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                 Name:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productDes}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                 Email:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productEmail}
                </span>
              </div>
              <div className="text-md gap-4 font-semibold space-x-4">
                <span style={{ fontWeight: "bold", color: "orange" }}>
                 Number:
                </span>
                <span style={{ color: "gray", fontSize: "small" }}>
                  {product.productNumber}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ViewEmpModal
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
