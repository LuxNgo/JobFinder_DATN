import React from 'react'
import { Link } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile';

export const JobCard = ({ job }) => {
    const convertDateFormat = (inputDate) => {
        const parts = inputDate.split('-');
        if (parts.length !== 3) return "Invalid date format";
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const isMobile = useIsMobile()

    return (
        <Link 
            to={`/details/${job._id}`} 
            className='block w-full transition-all duration-300'
        >
            <div className='bg-white rounded-xl border-2 border-neutral-200 p-6 
                hover:border-primary-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
                transition-all duration-300 group'>
                <div className='flex gap-5'>
                    {/* Logo Section */}
                    <div className='shrink-0'>
                        <div className='w-16 h-16 rounded-lg border-2 border-neutral-100 
                            bg-white p-2 flex items-center justify-center 
                            group-hover:border-neutral-200 transition-colors duration-300'>
                            <img 
                                src={job.companyLogo.url} 
                                className='w-full h-full object-contain' 
                                alt={job.companyName} 
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='flex-1 min-w-0'>
                        {/* Header */}
                        <div className='flex items-start justify-between gap-3 mb-4'>
                            <div>
                                <h2 className='font-semibold text-neutral-900 text-xl mb-1.5 truncate
                                    group-hover:text-primary-500 transition-colors duration-300'>
                                    {job.title}
                                </h2>
                                <p className='text-neutral-600 text-base'>
                                    {job.companyName}
                                </p>
                            </div>
                            <button className='shrink-0 bg-blue-400 hover:bg-blue-600 text-white text-sm font-semibold 
                                px-5 py-2.5 rounded-full border-2 border-transparent
                                hover:scale-105 transition-all duration-300 shadow-sm'>
                                Ứng tuyển
                            </button>
                        </div>

                        {/* Description */}
                        <div className='mb-4 border-l-2 border-neutral-100 pl-4'>
                            {!isMobile ? (
                                <p className='text-neutral-600 text-sm line-clamp-2'>
                                    {job.description}
                                </p>
                            ) : (
                                <p className='text-neutral-600 text-sm line-clamp-1'>
                                    {job.description}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className='flex flex-wrap gap-2 text-sm mb-4'>
                            <span className='inline-flex bg-neutral-50 text-neutral-700 
                                rounded-full px-4 py-1.5 border-2 border-neutral-100
                                group-hover:border-neutral-200 transition-colors duration-300'>
                                {job.experience}
                            </span>
                            <span className='inline-flex bg-neutral-50 text-neutral-700 
                                rounded-full px-4 py-1.5 border-2 border-neutral-100
                                group-hover:border-neutral-200 transition-colors duration-300'>
                                {job.employmentType}
                            </span>
                            <span className='inline-flex bg-neutral-50 text-neutral-700 
                                rounded-full px-4 py-1.5 border-2 border-neutral-100
                                group-hover:border-neutral-200 transition-colors duration-300'>
                                {job.location}
                            </span>
                        </div>

                        {/* Footer */}
                        <div className='pt-4 border-t-2 border-neutral-100'>
                            <p className='text-neutral-500 text-sm font-medium'>
                                Đăng vào ngày: {convertDateFormat(job.createdAt.substr(0, 10))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

