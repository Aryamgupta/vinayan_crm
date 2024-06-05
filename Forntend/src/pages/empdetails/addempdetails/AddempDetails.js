import React, { useState, useEffect } from "react";
import axios from "axios";

const AddempDetails = ({ isOpen, onSave, onCancel }) => {
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [materials, setMaterials] = useState([]);
  const [empName, setEmpName] = useState("");
  const [phnNumber, setPhnNumber] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empDept, setEmpDept] = useState(""); // Define products state variable
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Define fetchCompleteTable and fetchAllProducts functions
    const fetchCompleteTable = () => {
      // Your implementation
    };

    const fetchAllProducts = () => {
      // Your implementation
    };

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
    // Your implementation
  };

  // useEffect(() => {
  //   console.log(products);
  // }, [products]);

  const handleSave = async () => {
    // Your implementation
  };

  const handleCancel = () => {
    onCancel();
  };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     console.log("yes i am here");
  //   }
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed top-5 left-12 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="addModalMainDIv addModalA bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#fa983d] addModalA " style={{padding:"0 auto"}}>
        <h2 className="text-md font-bold text-black pb-2">Add New Employee</h2>
        <div style={{ display: "flex", flexDirection: "row",width:"100%" ,justifyContent:"space-between"}}>
          <div>
          <label
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e);
              }}
              style={{
                padding: "150px",
              }}
              hidden
            />
            <img
              src={uploadedImage}
              style={{ width: "200px", height: "200px" }}
            />
            <span></span>
          </label>
          </div>

          <div className="flex-wrap  mb-4 font-semibold " style={{width:"70%",justifyContent:"flex-end" }}>
            <div className="nameIpField row px-2 mb-2 ">
              <label htmlFor="empName" className="block mb-1 col-3">
                Name:
              </label>
              <input
                type="text"
                id="empName"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="border px-4 py-2 rounded-md col-6"
              />
            </div>
            <div className="nameIpField   row px-2 mb-2 ">
              <label htmlFor="phnNumber" className="block mb-1 col-3">
                Phone Number:
              </label>
              <input
                type="text"
                id="phnNumber"
                value={phnNumber}
                onChange={(e) => setPhnNumber(e.target.value)}
                className="border px-4 py-2 rounded-md col-6"
              />
            </div>
            <div className="nameIpField   row px-2 mb-2 ">
              <label htmlFor="empEmail" className="block mb-1 col-3">
                Email:
              </label>
              <input
                type="text"
                id="empEmail"
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                className="border px-4 py-2 rounded-md col-6"
              />
            </div>
            <div className="nameIpField   row px-2 mb-2 ">
              <label htmlFor="empRole" className="block mb-1 col-3">
                Job Role:
              </label>
              <input
                type="text"
                id="empRole"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                className="border px-4 py-2 rounded-md col-6"
              />
            </div>
            <div className="nameIpField   row px-2 mb-2 ">
              <label htmlFor="empDept" className="block mb-1 col-3">
                Department:
              </label>
              <input
                type="text"
                id="empDept"
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value)}
                className="border px-4 py-2 rounded-md col-6"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-400 text-white rounded-md mr-2 hover-none"
          >
            Add
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddempDetails;
