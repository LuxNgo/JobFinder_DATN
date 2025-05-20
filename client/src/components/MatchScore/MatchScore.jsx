import React from "react";

const MatchScore = ({ score, label = "Mức độ phù hợp" }) => {
  const getScoreColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = () => {
    if (score >= 80) return "Hoàn hảo";
    if (score >= 60) return "Khá tốt";
    return "Cần cải thiện";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span
          className="text-sm font-semibold"
          style={{ color: getScoreColor() }}
        >
          {score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getScoreColor()}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-500">{getScoreText()}</div>
    </div>
  );
};

export default MatchScore;
