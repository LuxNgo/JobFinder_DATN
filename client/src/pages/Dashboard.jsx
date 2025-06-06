import React, { useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { FaUser, FaBriefcase, FaFileAlt, FaDollarSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllJobsAdmin,
  getAllUsersAdmin,
  getAllAppAdmin,
  getSalesStatsAdmin,
} from "../actions/AdminActions";
import CountUp from "react-countup";
import { BarChart } from "../components/Chart";
import { Loader } from "../components/Loader";
import { HiOutlineSparkles } from "react-icons/hi";

export const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    loading,
    allJobs,
    allApplications,
    allUsers,
    totalSales,
    salesLoading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllJobsAdmin());
    dispatch(getAllUsersAdmin());
    dispatch(getAllAppAdmin());
    dispatch(getSalesStatsAdmin());
  }, [dispatch]);

  return (
    <>
      <MetaData title="Dashboard" />
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

              <div className="grid md:grid-cols-4 grid-cols-1 gap-6 md:pt-10 pt-4 pb-10">
                {[
                  {
                    title: "Người dùng",
                    value: allUsers?.length,
                    icon: <FaUser className="text-blue-500" size={24} />,
                  },
                  {
                    title: "Công việc",
                    value: allJobs?.length,
                    icon: <FaBriefcase className="text-blue-500" size={24} />,
                  },
                  {
                    title: "Đơn ứng tuyển",
                    value: allApplications?.length,
                    icon: <FaFileAlt className="text-blue-500" size={24} />,
                  },
                  {
                    title: "Doanh thu (VND)",
                    value: totalSales,
                    icon: <FaDollarSign className="text-green-500" size={24} />,
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
                      <h3
                        className={`text-3xl font-bold ${
                          stat.title === "Doanh thu (VND)"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        <CountUp
                          start={0}
                          end={stat.value || 0} // Ensure value is not undefined for CountUp
                          duration={2.5}
                          separator="."
                          decimals={stat.title === "Doanh thu (VND)" ? 0 : 0} // No decimals for sales, can be adjusted
                          className={`${
                            stat.title === "Doanh thu (VND)"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
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
                  <BarChart
                    applications={allApplications && allApplications.length}
                    users={allUsers && allUsers.length}
                    jobs={allJobs && allJobs.length}
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
