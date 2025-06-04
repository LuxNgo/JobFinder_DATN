import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { getUserData, updateUser } from "../actions/AdminActions";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlinePerson } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const SelectField = ({ icon: Icon, ...props }) => (
  <motion.div className="bg-white flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="text-blue-500">
      <Icon size={20} />
    </div>
    <select
      {...props}
      className="outline-none w-full text-gray-900 px-1 py-2 placeholder:text-gray-400 placeholder:font-medium transition-all duration-200"
    />
  </motion.div>
);

export const EditUserAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, userData } = useSelector((state) => state.admin);
  const [role, setRole] = useState("not");

  useEffect(() => {
    dispatch(getUserData(id));
  }, []);

  const updateRolehandler = () => {
    if (role === "not") {
      toast.info("Vui lòng chọn vai trò !");
      return;
    }

    const newRoleSelected = role.toLowerCase();

    // Prevent changing an Admin's role to something else
    if (userData.role === "admin" && newRoleSelected !== "admin") {
      toast.warn("Không thể thay đổi vai trò của Quản trị viên.");
    } 
    // Prevent downgrading a Recruiter to an Applicant directly via this form
    else if (userData.role === "recruiter" && newRoleSelected === "applicant") {
      toast.warn(
        "Không thể trực tiếp hạ cấp Nhà tuyển dụng thành Ứng viên. Vui lòng quản lý gói dịch vụ của họ hoặc sử dụng quy trình khác nếu cần thu hồi vai trò."
      );
    } 
    // Proceed with the update if no specific restrictions are met
    else {
      // Check if the role is actually changing to avoid unnecessary dispatch and toast
      if (userData.role === newRoleSelected) {
        toast.info("Người dùng đã có vai trò này.");
        setRole("not"); // Reset dropdown
        return;
      }
      dispatch(updateUser(id, { role: newRoleSelected }));
      setRole("not"); // Reset dropdown
      toast.success("Vai trò đã được cập nhật thành công!");
    }
  };

  return (
    <>
      <MetaData title="Cập nhật vai trò người dùng" />
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div>
            {/* Back Button */}
            <Link
              to="/admin/allUsers"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <FaArrowLeft className="mr-2" />
              Back to
            </Link>
            <div className="flex flex-col w-full justify-center items-center gap-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <HiOutlineSparkles className="text-blue-500 text-3xl animate-pulse" />
                <h2 className="text-3xl font-bold text-blue-700 uppercase">
                  Cập nhật vai trò người dùng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
                  <div className="text-xl font-semibold mb-4">
                    Thông tin người dùng
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tên:</span>
                      <span className="font-medium">{userData.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{userData.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vai trò hiện tại:</span>
                      <span className="font-medium">{userData.role}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
                  <div className="text-xl font-semibold mb-4">
                    Cập nhật vai trò
                  </div>
                  <div className="flex flex-col gap-4">
                    <SelectField
                      icon={MdOutlinePerson}
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                    >
                      <option value="not" selected>
                        Chọn vai trò mới
                      </option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="applicant">Applicant</option>
                    </SelectField>
                    <button
                      onClick={updateRolehandler}
                      className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Cập nhật vai trò
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
