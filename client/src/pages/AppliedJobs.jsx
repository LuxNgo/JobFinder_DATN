import React, { useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { getAppliedJob } from '../actions/ApplicationActions'
import { Loader } from '../components/Loader'
import { Link } from 'react-router-dom'
import { FaBuilding, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaExternalLinkAlt, FaTrash } from 'react-icons/fa'
import { deleteApplication } from '../actions/ApplicationActions'

export const AppliedJobs = () => {
    const dispatch = useDispatch()
    const { loading, appliedJobs } = useSelector(state => state.application)

    useEffect(() => {
        dispatch(getAppliedJob())
    }, [])

    const handleDelete = (id) => {
        dispatch(deleteApplication(id))
        .then(() => {
            dispatch(getAppliedJob())
        })
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    return (
        <>
            <MetaData title="My Applications" />
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto mt-10'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900'>Danh sách đơn ứng tuyển</h1>
                        <p className='mt-2 text-sm text-gray-600'>
                            Theo dõi và quản lý đơn ứng tuyển của bạn
                        </p>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : appliedJobs.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='text-gray-500 mb-4'>Không tìm thấy đơn ứng tuyển</div>
                            <Link 
                                to="/jobs" 
                                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
                            >
                                Tìm kiếm công việc
                            </Link>
                        </div>
                    ) : (
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {appliedJobs.map((application) => (
                                <div 
                                    key={application._id}
                                    className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300'
                                >
                                    <div className='p-6'>
                                        {/* Job Title and Company */}
                                        <div className='mb-4'>
                                            <h2 className='text-xl font-semibold text-gray-900 mb-1'>
                                                {application.jobTitle}
                                            </h2>
                                            <div className='flex items-center text-gray-600'>
                                                <FaBuilding className='mr-2' />
                                                {application.jobCompany}
                                            </div>
                                        </div>

                                        {/* Job Details */}
                                        <div className='space-y-2 mb-4'>
                                            <div className='flex items-center text-gray-600'>
                                                <FaMapMarkerAlt className='mr-2' />
                                                {application.jobLocation}
                                            </div>
                                            <div className='flex items-center text-gray-600'>
                                                <FaMoneyBillWave className='mr-2' />
                                                {application.jobSalary}
                                            </div>
                                            <div className='flex items-center text-gray-600'>
                                                <FaClock className='mr-2' />
                                                Đã ứng tuyển vào {formatDate(application.createdAt)}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className='mb-4'>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200'>
                                            <Link 
                                                to={`/Application/Details/${application._id}`}
                                                className='inline-flex items-center text-blue-600 hover:text-blue-800'
                                            >
                                                Xem chi tiết
                                                <FaExternalLinkAlt className='ml-2' />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(application._id)}
                                                className='inline-flex items-center text-red-600 hover:text-red-800'
                                            >
                                                <FaTrash className='mr-2' />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

