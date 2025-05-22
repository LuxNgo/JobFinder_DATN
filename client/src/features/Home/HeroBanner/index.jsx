import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../elements/Button";

const HeroBanner = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-28 gap-4">
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-10 gap-1">
        <h1 className="md:text-8xl text-6xl titleT">JOBFINDER</h1>
        <Button as={Link} to="/jobs" variant="primary">
          Browse Jobs
        </Button>
      </div>
      <p className="md:text-xl text-sm">
        Your <span className="text-yellow-500">gateway</span> to job
        opportunities.
      </p>
    </section>
  );
};

export default HeroBanner;
