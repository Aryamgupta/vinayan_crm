// import React from "react";
// import { Menu, Dropdown, Avatar, Input } from "antd";
// import { UserOutlined, SettingOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom

// const { Search } = Input;

// const Header = () => {
//   const menu = (
//     <Menu className="w-18">
//       <Menu.Item key="1" icon={<UserOutlined />}>
//         <Link to="/profile">Profile</Link> {/* Link to the profile page */}
//       </Menu.Item>
//       <Menu.Item key="2" icon={<SettingOutlined />}>
//         Settings
//       </Menu.Item>
//       <Menu.Item key="3" icon={<LogoutOutlined />}>
//         <Link to="/">Logout</Link> {/* Link to the logout page */}
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <header className="flex justify-between items-center bg-white sticky top-0 z-10 h-20 shadow-md px-3">
//       <div className="flex items-center">
//         <Search
//           placeholder="Search"
//           style={{ width: 200 }}
//           // You can define onChange and other properties as per your requirement
//         />
//       </div>
//       <div>
//         <Dropdown overlay={menu} trigger={["click"]}>
//           <Avatar size={45} icon={<UserOutlined />} style={{ backgroundColor: 'red' }} />
//         </Dropdown>
//       </div>
//     </header>
//   );
// };

// export default Header;
