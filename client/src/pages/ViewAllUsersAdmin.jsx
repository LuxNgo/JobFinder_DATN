import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { MdOutlineModeEditOutline, MdOutlineSearch } from "react-icons/md";
import {
  AiOutlineDelete,
  AiOutlineCloudDownload,
  AiOutlineFilter,
} from "react-icons/ai";
import { getAllUsersAdmin, deleteUser } from "../actions/AdminActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineSparkles } from "react-icons/hi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

// Export PDF function
const exportToPDF = (data) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
  });

  // Add header
  doc.setFontSize(16);
  doc.setTextColor(30);
  doc.text("Danh sách người dùng", 105, 20, { align: "center" });

  // Add date
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Ngày xuất: ${currentDate}`, 105, 30, { align: "center" });

  // Add table
  const headers = [
    { label: "ID người dùng", dataKey: "_id" },
    { label: "Tên", dataKey: "name" },
    { label: "Vai trò", dataKey: "role" },
    { label: "Ngày tạo", dataKey: "createdAt" },
  ];

  const rows = data.map((item) => {
    return [
      item._id,
      item.name,
      item.role,
      new Date(item.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    ];
  });

  // Use autotable with the correct syntax
  autoTable(doc, {
    head: [headers.map((h) => [h.label])],
    body: rows,
    startY: 40,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 2,
      halign: "center",
    },
    headStyles: {
      fillColor: [0, 120, 215],
      textColor: 255,
      fontSize: 11,
      halign: "center",
    },
  });

  // Save PDF
  const fileName = `users_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
  toast.success("Đã xuất file PDF thành công!");
};

export const ViewAllUsersAdmin = () => {
  const dispatch = useDispatch();
  const { loading, allUsers } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllUsersAdmin());
  }, []);

  const deleteUserHandler = async (id) => {
    try {
      await dispatch(deleteUser(id));
      toast.success("Xóa người dùng thành công");
    } catch (error) {
      toast.error("Xóa người dùng thất bại");
    }
  };

  const filteredUsers = allUsers?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase()?.includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedFilter === "all" || user.role === selectedFilter;

    return matchesSearch && matchesRole;
  });

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <MetaData title="Quản lý người dùng" />
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="text-blue-500 text-2xl" />
                <h1 className="text-3xl font-bold text-blue-700 uppercase">
                  Quản lý người dùng
                </h1>
              </div>
              <div className="flex gap-4">
                <div className="relative bg-white">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-gray-900 rounded-lg px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-blue-200 shadow-sm"
                  />
                  <MdOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 transition-transform duration-300" />
                </div>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors duration-300 border border-blue-200 shadow-sm text-blue-700 hover:text-blue-900"
                >
                  <AiOutlineFilter className="text-blue-500" />
                  <span>Bộ lọc</span>
                </button>
                <button
                  onClick={() => exportToPDF(filteredUsers)}
                  className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-green-600 shadow-sm"
                >
                  <AiOutlineCloudDownload className="text-white" />
                  <span>Xuất PDF</span>
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-4 rounded-xl mb-6 shadow-lg border border-blue-200"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-blue-700">
                      Filter Users
                    </h3>
                    <button
                      onClick={() => {
                        setIsFilterOpen(false);
                        setSearchQuery("");
                        setSelectedFilter("all");
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedFilter("all")}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        selectedFilter === "all"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setSelectedFilter("admin")}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        selectedFilter === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setSelectedFilter("recruiter")}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        selectedFilter === "recruiter"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      Recruiter
                    </button>
                    <button
                      onClick={() => setSelectedFilter("applicant")}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        selectedFilter === "applicant"
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      Applicant
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="relative overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-900 uppercase bg-blue-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      ID người dùng
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Tên
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Vai trò
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-blue-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="text-4xl text-blue-400">
                            <MdOutlineSearch />
                          </div>
                          <p className="text-lg">Không tìm thấy người dùng</p>
                          <p className="text-gray-500">
                            Thử điều chỉnh bộ lọc hoặc từ tìm kiếm
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers?.length > 0 &&
                    filteredUsers
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((user, i) => (
                        <tr
                          key={i}
                          className="bg-white border-b hover:bg-blue-50"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {user._id}
                          </th>
                          <td className="px-6 py-4">{user.name}</td>
                          <td className="px-6 py-4 first-letter:capitalize">
                            {user.role}
                          </td>
                          <td className="px-6 py-4">
                            {convertDateFormat(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 flex gap-4 items-center">
                            <Link
                              to={`/admin/user/role/${user._id}`}
                              className="text-blue-500 hover:text-blue-400 cursor-pointer flex items-center gap-2"
                            >
                              <MdOutlineModeEditOutline size={20} />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => deleteUserHandler(user._id)}
                              className="text-red-500 hover:text-red-400 cursor-pointer flex items-center gap-2"
                            >
                              <AiOutlineDelete size={20} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
