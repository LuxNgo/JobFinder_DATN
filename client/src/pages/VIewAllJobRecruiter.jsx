import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import {
  MdOutlineModeEditOutline,
  MdOutlineSearch,
  MdOutlineAdd,
} from "react-icons/md";
import {
  AiOutlineDelete,
  AiOutlineFilter,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobsAdmin, deleteJobData } from "../actions/AdminActions";
import { Loader } from "../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HiOutlineSparkles } from "react-icons/hi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllJobsRecruiter } from "../actions/RecruiterActions";
import { SidebarRecruiter } from "../components/SidebarRecruiter";

// Export PDF function
const exportToPDF = (data) => {
  // Create PDF with UTF-8 support
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
  doc.text("Danh sach cong viec", 105, 20, { align: "center" });

  // Add date
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Ngay xuat: ${currentDate}`, 105, 30, { align: "center" });

  // Add table
  const headers = [
    { label: "ID", dataKey: "_id" },
    { label: "Tieu de", dataKey: "title" },
    { label: "Cong ty", dataKey: "companyName" },
    { label: "Dia diem", dataKey: "location" },
    { label: "Ngay dang", dataKey: "createdAt" },
    { label: "Trang thai", dataKey: "status" },
  ];

  const rows = data.map((item) => {
    return [
      item._id,
      item.title,
      item.companyName,
      item.location,
      new Date(item.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      item.status === "active" ? "Dang hoat dong" : "Khong hoat dong",
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
  const fileName = `jobs_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
  toast.success("Đã xuất file PDF thành công!");
};

export const ViewAllJobRecruiter = () => {
  const dispatch = useDispatch();
  const { loading, allJobsRecruiter } = useSelector((state) => state.recruiter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(getAllJobsRecruiter());
  }, []);

  const filteredJobs = allJobsRecruiter?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && job.status === selectedFilter;
  });

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const deleteJobHandler = async (id) => {
    try {
      setIsDeleting(true);
      await dispatch(deleteJobData(id));
      toast.success("Xóa công việc thành công !");
    } catch (error) {
      toast.error("Xóa công việc thất bại !");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <MetaData title="All Jobs" />
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900">
        <>
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <Loader />
            </div>
          ) : (
            <div>
              <SidebarRecruiter />

              <div className="flex justify-between items-center mb-6 pt-14">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-blue-500 text-2xl" />
                  <h1 className="text-3xl font-bold text-blue-700 uppercase">
                    Các tin tuyển dụng
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
                        exportToPDF(filteredJobs);
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
                        Filter Jobs
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
                          Status
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
                            All
                          </button>
                          <button
                            onClick={() => setSelectedFilter("active")}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                              selectedFilter === "active"
                                ? "bg-green-500 text-white"
                                : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            Active
                          </button>
                          <button
                            onClick={() => setSelectedFilter("inactive")}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                              selectedFilter === "inactive"
                                ? "bg-red-500 text-white"
                                : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            Inactive
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Ngày đăng
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

              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-5"></div>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-800 uppercase bg-blue-200">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>ID</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Tên Công Việc</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Công ty</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Địa chỉ</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Ngày Đăng</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Status</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <span>Thao Tác</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs?.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-8 text-blue-500"
                          >
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="text-4xl text-blue-400">
                                <MdOutlineSearch />
                              </div>
                              <p className="text-lg">
                                Không tìm thấy công việc
                              </p>
                              <p className="text-gray-500">
                                Thử điều chỉnh các bộ lọc hoặc từ tìm kiếm
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredJobs?.map((job, i) => (
                          <motion.tr
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-blue-200 bg-white hover:bg-blue-50 transition-colors duration-300"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium whitespace-nowrap"
                            >
                              {job._id}
                            </th>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-blue-700">
                                  {job.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span>{job.companyName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span>{job.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span>{convertDateFormat(job.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    job.status === "active"
                                      ? "bg-blue-500 text-white"
                                      : job.status === "inactive"
                                      ? "bg-red-500 text-white"
                                      : "bg-gray-500 text-white"
                                  }`}
                                >
                                  {job.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <Link
                                  to={`/admin/job/details/${job._id}`}
                                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300 cursor-pointer"
                                >
                                  <div className="flex items-center gap-1">
                                    <MdOutlineModeEditOutline size={20} />
                                    <span className="text-sm">Edit</span>
                                  </div>
                                </Link>
                                <button
                                  onClick={() => deleteJobHandler(job._id)}
                                  className={`text-red-500 hover:text-red-600 transition-colors duration-300 cursor-pointer ${
                                    isDeleting
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  disabled={isDeleting}
                                >
                                  <div className="flex items-center gap-1">
                                    <AiOutlineDelete size={20} />
                                    <span className="text-sm">Delete</span>
                                  </div>
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  );
};
