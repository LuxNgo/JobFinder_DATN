import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const DownloadButton = ({ previewRef }) => {
  const me = useSelector((state) => state.user.me);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleDownloadImage = async () => {
    if (!me) {
      toast.error("Vui lòng đăng nhập để tạo CV");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const previewElement = previewRef.current;
      if (!previewElement) {
        throw new Error("Không tìm thấy phần xem trước");
      }

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `cv-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      toast.error(error.message || "Không thể tạo ảnh CV");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={handleDownloadImage}
        disabled={isGeneratingImage}
        className={`inline-flex items-center px-8 py-4 ${
          isGeneratingImage
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        } text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}
      >
        {isGeneratingImage ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang tạo ảnh...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Tải Xuống Ảnh
          </>
        )}
      </button>
    </div>
  );
};

export default DownloadButton;
