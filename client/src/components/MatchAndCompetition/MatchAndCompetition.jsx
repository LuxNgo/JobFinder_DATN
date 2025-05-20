import React from "react";
import MatchScore from "../MatchScore/MatchScore";
import CompetitionLevel from "../CompetitionLevel/CompetitionLevel";

const MatchAndCompetition = ({ matchScore, competitionLevel }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-24">
        <div className="flex-1">
          <MatchScore score={matchScore} />
        </div>
        <div className="flex-1">
          <CompetitionLevel level={competitionLevel} />
        </div>
      </div>
    </div>
  );
};

export default MatchAndCompetition;
