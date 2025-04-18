import React from 'react';
import { useSelector } from 'react-redux';
import JobCard from '../../../modules/JobCard';
import LoadingSpinner from '../../../elements/Button/index';
import useFeaturedJobs from '../../../hooks/useFeaturedJobs';

const FeaturedJobs = () => {
  const { loading, allJobs } = useSelector(state => state.job);
  const { featuredJobs } = useFeaturedJobs(allJobs);

  return (
    <section className="pt-[8rem] w-full">
      <h2 className="titleT pb-6 text-2xl">Featured Jobs</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid md:grid-cols-3 gap-3">
          {featuredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedJobs;