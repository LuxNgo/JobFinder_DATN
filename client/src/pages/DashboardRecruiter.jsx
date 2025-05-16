import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { FaUser, FaBriefcase, FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllJobsRecruiter,
  getAllAppRecruiter,
} from "../actions/RecruiterActions";
import CountUp from "react-countup";
import { BarChart } from "../components/Chart";
import { Loader } from "../components/Loader";
import { HiOutlineSparkles } from "react-icons/hi";
import { BarChartRecruiter } from "../components/ChartRecruiter";

export const DashboardRecruiter = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const { loading, allJobsRecruiter, allApplicationsRecruiter } = useSelector(
    (state) => state.recruiter
  );

  useEffect(() => {
    dispatch(getAllJobsRecruiter());
    dispatch(getAllAppRecruiter());
  }, []);

  return (
    <>
      <MetaData title="DashboardRecruiter" />
      <div className="bg-blue-50 min-h-screen pt-14 md:px-20 px-3">
        <div className="w-full">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="flex justify-center items-center gap-2">
                <HiOutlineSparkles className="text-blue-500 text-3xl" />
                <h1 className="text-4xl font-bold text-blue-700 uppercase">
                  Dashboard
                </h1>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:pt-10 pt-4 pb-10">
                {[
                  {
                    title: "Ứng viên",
                    value: allApplicationsRecruiter?.length || 0,
                    icon: <FaUser className="text-blue-500" size={24} />,
                  },
                  {
                    title: "Công việc đang tuyển",
                    value: allJobsRecruiter?.length || 0,
                    icon: <FaBriefcase className="text-blue-500" size={24} />,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center mb-6">
                      {stat.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-blue-600">
                        <CountUp
                          start={0}
                          end={stat.value}
                          className="text-blue-600"
                        />
                      </h3>
                      <p className="text-gray-600 mt-2 uppercase tracking-wider">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full flex justify-center items-center pb-28">
                <div className="flex flex-col justify-center items-center bg-white rounded-xl shadow-lg p-6 w-full md:px-0 px-6 h-[500px] py-16">
                  <h3 className="text-3xl font-bold text-blue-500 mb-4">
                    Thống kê
                  </h3>
                  <BarChartRecruiter
                    applications={allApplicationsRecruiter?.length || 0}
                    jobs={allJobsRecruiter?.length || 0}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
