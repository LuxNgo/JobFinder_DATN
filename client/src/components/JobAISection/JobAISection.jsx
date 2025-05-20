import React from "react";
import MatchScore from "../MatchScore/MatchScore";
import CompetitionLevel from "../CompetitionLevel/CompetitionLevel";

const JobAISection = ({ aiSuggestions }) => {
  return (
    <div className="mt-4">
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-blue-800">
            AI gợi ý công việc
          </h3>
          <div className="flex items-center space-x-2 text-blue-600 text-sm">
            <span className="font-medium">
              {Math.ceil(aiSuggestions.length / 6)} công việc
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          {aiSuggestions.map((line, index) => {
            switch (true) {
              case index % 6 === 0:
                return (
                  <div
                    key={index}
                    className="text-blue-800 font-semibold text-lg"
                  >
                    {line}
                  </div>
                );

              case index === 4 || index === 16:
                const matchScore = line;
                const competitionLevel = aiSuggestions[index + 1];
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <MatchScore score={matchScore} />

                    <div className="mt-4">
                      <CompetitionLevel level={competitionLevel} />
                    </div>
                  </div>
                );

              case index === 11:
                const matchScore11 = aiSuggestions[index - 1];
                const competitionLevel11 = aiSuggestions[index];
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <MatchScore score={matchScore11} />

                    <div className="mt-4">
                      <CompetitionLevel level={competitionLevel11} />
                    </div>
                  </div>
                );

              case index === 5 || index === 10 || index === 17:
                return;

              default:
                return (
                  <div key={index} className="text-gray-700 text-base">
                    {line}
                  </div>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default JobAISection;
