import React from "react";
import { IoCartSharp } from "react-icons/io5";
const Card = () => {
  // Dummy data
  const products = [
    { id: 1, name: "Stock", price: "$10",lable:"sale" },
   
  ];
  return (
    <div className="container">
      <div className="card bg-white
     rounded-lg shadow-md  p-5 gap-5 grid-col-2 border-t-2 border-[#fa983d]">
        <div className="title">
          {/* <h2 className="text-lg font-bold">Products</h2> */}
        </div>
        <div className="content mt-2">
          {/* Mapping through dummy data */}
          {products.map(product => (
         <div key={product.id} className="product flex justify-between">
            <div className="left">
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.price}</p>
            </div>
            <div class="bg-gray rounded-full h-12 w-12 flex justify-center items-center border border-white shadow-md">
  <IoCartSharp class="text-lg h-6 w-6" />
</div>

          </div>
          
         
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
