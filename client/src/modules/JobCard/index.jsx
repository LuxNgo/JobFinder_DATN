import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';

const JobCard = ({ job }) => {
  return (
    <Link
      to={`/details/${job._id}`}
      className="flex gap-2 shadow-sm shadow-gray-800 border border-gray-700 p-2 flex-col hover:border-rose-500 transition duration-300 hover:scale-[1.02] hover:bg-slate-950"
    >
      <div className="flex gap-3">
        <div className="w-[5rem] flex justify-center items-center">
          <img src={job.companyLogo.url} alt={job.title} className="w-[4rem]" />
        </div>
        <div>
          <h3 className="text-xl">{job.title}</h3>
          <p className="text-lg">{job.companyName}</p>
          <p className="text-sm">{job.description.slice(0, 30) + "..."}</p>
        </div>
      </div>
      <div className="flex text-sm gap-8">
        <span>{formatDate(job.createdAt)}</span>
        <span>{job.employmentType}</span>
        <span>{job.location}</span>
      </div>
    </Link>
  );
};

export default JobCard;