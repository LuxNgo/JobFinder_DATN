import React, { useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaStar,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import { updateRoleToRecruiter } from "../actions/UserActions";
import { toast } from "react-toastify";

const benefits = [
  {
    icon: <FaRocket className="text-blue-600 w-6 h-6" />,
    title: "Tìm ứng viên chất lượng",
    description: "Truy cập hồ sơ của hàng ngàn ứng viên chất lượng cao",
  },
  {
    icon: <FaShieldAlt className="text-green-600 w-6 h-6" />,
    title: "Bảo mật thông tin",
    description: "Hệ thống bảo mật tiên tiến, đảm bảo an toàn thông tin",
  },
  {
    icon: <FaChartLine className="text-yellow-600 w-6 h-6" />,
    title: "Theo dõi hiệu quả",
    description: "Theo dõi và đánh giá hiệu quả tuyển dụng dễ dàng",
  },
];

const requirements = [
  {
    icon: <FaUsers className="text-purple-600 w-6 h-6" />,
    title: "Hoàn thành hồ sơ",
    description: "Điền đầy đủ thông tin công ty và hồ sơ tuyển dụng",
  },
  {
    icon: <FaCreditCard className="text-orange-600 w-6 h-6" />,
    title: "Thanh toán phí dịch vụ",
    description: "Thanh toán một lần để sử dụng dịch vụ tuyển dụng",
  },
  {
    icon: <FaStar className="text-yellow-600 w-6 h-6" />,
    title: "Đánh giá chất lượng",
    description: "Đánh giá chất lượng ứng viên và dịch vụ",
  },
];

export const UpgradeToRecruiter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.admin);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.href = "/recruiter/dashboard";
      }, 2000);
    }
  }, [success]);

  const updateRolehandler = () => {
    dispatch(updateUser(id, { role: "applicant" }));
    toast.success("Vai trò đã được cập nhật");
  };

  const handleUpgrade = (type) => {
    if (localStorage.getItem("role") === "applicant") {
      if (type === "trial") {
        dispatch(updateRoleToRecruiter());
        toast.success(
          "Chúc mừng! Bạn đã trở thành nhà tuyển dụng trong 7 ngày"
        );
        navigate("/recruiter/dashboard");
      } else {
        navigate("/payment");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaData title="Nâng cấp tài khoản" />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Nâng cấp tài khoản thành nhà tuyển dụng
                </h1>
              </div>
              <p className="text-gray-600 text-center max-w-2xl">
                Tận hưởng các lợi ích độc quyền của nhà tuyển dụng và tìm kiếm
                ứng viên chất lượng cao
              </p>
            </div>

            {localStorage.getItem("role") === "recruiter" ? (
              <div className="bg-green-50 p-4 rounded-lg mb-8">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-600 mr-3" />
                  <p className="text-green-800">
                    Bạn đã là nhà tuyển dụng. Bạn có thể tiếp tục đăng tin tuyển
                    dụng.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FaUserTie className="text-blue-600 w-6 h-6" />
                      </div>
                      <h2 className="ml-3 text-xl font-semibold text-blue-800">
                        Lợi ích khi trở thành nhà tuyển dụng
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-sm"
                        >
                          <div className="flex items-center mb-2">
                            {benefit.icon}
                            <h3 className="ml-3 font-medium text-gray-900">
                              {benefit.title}
                            </h3>
                          </div>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FaCheckCircle className="text-purple-600 w-6 h-6" />
                      </div>
                      <h2 className="ml-3 text-xl font-semibold text-purple-800">
                        Yêu cầu để trở thành nhà tuyển dụng
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-sm"
                        >
                          <div className="flex items-center mb-2">
                            {requirement.icon}
                            <h3 className="ml-3 font-medium text-gray-900">
                              {requirement.title}
                            </h3>
                          </div>
                          <p className="text-gray-600">
                            {requirement.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-24">
                  <button
                    onClick={() => handleUpgrade("trial")}
                    disabled={
                      loading || localStorage.getItem("role") === "recruiter"
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
                  >
                    <span>
                      {loading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaClock className="" />
                      )}
                    </span>
                    {loading ? "Đang xử lý..." : "Dùng thử miễn phí (7 ngày)"}
                  </button>

                  <button
                    onClick={() => handleUpgrade("payment")}
                    disabled={
                      loading || localStorage.getItem("role") === "recruiter"
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
                  >
                    <span>
                      {loading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCreditCard className="text-white" />
                      )}
                    </span>
                    {loading ? "Đang xử lý..." : "Nâng cấp trả phí"}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 p-6 rounded-lg mt-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-full">
                        <FaTimesCircle className="text-red-600 w-6 h-6" />
                      </div>
                      <p className="ml-3 text-red-800 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 p-6 rounded-lg mt-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FaCheckCircle className="text-green-600 w-6 h-6 animate-bounce" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-green-800 font-semibold mb-1">
                          Chúc mừng!
                        </h3>
                        <p className="text-green-700">
                          Bạn đã trở thành nhà tuyển dụng. Bạn sẽ được chuyển
                          hướng đến trang quản lý.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
