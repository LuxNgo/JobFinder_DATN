import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { MdOutlineModeEditOutline, MdOutlineSearch } from "react-icons/md";
import {
  AiOutlineDelete,
  AiOutlineCloudDownload,
  AiOutlineFilter,
} from "react-icons/ai";
import { getAllAppAdmin, deleteApp } from "../actions/AdminActions";
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
  doc.text("Danh sách ứng tuyển", 105, 20, { align: "center" });

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
    { label: "ID ứng tuyển", dataKey: "_id" },
    { label: "Tên công việc", dataKey: "jobTitle" },
    { label: "Ứng viên", dataKey: "applicantName" },
    { label: "Trạng thái", dataKey: "status" },
    { label: "Ngày tạo", dataKey: "createdAt" },
  ];

  const rows = data.map((item) => {
    return [
      item._id,
      item.jobTitle,
      item.applicantName,
      item.status === "pending"
        ? "Đang chờ"
        : item.status === "rejected"
        ? "Từ chối"
        : "Đã chấp nhận",
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
  const fileName = `applications_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
  toast.success("Đã xuất file PDF thành công!");
};

export const ViewAllAppli = () => {
  const dispatch = useDispatch();
  const { loading, allApplications } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(getAllAppAdmin());
  }, []);

  const filteredApplications = allApplications?.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilter === "all" || app.status === selectedFilter;

    const matchesDate =
      !startDate ||
      !endDate ||
      (new Date(app.createdAt) >= new Date(startDate) &&
        new Date(app.createdAt) <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const deleteApplication = async (id) => {
    try {
      await dispatch(deleteApp(id));
      toast.success("Ứng tuyển đã được xóa");
    } catch (error) {
      toast.error("Không thể xóa ứng tuyển");
    }
  };

  return (
    <>
      <MetaData title="Quản lý ứng tuyển" />
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
                  Quản lý ứng tuyển
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-white hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors duration-300 border border-blue-200 shadow-sm text-blue-700 hover:text-blue-900"
                  >
                    <AiOutlineFilter className="text-blue-500" />
                    <span>Bộ lọc</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(filteredApplications);
                    }}
                    className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-green-600 shadow-sm"
                  >
                    <AiOutlineCloudDownload className="text-white" />
                    <span>Xuất PDF</span>
                  </button>
                </div>
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
                      Filter Applications
                    </h3>
                    <button
                      onClick={() => {
                        setIsFilterOpen(false);
                        setSearchQuery("");
                        setSelectedFilter("all");
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Trạng thái
                      </label>
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
                          onClick={() => setSelectedFilter("pending")}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            selectedFilter === "pending"
                              ? "bg-blue-500 text-white"
                              : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          Đang chờ
                        </button>
                        <button
                          onClick={() => setSelectedFilter("rejected")}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            selectedFilter === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => setSelectedFilter("accepted")}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            selectedFilter === "accepted"
                              ? "bg-green-500 text-white"
                              : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          Đã chấp nhận
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Ngày tạo
                      </label>
                      <div className="flex gap-4">
                        <div className="relative">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="relative overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-900 uppercase bg-blue-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      ID ứng tuyển
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Tên công việc
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Ứng viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Trạng thái
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
                  {filteredApplications?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-blue-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="text-4xl text-blue-400">
                            <MdOutlineSearch />
                          </div>
                          <p className="text-lg">Không tìm thấy ứng tuyển</p>
                          <p className="text-gray-500">
                            Thử điều chỉnh các bộ lọc hoặc từ tìm kiếm
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredApplications?.length > 0 &&
                    filteredApplications
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((app, i) => (
                        <tr
                          key={i}
                          className="bg-white border-b hover:bg-blue-50"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {app._id}
                          </th>
                          <td className="px-6 py-4">{app.jobTitle}</td>
                          <td className="px-6 py-4">{app.applicantName}</td>
                          <td
                            className={`px-6 py-4 ${
                              app.status === "pending"
                                ? "text-blue-500"
                                : app.status === "rejected"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {app.status === "pending"
                              ? "Đang chờ"
                              : app.status === "rejected"
                              ? "Từ chối"
                              : "Đã chấp nhận"}
                          </td>
                          <td className="px-6 py-4">
                            {convertDateFormat(app.createdAt)}
                          </td>
                          <td className="px-6 py-4 flex gap-4 items-center">
                            <Link
                              to={`/admin/update/application/${app._id}`}
                              className="text-blue-500 hover:text-blue-400 cursor-pointer flex items-center gap-2"
                            >
                              <MdOutlineModeEditOutline size={20} />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => deleteApplication(app._id)}
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
