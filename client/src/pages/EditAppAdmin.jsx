import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAppData } from "../actions/AdminActions";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { updateApplication } from "../actions/AdminActions";
import { Sidebar } from "../components/Sidebar";
import { HiOutlineSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { useDisclosure } from "@mantine/hooks";
import {
  FaFileAlt,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
} from "react-icons/fa";
import { Modal } from "@mantine/core";

export const EditAppAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, applicationData } = useSelector((state) => state.admin);
  const [status, setStatus] = useState("not");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    dispatch(getAppData(id));
  }, []);

  const updateStatusHandler = () => {
    const data = {
      status,
    };
    dispatch(updateApplication(id, data));
  };

  const toUpperFirst = (str = "") => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) {
      return "Invalid date format";
    }
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    return `${day}-${month}-${year}`;
  };

  function extractTime(inputString) {
    const dateTimeObj = new Date(inputString);
    const hours = dateTimeObj.getHours();
    const minutes = dateTimeObj.getMinutes();
    const seconds = dateTimeObj.getSeconds();
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const time12hr = `${hours12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;
    return time12hr;
  }

  return (
    <>
      <MetaData title="Cập nhật ứng tuyển" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-14 md:px-20 px-3">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <Sidebar />
            <div className="max-w-4xl mx-auto py-16">
              <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-blue-500 text-3xl animate-pulse" />
                  <h2 className="text-3xl font-bold text-blue-700 uppercase">
                    Đơn ứng tuyển
                  </h2>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                        Chi tiết công việc
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="mr-2" />
                        <span className="font-medium">Vị trí:</span>
                        <div className="text-gray-900">
                          {applicationData.jobTitle}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBuilding className="mr-2" />
                        <span className="font-medium">Công ty:</span>
                        <div className="text-gray-900">
                          {applicationData.jobCompany}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="font-medium">Địa chỉ:</span>
                        <div className="text-gray-900">
                          {applicationData.jobLocation}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="mr-2" />
                        <span className="font-medium">Kinh nghiệm:</span>
                        <div className="text-gray-900">
                          {applicationData.jobExperience}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                      Chi tiết người ứng tuyển
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="mr-2" />
                        <span className="font-medium">Tên:</span>
                        <div className="text-gray-900">
                          {applicationData.applicantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="mr-2" />
                        <span className="font-medium">Email:</span>
                        <div className="text-gray-900">
                          {applicationData.applicantEmail}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700 gap-2">
                        <FaFileAlt className="mr-2" />
                        <span className="font-medium">Hồ sơ:</span>
                        <button
                          onClick={open}
                          className="flex items-center text-blue-400 hover:text-blue-700 underline transition-colors"
                        >
                          Xem CV
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                      Trạng thái
                    </h3>
                    <div className="flex items-center gap-2">
                      <FaClock className="mr-2" />
                      <span className="font-medium">Hiện tại:</span>
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          applicationData.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : applicationData.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {applicationData.status === "pending" ? (
                          <FaClock className="text-blue-700" />
                        ) : applicationData.status === "rejected" ? (
                          <FaTimesCircle className="text-red-700" />
                        ) : (
                          <FaCheckCircle className="text-green-700" />
                        )}
                        {toUpperFirst(applicationData.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                      Thông tin thời gian
                    </h3>
                    <div className="flex items-center gap-2">
                      <FaCalendarCheck className="mr-2" />
                      <span className="font-medium">Tạo lúc:</span>
                      <div className="text-gray-900">
                        {convertDateFormat(
                          applicationData.createdAt.substr(0, 10)
                        )}{" "}
                        vào {extractTime(applicationData.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="mr-2" />
                        <span className="font-medium">Trạng thái:</span>
                        <select
                          onChange={(e) => setStatus(e.target.value)}
                          value={status}
                          className="block w-42 px-4 py-2.5 text-base border border-blue-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="not" disabled selected>
                            Chọn trạng thái
                          </option>
                          <option value="accepted">Chấp nhận</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={updateStatusHandler}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full"
                      >
                        Cập nhật
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal opened={opened} onClose={close} title="Xem CV" size="xl" centered>
        <img src={applicationData?.applicantResume.url} alt="CV" />
      </Modal>
    </>
  );
};
