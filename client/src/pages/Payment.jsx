import React from "react";
import { MetaData } from "../components/MetaData";
import {
  FaCheck,
  FaTimes,
  FaStar,
  FaCreditCard,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { purchasePackageAction } from "../actions/UserActions";
import { clearPackagePurchaseError } from "../slices/UserSlice"; // For clearing errors

const packages = [
  {
    id: 1,
    title: "Gói Bạc",
    price: "1,000,000đ",
    duration: "1 tháng",
    features: [
      {
        text: "Đăng 5 tin tuyển dụng",
        icon: <FaCheck className="text-green-500" />,
      },
      {
        text: "Tối đa 50 ứng viên/đăng tin",
        icon: <FaCheck className="text-green-500" />,
      },
      { text: "Hỗ trợ 24/7", icon: <FaCheck className="text-green-500" /> },
      {
        text: "Không có báo cáo chi tiết",
        icon: <FaTimes className="text-red-500" />,
      },
      {
        text: "Không có hỗ trợ nâng cao",
        icon: <FaTimes className="text-red-500" />,
      },
    ],
    recommended: false,
    bestValue: false,
  },
  {
    id: 2,
    title: "Gói Vàng",
    price: "2,500,000đ",
    duration: "3 tháng",
    features: [
      {
        text: "Đăng 15 tin tuyển dụng",
        icon: <FaCheck className="text-green-500" />,
      },
      {
        text: "Tối đa 150 ứng viên/đăng tin",
        icon: <FaCheck className="text-green-500" />,
      },
      { text: "Hỗ trợ 24/7", icon: <FaCheck className="text-green-500" /> },
      {
        text: "Báo cáo chi tiết",
        icon: <FaCheck className="text-green-500" />,
      },
      { text: "Hỗ trợ nâng cao", icon: <FaCheck className="text-green-500" /> },
    ],
    recommended: true,
    bestValue: true,
  },
  {
    id: 3,
    title: "Gói Kim Cương",
    price: "5,000,000đ",
    duration: "6 tháng",
    features: [
      {
        text: "Đăng không giới hạn tin tuyển dụng",
        icon: <FaCheck className="text-green-500" />,
      },
      {
        text: "Tối đa 300 ứng viên/đăng tin",
        icon: <FaCheck className="text-green-500" />,
      },
      { text: "Hỗ trợ 24/7", icon: <FaCheck className="text-green-500" /> },
      {
        text: "Báo cáo chi tiết",
        icon: <FaCheck className="text-green-500" />,
      },
      { text: "Hỗ trợ nâng cao", icon: <FaCheck className="text-green-500" /> },
      { text: "Đặc quyền VIP", icon: <FaCheck className="text-green-500" /> },
    ],
    recommended: false,
    bestValue: false,
  },
];

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me, packagePurchaseLoading, packagePurchaseError } =
    useSelector((state) => state.User) || {};
  // It's good practice to clear previous errors when the component mounts or a new action is initiated.
  React.useEffect(() => {
    // Clear error when component mounts
    dispatch(clearPackagePurchaseError());
    return () => {
      // Optionally clear error when component unmounts
      dispatch(clearPackagePurchaseError());
    };
  }, [dispatch]);

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const parseDurationInMonths = (durationStr) => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)\s*tháng/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handlePurchase = (pkg) => {
    // No longer async here, the action is async
    if (!pkg || packagePurchaseLoading) return;
    // Clear previous error before new attempt
    dispatch(clearPackagePurchaseError());

    const payload = {
      packageId: pkg.id,
      packageTitle: pkg.title,
      amount: parsePrice(pkg.price),
      durationInMonths: parseDurationInMonths(pkg.duration),
    };

    dispatch(purchasePackageAction(payload)).then((result) => {
      if (result && result.payload && result.payload.success) {
        // Check if action was successful
        if (!packagePurchaseError) {
          // If no error after dispatch, assume success for navigation
          navigate("/dashboard/recruiter"); // Navigate to recruiter dashboard
        }
      }
      // Error display is handled by useSelector and rendered below
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <MetaData title="Gói thanh toán" />

      <div className="max-w-7xl mx-auto mt-16">
        <Link
          to="/upgrade-to-recruiter"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chọn gói thanh toán phù hợp
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chọn gói thanh toán phù hợp với nhu cầu tuyển dụng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                pkg.bestValue ? "border-4 border-green-500" : ""
              }`}
            >
              {pkg.bestValue && (
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full transform rotate-12">
                  Best Value
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.title}
                </h2>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {pkg.price}
                </p>
                <p className="text-gray-600">{pkg.duration}</p>
              </div>

              <div className="space-y-4">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    {feature.icon}
                    <span className="ml-3">{feature.text}</span>
                  </div>
                ))}
              </div>

              {packagePurchaseError && (
                <p className="text-red-500 text-center mb-4">
                  Lỗi:{" "}
                  {typeof packagePurchaseError === "string"
                    ? packagePurchaseError
                    : JSON.stringify(packagePurchaseError)}
                </p>
              )}
              <div className="mt-8">
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={packagePurchaseLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  <span className="mr-2">
                    <FaCreditCard />
                  </span>
                  {packagePurchaseLoading ? "Đang xử lý..." : "Chọn gói này"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
