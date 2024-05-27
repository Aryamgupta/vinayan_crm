import React, { useState, useEffect, useRef } from "react";
import ReactPrint from "react-to-print";
import Barcode from "react-barcode";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import Vinayan from "../../images/vinayan-logo.png";

function Invoice() {
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [Dates, setDates] = useState("");
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const ref = useRef();
  const [openAirPopup, setAirPopup] = useState(false);
  const [Item, setItem] = useState("");
  const [Amount, setAmount] = useState(0);
  const [Total, setTotal] = useState(0);
  const [List, setList] = useState([]);
  const [Name, setName] = useState("");
  const [Contact, setContact] = useState("");

  useEffect(() => {
    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;
    setDates(date);
  }, []);

  const addData = () => {
    setList((prevList) => [
      ...prevList,
      {
        product: Item,
        amount: Amount,
      },
    ]);
    setItem("");
    setAmount("");
    setAirPopup(false);
  };

  const Create = () => {
    setOpenCreatePopup(false);
  };

  let sum = 0;
  List.forEach((amount) => {
    sum += parseInt(amount.amount);
  });

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className=" border border-blue-400 h-12 w-40 indent-2 rounded"
            placeholder="Invoice Number"
            value={InvoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <button
            className=" w-24 h-12 bg-black text-white rounded hover:bg-black transition duration-500"
            onClick={() => setOpenCreatePopup(true)}
          >
            Create ➡️
          </button>
        </div>
      </div>

      <Dialog open={openCreatePopup}>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Create Invoice</div>
            <Close
              className="cursor-pointer"
              onClick={() => setOpenCreatePopup(false)}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <div
            className="bg-white border-y-8 border-black my-8 py-10 px-12 w-full shadow-md text-xs"
            ref={ref}
          >
            <div>
              <div className="flex justify-between">
                <div className="text-center mb-6">
                  <img
                    src={Vinayan}
                    alt="Company Logo"
                    className="w-18 h-16 mx-auto"
                  />
                </div>
                <div className="text-right">
                  <h4 className="text-orange-500 font-bold">
                    Vinayan Consulting PVT LTD
                  </h4>
                  <p>(+91) 1234567890</p>
                  <p>info@gmail.com</p>
                </div>
              </div>
              <div className="text-center my-4 flex gap-4">
                <h2 className="text-orange-500">INVOICE</h2>
                <h5 className="font-bold">Id: {InvoiceNumber}</h5>
              </div>
              <table className="w-full">
                <thead className="bg-black text-white text-start">
                  <tr>
                    <th className="p-2 text-start">Products</th>
                    <th className="p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {List.length
                    ? List.map((items, index) => (
                        <tr key={index}>
                          <td className="p-2">{items.product}</td>
                          <td className="p-2">₹ {items.amount}</td>
                        </tr>
                      ))
                    : null}
                  <tr>
                    <td className="text-start p-2">
                      <p>
                        <strong>Total Amount: </strong>
                      </p>
                      <p>
                        <strong>Payable Amount: </strong>
                      </p>
                    </td>
                    <td className=" text-end p-2">
                      <p>
                        <strong>₹ {sum}</strong>
                      </p>
                      <p>
                        <strong>₹ {sum}</strong>
                      </p>
                    </td>
                  </tr>
                  <tr className="text-red-500">
                    <td className="text-right text-lg p-2">
                      <strong>Total:</strong>
                    </td>
                    <td className="text-left text-lg p-2">
                      <strong>₹ {sum}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <p>
                  <strong>Date:</strong> {Dates}
                </p>
                <p>
                  <strong>Name:</strong> {Name}
                </p>
                <p>
                  <strong>Contact:</strong> {Contact}
                </p>
              </div>
            </div>
          </div>
          <ReactPrint
            trigger={() => (
              <button className="w-24 h-8 bg-orange-500 text-white rounded hover:bg-black transition duration-500 shadow-md">
                Print
              </button>
            )}
            content={() => ref.current}
            documentTitle={`INVOICE ${InvoiceNumber}`}
          />
          <button
            className="w-24 h-8 bg-blue-700 text-white rounded hover:bg-black transition duration-500 mt-2 shadow-md"
            onClick={() => setAirPopup(true)}
            style={{ marginLeft: "10px" }} // Adjust the value as needed for the desired spacing
          >
            Add Product
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={openAirPopup}>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">New product</div>
            <Close
              className="cursor-pointer"
              onClick={() => setAirPopup(false)}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={Item}
              onChange={(e) => setItem(e.target.value)}
              className="m-2 border border-blue-400 h-12 w-50 indent-2 rounded"
              placeholder="Product Name"
            />
            <input
              type="text"
              value={Amount}
              onChange={(e) => setAmount(e.target.value)}
              className="m-2 border border-blue-400 h-12 w-50 indent-2 rounded"
              placeholder="Amount ₹"
            />
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="m-2 border border-blue-400 h-12 w-50 indent-2 rounded"
              placeholder="Name"
            />
            <input
              type="text"
              value={Contact}
              onChange={(e) => setContact(e.target.value)}
              className="m-2 border border-blue-400 h-12 w-50 indent-2 rounded"
              placeholder="Contact"
            />
            <button
              className="mt-4 w-24 h-10 bg-blue-700 text-white rounded hover:bg-black transition duration-500 shadow-md"
              onClick={addData}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Invoice;
