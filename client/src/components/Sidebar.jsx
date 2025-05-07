import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { MdOutlineCreateNewFolder, MdOutlineFeaturedPlayList, MdOutlineDashboard } from 'react-icons/md'
import { BsBriefcase } from 'react-icons/bs'
import { AiOutlineUser } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"
import { useLocation } from 'react-router-dom'


export const Sidebar = ({sideTog}) => {

    const sidebarVariants = {
        hidden: {
            x: '-100%' ,
        },
        visible: {
            x: 0,
        },
    };

    const location = useLocation();

    return (
        <>
            <motion.div
                className={`fixed left-0 top-0 min-h-screen w-64 md:w-72 bg-white border-r border-gray-200 shadow-sm z-10 transition-all duration-300 ${sideTog ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                initial={{ x: '-100%' }}
                animate={{ x: sideTog ? 0 : '-100%' }}
                transition={{ duration: 0.3 }}
            >

                <div className='flex flex-col items-center justify-center py-8'>
                    <div className='rounded-full bg-blue-50 p-2 mb-4'>
                        <MdOutlineDashboard className='text-blue-500' size={32} />
                    </div>
                    <h1 className='text-2xl font-semibold text-gray-800'>Admin Dashboard</h1>
                    <p className='text-sm text-gray-500'>Quản lý platform</p>
                </div>

                <div className='flex flex-col gap-4 px-4'>

                    {[
                        {
                            title: 'Dashboard',
                            icon: <MdOutlineDashboard size={20} className='text-blue-500' />,
                            path: '/admin/dashboard'
                        },
                        {
                            title: 'Đăng tin',
                            icon: <MdOutlineCreateNewFolder size={20} className='text-green-500' />,
                            path: '/admin/postJob'
                        },
                        {
                            title: 'Quản lý tin',
                            icon: <BsBriefcase size={20} className='text-purple-500' />,
                            path: '/admin/allJobs'
                        },
                        {
                            title: 'Ứng tuyển',
                            icon: <MdOutlineFeaturedPlayList size={20} className='text-yellow-500' />,
                            path: '/admin/allApplications'
                        },
                        {
                            title: 'Người dùng',
                            icon: <AiOutlineUser size={20} className='text-pink-500' />,
                            path: '/admin/allUsers'
                        }
                    ].map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                location.pathname === item.path 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    ))}

                </div>
            </motion.div>
        </>
    )
}
