import React from "react";

const CareerObjective = ({
  summary,
  setSummary,
  suggestObjective,
  isGenerating,
  aiSuggestions,
}) => {
  const handleChange = (e) => {
    setSummary(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Mục Tiêu Nghề Nghiệp</h2>
      <div className="mb-4">
        <textarea
          value={summary}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
        />
      </div>
      <button
        onClick={suggestObjective}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
            Đang Tạo...
          </>
        ) : (
          "Lấy Gợi Ý từ AI"
        )}
      </button>
      {aiSuggestions.careerObjective && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-2">
            <p className="text-blue-800 font-medium">
              Gợi Ý Mục Tiêu Nghề Nghiệp:
            </p>
            <div className="prose prose-blue max-w-none">
              <p>{aiSuggestions.careerObjective}</p>
            </div>
            <button
              onClick={() => setSummary(aiSuggestions.careerObjective)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Áp dụng gợi ý này
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerObjective;
