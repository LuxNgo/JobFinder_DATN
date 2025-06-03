import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getSingleJob, saveJob } from "../actions/JobActions";
import { createApplication, removeAppliedJob } from "../actions/ApplicationActions";
import { BiBriefcase, BiBuildings } from "react-icons/bi";
import { AiOutlineSave } from "react-icons/ai";
import { HiStatusOnline } from "react-icons/hi";
import { BsPersonWorkspace, BsSend } from "react-icons/bs";
import { TbLoader2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Dialog from "../components/Dialog/Dialog";

export const JobDetails = () => {
  const dispatch = useDispatch();
  const { jobDetails, loading, saveJobLoading } = useSelector(
    (state) => state.job
  );
  const { me, isLogin } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(getSingleJob(id));
  }, [dispatch, id]);

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) return "Định dạng ngày không hợp lệ";
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const appliedJobHandler = () => {
    const isUnapply = me.appliedJobs && me.appliedJobs.includes(jobDetails._id);
    if (isUnapply) {
      dispatch(removeAppliedJob(jobDetails._id));
    } else {
      dispatch(createApplication(jobDetails._id));
    }
  };

  const handleApply = () => {
    if (me.appliedJobs && me.appliedJobs.includes(jobDetails._id)) {
      // User has already applied, cancel application
      dispatch(removeAppliedJob(jobDetails._id));
    } else {
      // User hasn't applied yet, show confirmation dialog
      setIsConfirmOpen(true);
    }
  };

  const confirmApply = () => {
    setIsConfirmOpen(false);
    appliedJobHandler();
  };

  const saveJobHandler = () => {
    dispatch(saveJob(id));
  };

  const notLoginHandler = (str) => {
    if (!isLogin) {
      toast.info(`Vui lòng đăng nhập để ${str} công việc`);
      navigate("/login");
    }
  };

  return (
    <>
      <MetaData title="Chi Tiết Công Việc" />
      <div className="bg-white min-h-screen pt-14 md:px-20 text-gray-800">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Back Button */}

            {jobDetails && (
              <div className="max-w-4xl mx-auto my-10">
                <Link
                  to="/jobs"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Jobs
                </Link>
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                      <img
                        src={jobDetails.companyLogo.url}
                        className="max-w-full max-h-full object-contain"
                        alt={jobDetails.companyName}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <BiBriefcase className="text-blue-600" />
                        {jobDetails.title}
                      </h1>
                      <h2 className="text-xl md:text-2xl flex items-center gap-2 text-gray-700">
                        <BiBuildings className="text-gray-600" />
                        {jobDetails.companyName}
                      </h2>
                      <p className="text-lg flex items-center gap-2">
                        <BsPersonWorkspace
                          size={20}
                          className="text-gray-600"
                        />
                        {jobDetails.employmentType}
                      </p>
                      <div className="flex items-center gap-2">
                        <HiStatusOnline size={20} className="text-gray-600" />
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            jobDetails.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {jobDetails.status === "active"
                            ? "Đang tuyển"
                            : "Ngưng tuyển"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Thông Tin Chi Tiết
                  </h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Người đăng:</span>
                        <span>{jobDetails.postedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Ngày đăng:</span>
                        <span>
                          {convertDateFormat(
                            jobDetails.createdAt.substr(0, 10)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Địa điểm:</span>
                        <span>{jobDetails.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Mức lương:</span>
                        <span className="flex items-center">
                          {jobDetails.salary} VNĐ
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Kinh nghiệm:</span>
                        <span>{jobDetails.experience}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-semibold mb-2">Kỹ năng yêu cầu:</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobDetails.skillsRequired.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-semibold mb-2">Mô tả công việc:</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {jobDetails.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => {
                        isLogin ? handleApply() : notLoginHandler("ứng tuyển");
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <BsSend />
                      {me.appliedJobs && me.appliedJobs.includes(jobDetails._id)
                        ? "Huỷ ứng tuyển"
                        : "Ứng tuyển"}
                    </button>

                    <Dialog
                      isOpen={isConfirmOpen}
                      onClose={() => setIsConfirmOpen(false)}
                      title="Xác nhận ứng tuyển"
                      description={`Bạn có chắc chắn muốn ứng tuyển cho vị trí`}
                      message={jobDetails.title}
                      onConfirm={confirmApply}
                      confirmText="Xác nhận"
                      cancelText="Hủy"
                    />

                    <button
                      onClick={() => {
                        isLogin ? saveJobHandler() : notLoginHandler("lưu");
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      {saveJobLoading ? (
                        <TbLoader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <AiOutlineSave />
                          {me.savedJobs && me.savedJobs.includes(jobDetails._id)
                            ? "Bỏ lưu"
                            : "Lưu"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
