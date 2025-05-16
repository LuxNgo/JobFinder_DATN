import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mantine/core";
import { Menu } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { logOrNot } from "../actions/UserActions";
import { logoutClearState } from "../slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useIsMobile from "../hooks/useIsMobile";

// Biểu tượng
import {
  MdOutlineBusinessCenter,
  MdOutlineDashboard,
  MdDoneAll,
} from "react-icons/md";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

export const Navbar = () => {
  const { isLogin, me } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Xử lý hiệu ứng cuộn
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu mobile khi đổi trang
  useEffect(() => {
    setToggle(false);
  }, [location]);

  const LogOut = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    dispatch(logOrNot());
    navigate("/");
    toast.success("Đăng xuất thành công!");
    dispatch(logoutClearState());
  };

  const navLinks = [
    { path: "/", label: "Trang chủ" },
    ...(me.role === "recruiter"
      ? [{ path: "/recruiter/dashboard", label: "Quản lý" }]
      : []),
    { path: "/jobs", label: "Việc làm" },
    { path: "cv-builder", label: "Viết CV" },
    { path: "/contact", label: "Liên hệ" },
    { path: "/about", label: "Giới thiệu" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "shadow-header backdrop-blur-sm bg-white/90" : "bg-white"
      }`}
    >
      <nav className="flex h-[68px] px-4 lg:px-8 items-center">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:no-underline group transition-transform duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-lg bg-gradient-primary group-hover:shadow-lg transition-all duration-300">
              <MdOutlineBusinessCenter className="text-white" size={24} />
            </div>
            <span className="font-montserrat font-semibold text-18 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              JOBFINDER
            </span>
          </Link>

          {/* Menu desktop */}
          {!isMobile && (
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-1 text-text-primary hover:text-primary-600 transition-colors duration-300
                                        ${
                                          isActivePath(link.path)
                                            ? "text-primary-600"
                                            : ""
                                        }
                                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                                        after:bg-primary-600 after:scale-x-0 after:origin-right after:transition-transform
                                        hover:after:scale-x-100 hover:after:origin-left
                                        ${
                                          isActivePath(link.path)
                                            ? "after:scale-x-100"
                                            : ""
                                        }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Khu vực xác thực */}
          <div className="flex items-center gap-4">
            {isLogin ? (
              <Menu
                shadow="lg"
                width={240}
                position="bottom-end"
                transition="scale-y"
                transitionDuration={200}
              >
                <Menu.Target>
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-50 transition-colors duration-300">
                    <Avatar
                      className="border-2 border-primary-500 shadow-sm"
                      radius="xl"
                      size={40}
                      src={me.avatar.url}
                      alt="Hồ sơ"
                    />
                    {!isMobile && (
                      <span className="text-text-primary font-medium">
                        {me.name}
                      </span>
                    )}
                  </button>
                </Menu.Target>

                <Menu.Dropdown className="p-2">
                  <Menu.Item
                    component={Link}
                    to="/profile"
                    icon={
                      <FaUserCircle size={16} className="text-primary-600" />
                    }
                    className="p-2 hover:bg-neutral-50 rounded-lg"
                  >
                    Hồ sơ của tôi
                  </Menu.Item>
                  {me.role === "admin" && (
                    <Menu.Item
                      component={Link}
                      to="/admin/dashboard"
                      icon={
                        <MdOutlineDashboard
                          size={16}
                          className="text-primary-600"
                        />
                      }
                      className="p-2 hover:bg-neutral-50 rounded-lg"
                    >
                      Quản trị
                    </Menu.Item>
                  )}
                  <Menu.Item
                    component={Link}
                    to="/applied"
                    icon={<MdDoneAll size={16} className="text-primary-600" />}
                    className="p-2 hover:bg-neutral-50 rounded-lg"
                  >
                    Việc đã ứng tuyển
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to="/saved"
                    icon={<FaSave size={16} className="text-primary-600" />}
                    className="p-2 hover:bg-neutral-50 rounded-lg"
                  >
                    Việc đã lưu
                  </Menu.Item>
                  <Menu.Divider className="my-2" />
                  <Menu.Item
                    onClick={LogOut}
                    icon={
                      <RiLogoutBoxFill size={16} className="text-destructive" />
                    }
                    className="p-2 hover:bg-destructive/5 rounded-lg text-destructive"
                  >
                    Đăng xuất
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:bg-primary-500/5 rounded-lg transition-all duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Nút menu mobile */}
            {isMobile && (
              <button
                onClick={() => setToggle(!toggle)}
                className="p-2 hover:bg-neutral-50 rounded-lg transition-colors duration-300"
                aria-label="Bật/tắt menu"
              >
                {toggle ? (
                  <HiX size={24} className="text-text-primary" />
                ) : (
                  <HiMenu size={24} className="text-text-primary" />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMobile && (
        <div
          className={`fixed inset-0 top-[68px] bg-white/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${
            toggle ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="container mx-auto py-6">
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${
                    isActivePath(link.path)
                      ? "text-primary-600"
                      : "text-text-primary hover:text-primary-600"
                  } transition-colors duration-300`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
