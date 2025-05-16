import React, { useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  MdOutlineAdd,
  MdOutlineBusinessCenter,
  MdOutlineCreateNewFolder,
  MdOutlineDashboard,
  MdOutlineFeaturedPlayList,
  MdOutlineLogout,
} from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdSunny } from "react-icons/io";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOrNot } from "../actions/UserActions";
import { FaArrowLeft } from "react-icons/fa";

const { Sider, Header, Content } = Layout;

export const RecruiterLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else {
      setSelectedKey(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    dispatch(logOrNot());
    navigate("/");
    toast.success("Đăng xuất thành công!");
    dispatch(logoutClearState());
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl`}
        style={{
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          zIndex: 10,
        }}
      >
        {/* Sidebar Header (Responsive) */}
        <div
          className={`h-[80px] flex flex-col items-center border-b border-gray-700 transition-all p-4`}
        >
          {collapsed ? (
            <div className="rounded-full bg-blue-600 p-3 text-center">
              <MdOutlineBusinessCenter size={28} className="text-white" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-white uppercase">
                JobFinder
              </p>
              <p className="text-sm text-blue-400">Recruiter Dashboard</p>
            </>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => handleMenuClick(e.key)}
          className="mt-2"
          style={{
            background: "transparent",
          }}
        >
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              icon: <MdOutlineDashboard size={22} />,
            },
            {
              key: "postJob",
              label: "Đăng bài",
              icon: <MdOutlineCreateNewFolder size={22} />,
            },
            {
              key: "allJobs",
              label: "Xem bài đăng",
              icon: <BsBriefcase size={22} />,
            },
            {
              key: "allApplications",
              label: "Xem ứng viên",
              icon: <MdOutlineFeaturedPlayList size={22} />,
            },
          ].map((item) => (
            <Menu.Item
              key={item.key}
              icon={
                collapsed ? (
                  <Tooltip title={item.label} placement="right">
                    {item.icon}
                  </Tooltip>
                ) : (
                  item.icon
                )
              }
              className={`text-18 transition-all duration-200 ${
                selectedKey === item.key
                  ? "font-bold bg-blue-400/30"
                  : "font-normal hover:bg-blue-400/10"
              }`}
              style={{
                borderRadius: "8px",
                margin: "6px 2px",
              }}
            >
              <Link
                to={`/recruiter/${item.key}`}
                className={`flex items-center gap-3 text-white transition-colors duration-200`}
                style={{ textDecoration: "none" }}
              >
                <span className="text-18">{item.label}</span>
              </Link>
            </Menu.Item>
          ))}

          {/* Divider */}
          <Menu.Divider className="my-4" />

          {/* Logout Item */}
          <Menu.Item
            key="logout"
            icon={
              collapsed ? (
                <Tooltip title="Đăng xuất" placement="right">
                  <MdOutlineLogout size={22} />
                </Tooltip>
              ) : (
                <MdOutlineLogout size={22} />
              )
            }
            className={`text-18 transition-all duration-200 font-normal hover:bg-red-500/20 text-red-400 hover:text-red-300`}
            style={{
              borderRadius: "8px",
              margin: "6px 2px",
            }}
            onClick={handleLogout}
          >
            <span className="text-18">Đăng xuất</span>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ flexGrow: 1 }}>
        <Header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md flex items-center justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center text-2xl font-extrabold hover:underline hover:text-white"
            >
              <FaArrowLeft className="mr-2" />
              Trở lại trang chủ
            </Link>
          </div>
        </Header>
        <Content className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
