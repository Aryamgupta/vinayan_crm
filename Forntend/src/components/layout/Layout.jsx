import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Outlet } from "react-router";
import Sidemenu from "../sidebar/Sidebar";
import backimg from "../../images/backimg.jpg"
const { Header, Sider, Content } = Layout;
const LayoutPage = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical " />

        <Sidemenu />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fa983d",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 30,
            }}
          />
        </Header>
        

        <Layout
          className={`${"p-4 h-[92vh]"} bg-gray w-full overflow-auto `}
        >

          <Content>
            <main>
              <div>
                <Outlet />
              </div>
            </main>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
