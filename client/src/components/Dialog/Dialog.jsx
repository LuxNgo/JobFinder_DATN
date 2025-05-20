import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const Dialog = ({
  isOpen,
  onClose,
  title,
  message,
  description,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "info", // info, success, warning, error
  confirmButtonClassName = "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  cancelButtonClassName = "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" size={48} />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" size={48} />;
      case "error":
        return <FaTimesCircle className="text-red-500" size={48} />;
      default:
        return <FaExclamationCircle className="text-blue-500" size={48} />;
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case "success":
        return "text-green-600 font-semibold text-lg";
      case "warning":
        return "text-yellow-600 font-semibold text-lg";
      case "error":
        return "text-red-600 font-semibold text-lg";
      default:
        return "text-blue-600 font-semibold text-lg";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";
      case "warning":
        return "bg-yellow-600 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2";
      case "error":
        return "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] p-8 rounded-xl text-center shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 ">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center mb-4">{getIcon()}</div>
        <h3 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">
          {title}
        </h3>

        <div className="mb-6">
          {description && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>
          )}
          {message && <p className="text-lg">{message}</p>}
        </div>

        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={onConfirm}
            className={`px-6 py-3 w-full rounded-lg font-bold transition-all duration-200 transform ${getButtonColor()}`}
          >
            {confirmText}
          </button>

          <button
            onClick={onClose}
            className={`px-6 py-3 w-full rounded-lg font-bold transition-all duration-200 transform ${cancelButtonClassName}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
