import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineFeaturedPlayList } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

const { Sider, Header, Content } = Layout;

export const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const handleMenuClick = (key) => {
    setSelectedKey(key);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        className="bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg"
        style={{
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Sidebar Header */}
        <div
          className={`flex flex-col items-center justify-center py-8 border-b border-gray-700 ${
            collapsed ? "px-2" : "px-4"
          }`}
        >
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-blue-500">JF</span>
              <span className="text-sm text-gray-400">Admin</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-bold text-blue-500">
                JobFinder
              </span>
              <span className="text-sm text-gray-400">Admin Dashboard</span>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => handleMenuClick(e.key)}
          className="mt-4"
          style={{
            background: "transparent",
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              icon: <MdOutlineDashboard size={22} />,
            },
            {
              key: "allJobs",
              label: "Xem tất cả công việc",
              icon: <BsBriefcase size={22} />,
            },
            {
              key: "allApplications",
              label: "Xem các đơn ứng tuyển",
              icon: <MdOutlineFeaturedPlayList size={22} />,
            },
            {
              key: "allUsers",
              label: "Xem tất cả người dùng",
              icon: <AiOutlineUser size={22} />,
            },
          ].map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={`text-lg group transition-all duration-200 ${
                selectedKey === item.key ? "bg-blue-600/20" : ""
              }`}
              style={{
                background:
                  selectedKey === item.key
                    ? "rgba(59, 130, 246, 0.1)"
                    : "transparent",
                borderRadius: "8px",
                margin: "4px 0",
              }}
            >
              <Link
                to={`/admin/${item.key}`}
                className={`flex items-center gap-3 text-white group-hover:text-blue-500 transition-colors duration-200`}
                style={{ textDecoration: "none" }}
              >
                <span className="text-xl">{item.label}</span>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ flexGrow: 1 }}>
        <Header
          className="bg-white shadow-sm flex items-center justify-between px-6"
          style={{
            height: "72px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">
              Admin Dashboard
            </span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                <span className="text-blue-600">Tạo mới</span>
              </button>
            </div>
          </div>
        </Header>

        <Content
          className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-8 rounded-lg shadow-sm"
          style={{
            margin: "24px 16px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
