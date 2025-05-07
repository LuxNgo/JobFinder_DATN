import React, { useState, useEffect } from 'react'
import { TbLoader2, TbCheck, TbFileText, TbMapPin, TbBriefcase, TbUser, TbMail } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader } from '../components/Loader'
import { useParams } from 'react-router'
import { MetaData } from '../components/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSingleJob } from '../actions/JobActions'
import { createApplication } from '../actions/ApplicationActions'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const Application = () => {

    const dispatch = useDispatch()
    const { id } = useParams()

    const { jobDetails } = useSelector(state => state.job)
    const { me } = useSelector(state => state.user)
    const { loading } = useSelector(state => state.application)
    const navigate = useNavigate()
    const [confirm, setConfirm] = useState(false)

    useEffect(()=>{
        dispatch(getSingleJob(id))
    },[])

    const makeApplication = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createApplication(id));
            toast.success('Đăng ký thành công!');
            navigate(`/details/${id}`);
        } catch (error) {
            console.error('Application submission failed:', error);
            toast.error(error.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        }
    }

    return (
        <>

            <MetaData title="Job Details" />
            <div className='bg-blue-50 min-h-screen pt-14 text-gray-900 pb-14'>
                <div className="max-w-5xl mx-auto px-4 mt-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                        className='py-2 flex flex-col items-center text-center'
                    >
                        <div className='text-4xl font-bold text-blue-600 py-2 pb-2'>Apply to {jobDetails.companyName}</div>
                        <div className='text-14 text-blue-500'>ID: {id}</div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='mt-8 bg-white rounded-2xl p-8 shadow-lg border border-blue-200 max-w-3xl mx-auto'
                    >
                        <form onSubmit={makeApplication} className='w-full'>
                        <div className='grid grid-cols-1 gap-6'>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className='border-b border-blue-100 pb-4'
                            >
                                <div className='text-lg font-medium mb-2'>Chi tiết công việc</div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <TbBriefcase className='text-blue-500' size={20} />
                                        <span>{jobDetails.title}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <TbMapPin className='text-blue-500' size={20} />
                                        <span>{jobDetails.location}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span>Kinh nghiệm:</span>
                                        <span>{jobDetails.experience}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className='border-b border-blue-100 pb-4'
                            >
                                <div className='text-lg font-medium mb-2'>Chi tiết ứng viên</div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <TbUser className='text-blue-500' size={20} />
                                        <span className='font-medium'>{me.name}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <TbMail className='text-blue-500' size={20} />
                                        <span className='font-medium'>{me.email}</span>
                                    </div>
                                    <div className='col-span-2 flex items-center gap-2'>
                                        <TbFileText className='text-blue-500' size={20} />
                                        <Link 
                                            to={me.resume.url} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className='text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors duration-200'
                                        >
                                            Xem hồ sơ của {me.name}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className='border-b border-blue-100 pb-4'
                            >
                                <div className='text-lg font-medium mb-2'>Xác nhận thông tin</div>
                                <div className='flex items-start gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            className='cursor-pointer'
                                        >
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 border-blue-300 rounded focus:ring-blue-500" 
                                                onChange={(e) => setConfirm(e.target.checked)}
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='text-sm text-blue-600'
                                    >
                                        Tôi xác nhận thông tin trên là chính xác
                                    </motion.p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className='pt-6 pb-16 flex justify-center'
                            >
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={makeApplication} 
                                    disabled={!confirm || loading} 
                                    className={`w-full px-10 py-3 rounded-lg font-medium transition-all duration-300 ${
                                        confirm && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                                        loading ? 'bg-blue-300 text-gray-500' : 
                                        'bg-blue-300 text-gray-500'
                                    }`}
                                >
                                    {loading ? (
                                        <div className='flex items-center justify-center gap-2'>
                                            <TbLoader2 className='animate-spin' size={20} />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        <span>Đăng ký</span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    </form>
                    </motion.div>
                </div>
                </div>
        </>
    )
}
