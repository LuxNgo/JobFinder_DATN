import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { MetaData } from "../components/MetaData";
import {
  getSingleApplication,
  deleteApplication,
} from "../actions/ApplicationActions";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaClock,
  FaTrash,
  FaArrowLeft,
  FaSuitcase,
  FaGraduationCap,
} from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export const ApplicationDetails = () => {
  const { loading, applicationDetails } = useSelector(
    (state) => state.application
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const deleteApplicationHandler = () => {
    dispatch(deleteApplication(id));
    navigate("/applied");
  };

  useEffect(() => {
    dispatch(getSingleApplication(id));
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <>
      <MetaData title="Application Details" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-10">
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Back Button */}
              <Link
                to="/applied"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
              >
                <FaArrowLeft className="mr-2" />
                Back to Applications
              </Link>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white px-8 py-6">
                  <h1 className="text-2xl font-bold">Application #{id}</h1>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        applicationDetails?.status
                      )}`}
                    >
                      {applicationDetails?.status === "pending"
                        ? "Đang xử lý"
                        : applicationDetails?.status === "accepted"
                        ? "Đã chấp nhận"
                        : "Đã từ chối"}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  {/* Job Details Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaBriefcase className="mr-2" />
                      Chi tiết công việc
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                      <div className="flex items-center text-gray-700">
                        <FaSuitcase className="mr-2" />
                        <span className="font-medium w-32">Vị trí:</span>
                        <span>{applicationDetails?.jobTitle}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaBuilding className="mr-2" />
                        <span className="font-medium w-32">Công ty:</span>
                        <span>{applicationDetails?.jobCompany}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="font-medium w-32">Địa chỉ:</span>
                        <span>{applicationDetails?.jobLocation}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaGraduationCap className="mr-2" />
                        <span className="font-medium w-32">Kinh nghiệm:</span>
                        <span>{applicationDetails?.jobExperience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaUser className="mr-2" />
                      Chi tiết người ứng tuyển
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                      <div className="flex items-center text-gray-700">
                        <FaUser className="mr-2" />
                        <span className="font-medium w-32">Tên:</span>
                        <span>{applicationDetails?.applicantName}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaEnvelope className="mr-2" />
                        <span className="font-medium w-32">Email:</span>
                        <span>{applicationDetails?.applicantEmail}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaFileAlt className="mr-2" />
                        <span className="font-medium w-32">Hồ sơ:</span>
                        <button
                          onClick={open}
                          className="flex items-center text-blue-400 hover:text-blue-700 underline transition-colors"
                        >
                          View Resume
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaClock className="mr-2" />
                      Lịch sử ứng tuyển
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium">Tạo:</span>
                        <span className="ml-2">
                          {formatDateTime(applicationDetails?.createdAt).date}{" "}
                          at{" "}
                          {formatDateTime(applicationDetails?.createdAt).time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={deleteApplicationHandler}
                      className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <TbLoader2 className="animate-spin mx-2" size={20} />
                      ) : (
                        <>
                          <FaTrash className="mr-2" />
                          Xóa đơn
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <Modal
                opened={opened}
                onClose={close}
                title="Xem CV"
                size="xl"
                centered
              >
                <img src={applicationDetails?.applicantResume.url} alt="CV" />
              </Modal>
            </>
          )}
        </div>
      </div>
    </>
  );
};
