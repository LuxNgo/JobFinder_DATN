import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveJob } from "../actions/JobActions";
import { useDispatch } from "react-redux";
import useIsMobile from "../hooks/useIsMobile";
import { BiBuildings } from "react-icons/bi";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaBookmark, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Dialog from "./Dialog/Dialog";

export const SaveJobCard = ({ job }) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const unSaveJobHandler = () => {
    setIsConfirmOpen(true);
  };

  const confirmApply = () => {
    setIsConfirmOpen(false);
    dispatch(saveJob(job._id));
  };

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) return "Invalid date format";
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  // Ensure skills is always an array
  const skills = job.skillsRequired || job.skills || [];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E5E7EB]">
      <div className="p-8">
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-5 flex-1">
            <div>
              <Link to={`/details/${job._id}`}>
                <h2 className="text-2xl font-bold text-[#111827] hover:text-[#3803FF] transition-colors duration-300">
                  {job.title}
                </h2>
              </Link>
              <div className="mt-3 flex flex-wrap gap-4 text-[15px] text-[#4B5563]">
                <span className="flex items-center gap-2">
                  <BiBuildings className="text-[#3803FF]" />
                  {job.companyName}
                </span>
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#3803FF]" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <BsPersonWorkspace className="text-[#3803FF]" />
                  {job.employmentType}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="text-[#3803FF]" />
                  {convertDateFormat(job.createdAt?.split("T")[0] || "")}
                </span>
              </div>
            </div>

            <p
              className={`text-[#374151] text-[15px] leading-relaxed ${
                isMobile ? "line-clamp-2" : "line-clamp-3"
              }`}
            >
              {job.description}
            </p>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#F3F4F6] text-[#111827] rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-4 py-2 bg-[#F3F4F6] text-[#111827] rounded-lg text-sm font-medium">
                    +{skills.length - 4} thêm
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 min-w-[140px]">
            <Link
              to={`/details/${job._id}`}
              className="px-6 py-3 bg-[#3803FF] text-white rounded-xl hover:bg-[#2601B7] transition-all duration-300 text-center text-[15px] font-semibold shadow-sm hover:shadow-md"
            >
              Ứng tuyển ngay
            </Link>
            <button
              onClick={unSaveJobHandler}
              className="px-6 py-3 bg-[#F3F4F6] text-[#111827] rounded-xl hover:bg-[#E5E7EB] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] font-semibold"
            >
              <FaBookmark className="text-[#3803FF]" />
              Hủy lưu
            </button>
          </div>
          <Dialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            title="Hủy lưu"
            description={`Bạn có chắc chắn muốn hủy lưu công việc`}
            message={job.title}
            onConfirm={confirmApply}
            confirmText="Xác nhận"
            cancelText="Hủy"
            type="error"
          />
        </div>
      </div>
    </div>
  );
};
