import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";
import Vinayan from "../../images/vinayan-logo.png";
import { BsCartDashFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { GrDatabase } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa6";

function Sidebar() {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const menuItems = [
    { path: "/records", icon: <FaCartPlus size={22}/>, label: "Material in" },
    { path: "/test", icon: <BsCartDashFill  size={22}/>, label: "Material Out" },
    // { path: "/Stock", icon: <TbListDetails size={22}/>, label: "Remaining stock" },
    { path: "/storemanagement", icon: <GrDatabase size={22}/>, label: "Store Management" },
    { path: "/orders", icon: <GrDatabase size={22}/>, label: "Order Management" },
   
   
    // { path: "/logout", icon: <MdExitToApp />, label: "Logout" },
    // Add other menu items here if needed
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <div className={`w-20.5 h-[100%] border-r border-stroke shadow-sm bg-white flex flex-col justify-between py-2`} style={{ paddingBlock: "1rem" }}>
  <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear items-center justify-center">
    <div className="text-center mb-6">
      <img
        src={Vinayan}
        alt="Company Logo"
        className="w-18 h-16 mx-auto"
      />
    </div>
    <nav>
      <div>
        <ul className="flex flex-col items-center gap-2">
          {menuItems.map((item) => (
            <li key={item.path} className="w-full">
              <NavLink
                to={item.path}
                className={`flex items-center justify-center bg-[#f8f8f8]  shadow-sm md-w-16 h-12  rounded-xl font-medium text-black duration-300 ease-in-out ${
                  pathname.includes(item.path) &&
                  'border border-stroke bg-[#fa983d]'
                  }`}
              >
                {React.cloneElement(item.icon, {
                  className: `${
                    pathname.includes(item.path) && 'text-info'
                    }`,
                })}
              </NavLink>

              <div
                className={`flex items-center  gap-2 text-lg rounded-sm duration-300 ease-in-out ${
                  pathname.includes(item.path) && 'text-white'
                  }`}
              >
                <b className="text-xs text-[#868686] inline-block justify-center text-center mx-auto">{item.label}</b>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </div>
  <div className="flex items-center justify-center">
    <button
      className="inline-flex shadow-md items-center justify-center gap-2.5 py-2 px-5 rounded-md bg-[#fa983d] font-bold text-white hover:bg-[#fa983d] "
      onClick={handleLogout}
    >
      <span>Logout</span>
    </button>
  </div>
</div>
  );
}
export default Sidebar;
