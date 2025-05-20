import React from "react";

const CompetitionLevel = ({ level, label = "Tỷ lệ cạnh tranh" }) => {
  // Convert level to a 10-point scale
  const getLevel = () => Math.min(Math.max(level, 1), 10);

  // Get appropriate color based on competition level
  const getLevelColor = () => {
    if (level <= 3) return "bg-green-500";
    if (level <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get descriptive text based on competition level
  const getLevelText = () => {
    if (level <= 3) return "Cạnh tranh thấp";
    if (level <= 6) return "Cạnh tranh trung bình";
    return "Cạnh tranh cao";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span
          className="text-sm font-semibold"
          style={{ color: getLevelColor() }}
        >
          {getLevel()}/10
        </span>
      </div>

      {/* Competition level indicator */}
      <div className="w-full">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${getLevelColor()}`}
            style={{ width: `${(level - 1) * 10}%` }}
          >
            {/* Add competition level markers */}
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className={`absolute h-2.5 w-1/10 ${
                  i === level - 1 ? "bg-white" : "bg-transparent"
                }`}
                style={{ left: `${i * 10}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">{getLevelText()}</div>
    </div>
  );
};

export default CompetitionLevel;
