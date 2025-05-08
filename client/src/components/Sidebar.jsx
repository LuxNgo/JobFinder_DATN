import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineMenu } from "react-icons/ai";
import {
  MdOutlineCreateNewFolder,
  MdOutlineFeaturedPlayList,
  MdOutlineDashboard,
} from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Sidebar = () => {
  const [sideTog, setSideTog] = useState(false);
  const sidebarVariants = {
    hidden: {
      x: "-100%",
    },
    visible: {
      x: 0,
    },
  };

  return (
    <>
      <div className="fixed left-0 top-16 z-20">
        {sideTog ? (
          <button
            onClick={() => setSideTog(!sideTog)}
            className="flex items-center gap-2 p-3 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <RxCross1 size={15} />
          </button>
        ) : (
          <button
            onClick={() => setSideTog(!sideTog)}
            className="flex items-center gap-2 p-3 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <AiOutlineMenu size={15} />
          </button>
        )}
      </div>
      <motion.div
        className={`${
          sideTog ? "flex" : "hidden"
        } flex-col bg-white min-h-screen md:w-72 w-64 shadow-lg border-r border-gray-200 z-10 fixed left-0`}
        variants={sidebarVariants}
        initial="hidden"
        animate={sideTog ? "visible" : "hidden"}
        transition={{ duration: 0.1, ease: "easeIn" }}
      >
        <div className="w-full flex items-center justify-center px-4 pt-6 pb-4 border-b border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 uppercase">
              JobFinder
            </p>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-8 px-4">
          <div className="flex flex-col gap-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium hover:text-blue-600 hover:shadow-sm"
            >
              <MdOutlineDashboard className="text-blue-600" size={20} />
              Dashboard
            </Link>
            <Link
              to="/admin/postJob"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium hover:text-blue-600 hover:shadow-sm"
            >
              <MdOutlineCreateNewFolder
                className="text-blue-600 transition-colors duration-200"
                size={20}
              />
              Đăng tuyển
            </Link>
            <Link
              to="/admin/allJobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium hover:text-blue-600 hover:shadow-sm"
            >
              <BsBriefcase
                className="text-blue-600 transition-colors duration-200"
                size={20}
              />
              Xem tất cả công việc
            </Link>
            <Link
              to="/admin/allApplications"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium hover:text-blue-600 hover:shadow-sm"
            >
              <MdOutlineFeaturedPlayList
                className="text-blue-600 transition-colors duration-200"
                size={20}
              />
              Xem các đơn ứng tuyển
            </Link>
            <Link
              to="/admin/allUsers"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 text-gray-800 font-medium hover:text-blue-600 hover:shadow-sm"
            >
              <AiOutlineUser
                className="text-blue-600 transition-colors duration-200"
                size={20}
              />
              Xem tất cả người dùng
            </Link>
          </div>
        </nav>
      </motion.div>
    </>
  );
};
