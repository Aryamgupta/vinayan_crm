// import React, { useState } from "react";

// const AddModel = ({ isOpen, onSave, onCancel }) => {
//   const [newData, setNewData] = useState({
//     ItemId: "",
//     ProductCost: "",
//     ProductName: "",
//     ProductBill: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewData((prevData) => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     onSave(newData); // Pass the new data to the onSave function
//     setNewData({
//       // Clear the form after saving
//       ItemId: "",
//       ProductCost: "",
//       ProductName: "",
//       ProductBill: ""
//     });
//   };

//   return (
//     isOpen && (
//       <div className="fixed z-10 inset-0 overflow-y-auto">
//         <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//           <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//           </div>
//           <span
//             className="hidden sm:inline-block sm:align-middle sm:h-screen"
//             aria-hidden="true"
//           >
//             &#8203;
//           </span>
//           <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                   <h3 className="text-lg font-medium leading-6 text-gray-900">
//                     Add New Data
//                   </h3>
//                   <div className="mt-2">
//                     <div className="mb-4">
//                       <label
//                         htmlFor="itemId"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Item ID
//                       </label>
//                       <input
//                         type="text"
//                         name="ItemId"
//                         id="itemId"
//                         autoComplete="off"
//                         value={newData.ItemId}
//                         onChange={handleChange}
//                         className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <label
//                         htmlFor="productCost"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Product Cost
//                       </label>
//                       <input
//                         type="text"
//                         name="ProductCost"
//                         id="productCost"
//                         autoComplete="off"
//                         value={newData.ProductCost}
//                         onChange={handleChange}
//                         className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <label
//                         htmlFor="productName"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Product Name
//                       </label>
//                       <input
//                         type="text"
//                         name="ProductName"
//                         id="productName"
//                         autoComplete="off"
//                         value={newData.ProductName}
//                         onChange={handleChange}
//                         className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <label
//                         htmlFor="productBill"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Product Bill
//                       </label>
//                       <input
//                         type="text"
//                         name="ProductBill"
//                         id="productBill"
//                         autoComplete="off"
//                         value={newData.ProductBill}
//                         onChange={handleChange}
//                         className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button
//                 onClick={handleSave}
//                 type="button"
//                 className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={onCancel}
//                 type="button"
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default AddModel;


import React, { useState, useEffect } from 'react';

const InModel = ({ isOpen, rowData, onSave, onCancel }) => {
    // State variables to hold edited values
    const [editedItemID, setEditedItemID] = useState([]);
    const [editedProductName, setEditedProductName] = useState([]);
    const [editedProductQuantity, setEditedProductQuantity] = useState([]);
    const [editedProductCost, setEditedProductCost] = useState('');
    const [editedProductBill, setEditedProductBill] = useState('');
    const [editedProductVenderName, setEditedProductVenderName] = useState('');

    // Update useEffect to set edited state variables with rowData
 useEffect(() => {
    if (rowData) {
        setEditedItemID(rowData.ItemID);
        setEditedProductName(rowData.ProductName);
        setEditedProductQuantity(rowData.ProductQuantity);
        setEditedProductCost(rowData.ProductCost);
        setEditedProductBill(rowData.ProductBill);
        setEditedProductVenderName(rowData.ProductVenderName);
    }
}, [rowData]);


console.log(rowData,"rowdata")
    
    if (!isOpen || !rowData) return null;

    const handleSave = () => {
        // Combine the edited values into an object and pass it to onSave function
        onSave({
            ...rowData, // Maintain other fields
            ItemID: editedItemID,
            ProductName: editedProductName,
            ProductQuantity: editedProductQuantity,
            ProductVenderName: editedProductVenderName,
            ProductCost: editedProductCost,
            ProductBill: editedProductBill
        });
    };
    

    // const handleCancel = () => {
    //     onCancel();
    // };
    const handleCancel = () => {
        // Reset state if cancel is clicked
        onCancel();
        setEditedItemID('');
        setEditedProductName('');
        setEditedProductQuantity('');
        setEditedProductCost('');
        setEditedProductBill('');
        setEditedProductVenderName('');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
           <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#fa983d]">
    <div className="flex flex-wrap -mx-2 mb-4"> {/* Wrapper for flex layout */}
        {/* Label and input field for ItemID */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="itemID" className="block mb-1">ItemID:</label>
            <input
                type="text"
                id="itemID"
                value={editedItemID}
                onChange={(e) => setEditedItemID(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>

        {/* Label and input field for ProductCost */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="productCost" className="block mb-1">Product Cost:</label>
            <input
                type="text"
                id="productCost"
                value={editedProductCost}
                onChange={(e) => setEditedProductCost(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>
    </div>
    <div className="flex flex-wrap -mx-2 mb-4"> {/* Wrapper for flex layout */}
        {/* Label and input field for ItemID */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="itemID" className="block mb-1"> Product Bill:</label>
            <input
                type="text"
                id="ProductBill"
                value={editedProductBill}
                onChange={(e) => setEditedProductBill(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>

        {/* Label and input field for ProductCost */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="productCost" className="block mb-1">Product Name:</label>
            <input
                type="text"
                id="productName"
                value={editedProductCost}
                onChange={(e) => setEditedProductName(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>
    </div>
    <div className="flex flex-wrap -mx-2 mb-4"> {/* Wrapper for flex layout */}
        {/* Label and input field for ItemID */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="itemID" className="block mb-1">Product Quantity:</label>
            <input
                type="text"
                id="itemID"
                value={editedProductQuantity}
                onChange={(e) => setEditedProductQuantity(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>

        {/* Label and input field for ProductCost */}
        <div className="w-full md:w-1/2 px-2 mb-2">
            <label htmlFor="productCost" className="block mb-1">Product Vender Name:</label>
            <input
                type="text"
                id="productCost"
                value={editedProductVenderName}
                onChange={(e) => setEditedProductVenderName(e.target.value)}
                className="border px-4 py-2 rounded-md w-full"
            />
        </div>
    </div>

    {/* Additional input fields... */}

    {/* Save and cancel buttons */}
    <div className="mt-4 flex justify-end">
        <button onClick={handleSave} className="px-4 py-2 bg-green-300 text-white rounded-md mr-2">Save</button>
        <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
    </div>
</div>

        </div>
    );
};

export default InModel;

