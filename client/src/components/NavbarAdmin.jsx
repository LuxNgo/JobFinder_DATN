import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "antd";
import { Layout, Menu, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logOrNot } from "../actions/UserActions";
import { logoutClearState } from "../slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineDashboard, MdDoneAll } from "react-icons/md";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

const { Header } = Layout;

export const NavbarAdmin = () => {
  const { isLogin, me } = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    dispatch(logOrNot());
    navigate("/");
    toast.success("Đăng xuất thành công!");
    dispatch(logoutClearState());
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <FaUserCircle size={16} className="text-primary-600" /> Hồ sơ của tôi
        </Link>
      </Menu.Item>
      {me?.role === "admin" && (
        <Menu.Item key="dashboard">
          <Link to="/admin/dashboard">
            <MdOutlineDashboard size={16} className="text-primary-600" /> Quản
            trị
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="applied">
        <Link to="/applied">
          <MdDoneAll size={16} className="text-primary-600" /> Việc đã ứng tuyển
        </Link>
      </Menu.Item>
      <Menu.Item key="saved">
        <Link to="/saved">
          <FaSave size={16} className="text-primary-600" /> Việc đã lưu
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} className="text-red-600">
        <RiLogoutBoxFill size={16} className="text-red-600" /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className={`fixed top-0 z-50 w-full ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      } transition-all duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 h-[68px]">
        <Link to="/" className="flex items-center gap-2">
          <MdOutlineDashboard size={30} className="text-blue-600" />
          <span className="text-xl font-bold text-blue-600">JOBFINDER</span>
        </Link>

        {isLogin ? (
          <Dropdown
            overlay={userMenu}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <Avatar src={me.avatar.url} size={40} className="cursor-pointer" />
          </Dropdown>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </Header>
  );
};
