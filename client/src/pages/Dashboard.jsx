import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { Sidebar } from '../components/Sidebar'
import { RxCross1 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllJobsAdmin, getAllUsersAdmin, getAllAppAdmin } from '../actions/AdminActions'
import CountUp from 'react-countup';
import {BarChart} from '../components/Chart'
import { Loader } from '../components/Loader'
import { motion } from 'framer-motion'
import { FaUsers, FaBriefcase, FaFileAlt } from 'react-icons/fa'

export const Dashboard = () => {

  const [sideTog, setSideTog] = useState(false);
  const dispatch = useDispatch();
  const { loading, allJobs, allApplications, allUsers } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getAllJobsAdmin());
    dispatch(getAllUsersAdmin());
    dispatch(getAllAppAdmin());
  }, [dispatch]);

  return (
    <>

      <MetaData title="Dashboard" />
      <div className='min-h-screen bg-gray-50 pt-14 md:px-12 px-4'>
        <div className='fixed left-0 top-14 z-20'>
          <div 
            onClick={() => setSideTog(!sideTog)} 
            className='cursor-pointer bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2'
          >
            {!sideTog ? "Menu" : <RxCross1 className='text-xl' />}
          </div>
        </div>

        <Sidebar sideTog={sideTog} />

        <div className='w-full transition-all duration-300 ml-[250px] md:ml-0'>
          {loading ? (
            <div className='flex items-center justify-center h-[calc(100vh-14rem)]'>
              <Loader />
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mb-8 mt-14' 
              >
                <h1 className='text-4xl font-bold text-gray-800 text-center border-b-2 border-blue-500 pb-2'>Dashboard</h1>
              </motion.div>

              <div className='grid md:grid-cols-3 grid-cols-1 gap-6 mb-8'>
                {[
                  { 
                  title: 'Người dùng', 
                  value: allUsers?.length, 
                  color: 'bg-blue-100', 
                  icon: <FaUsers className='text-blue-600' /> 
                },
                { 
                  title: 'Công việc', 
                  value: allJobs?.length, 
                  color: 'bg-green-100', 
                  icon: <FaBriefcase className='text-green-600' /> 
                },
                { 
                  title: 'Ứng tuyển', 
                  value: allApplications?.length, 
                  color: 'bg-purple-100', 
                  icon: <FaFileAlt className='text-purple-600' /> 
                }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-xl shadow-lg ${stat.color} flex flex-col items-center justify-center gap-4`}
                  >
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <div className='text-6xl font-bold text-gray-800'>
                        <CountUp start={0} end={stat.value} duration={2} />
                      </div>
                      <div className='text-3xl font-semibold text-gray-600'>{stat.title}</div>
                      <div className='text-2xl text-gray-500 mt-2'>{stat.icon}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full mb-10'
              >
                <div className='w-full h-[40rem] bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center gap-4 mt-14'>
                  <h2 className='text-5xl font-bold mb-4'>Thống kê</h2>
                  <div className='w-full h-[26rem] flex items-center justify-center'>
                    <BarChart 
                      applications={allApplications?.length} 
                      users={allUsers?.length} 
                      jobs={allJobs?.length} 
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
