import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetaData } from '../components/MetaData'
import { useSelector, useDispatch } from 'react-redux'
import { JobCard } from '../components/JobCard'
import { getAllJobs } from '../actions/JobActions'
import Testimonials from '../components/Testimonials/Testimonials.jsx'
import jobSearchImage from '../assets/images/image.job.search.svg';
import coporateImage from '../assets/images/image.coperate.png';

export const Home = () => {
    const dispatch = useDispatch()
    const { loading, allJobs } = useSelector(state => state.job)

    useEffect(() => {
        dispatch(getAllJobs())
    }, [dispatch])

    const convertDateFormat = (inputDate) => {
        const parts = inputDate.split('-')
        if (parts.length !== 3) return "Invalid date"
        return `${parts[2]}-${parts[1]}-${parts[0]}`
    }

    const companyLogos = Array.from({ length: 20 }, (_, i) => ({
        link: `/images/JobData/${i + 1}.jpg`
    }))

    return (
        <>
            <MetaData title="JobLane - Find Your Dream Job" />
            <div className='min-h-screen flex flex-col text-black'>
                {/* Hero Section */}
                <div className='relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden'>
                    {/* Decorative Elements */}
                    <div className='absolute inset-0 overflow-hidden'>
                        <div className='absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-400 rounded-full opacity-10 blur-3xl'></div>
                        <div className='absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-300 rounded-full opacity-10 blur-3xl'></div>
                    </div>
                    
                    <div className='relative min-h-[700px] flex items-center'>
                        <div className='container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12'>
                            {/* Hero Content */}
                            <div className='flex-1 text-center lg:text-left space-y-8 z-10'>
                                <h1 className='text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight'>
                                    Find Your <span className='text-blue-400'>Dream Job</span> Today
                                </h1>
                                <p className='text-xl md:text-2xl text-blue-100 max-w-3xl'>
                                    Connect with top employers and discover opportunities that match your skills and aspirations.
                                </p>
                                <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                                    <Link 
                                        to="/jobs" 
                                        className='px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-full 
                                                 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50
                                                 flex items-center gap-2 group hover:-translate-y-1'
                                    >
                                        Browse Jobs
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                    <Link 
                                        to="/post-job" 
                                        className='px-8 py-4 text-lg font-semibold text-blue-500 bg-white rounded-full 
                                                 hover:bg-blue-50 transition-all duration-300 shadow-lg
                                                 flex items-center gap-2 hover:-translate-y-1'
                                    >
                                        Post a Job
                                    </Link>
                                </div>
                            </div>
                            {/* Hero Image */}
                            <div className='flex-1 relative'>
                                {/* Blob shapes */}
                                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                                <div className="absolute top-0 right-32 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                                <div className="absolute -bottom-8 right-20 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                                
                                {/* Image container */}
                                <div className="relative z-10 backdrop-blur-sm bg-white/10 rounded-2xl p-6">
                                    <img 
                                        src={jobSearchImage} 
                                        alt="Job Search Illustration" 
                                        className="w-full max-w-[600px] mx-auto 
                                                 relative z-10 
                                                 transition-all duration-500
                                                 hover:transform hover:scale-102
                                                 rounded-xl" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='bg-white py-12 -mt-16 relative z-10'>
                    <div className='container mx-auto px-4'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                            <div className='text-center'>
                                <div className='text-4xl font-bold text-blue-500 mb-2'>10K+</div>
                                <div className='text-gray-600'>Active Jobs</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-4xl font-bold text-blue-500 mb-2'>5K+</div>
                                <div className='text-gray-600'>Companies</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-4xl font-bold text-blue-500 mb-2'>1M+</div>
                                <div className='text-gray-600'>Job Seekers</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-4xl font-bold text-blue-500 mb-2'>8K+</div>
                                <div className='text-gray-600'>Hired</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Jobs Section */}
                <section className='py-20 px-4 bg-gray-50'>
                    <div className='container mx-auto'>
                        <div className='text-center mb-12'>
                            <h2 className='text-4xl font-bold text-gray-900 mb-4'>Featured Opportunities</h2>
                            <div className='h-1 w-20 bg-blue-500 mx-auto'></div>
                            <p className='mt-4 text-gray-600 text-lg'>Discover hand-picked positions from top companies</p>
                        </div>

                        {loading ? (
                            <div className='w-full h-40 flex justify-center items-center'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                            </div>
                        ) : (
                            <div className='grid md:grid-cols-3 gap-8'>
                                {allJobs && allJobs.length >= 4 && [3, 5, 2].map((index) => (
                                    <Link
                                        key={allJobs[index]._id}
                                        to={`/details/${allJobs[index]._id}`}
                                        className='group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 
                                                 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
                                    >
                                        <div className='flex gap-4'>
                                            <div className='w-16 h-16 flex justify-center items-center bg-gray-50 rounded-lg p-2 overflow-hidden'>
                                                <img
                                                    src={allJobs[index].companyLogo.url}
                                                    alt={allJobs[index].title}
                                                    className='w-full h-full object-contain group-hover:scale-110 transition-transform'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-xl font-semibold text-gray-900 group-hover:text-blue-500 
                                                           transition-colors duration-300 line-clamp-2'
                                                >
                                                    {allJobs[index].title}
                                                </h3>
                                                <p className='text-lg text-gray-700 font-medium'>
                                                    {allJobs[index].companyName}
                                                </p>
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-4 line-clamp-2'>
                                            {allJobs[index].description}
                                        </p>
                                        <div className='flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100'>
                                            <span className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full'>
                                                {convertDateFormat(allJobs[index].createdAt.slice(0,10))}
                                            </span>
                                            <span className='px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full'>
                                                {allJobs[index].employmentType}
                                            </span>
                                            <span className='px-3 py-1 text-sm text-green-600 bg-green-50 rounded-full'>
                                                {allJobs[index].location}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Companies Section with Image Grid */}
                <section className='py-20 bg-white'>
                    <div className='container mx-auto px-4'>
                        <div className='text-center mb-12'>
                            <h2 className='text-4xl font-bold text-gray-900 mb-4'>Trusted by Leading Companies</h2>
                            <div className='h-1 w-20 bg-blue-500 mx-auto'></div>
                            <p className='mt-4 text-gray-600 text-lg'>Join thousands of companies that trust us with their hiring needs</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                            {companyLogos.map((logo, i) => (
                                <div key={i} 
                                     className="relative group w-32 h-32 p-4 bg-white rounded-xl shadow-md 
                                              hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img 
                                        src={logo.link} 
                                        className='w-full h-full object-contain filter grayscale group-hover:grayscale-0 
                                                 transition-all duration-300 group-hover:scale-110' 
                                        alt="Company logo" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <Testimonials />

                {/* About Section with Image */}
                <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1">
                                <img 
                                    src={coporateImage} 
                                    alt="About JobLane" 
                                    className="w-full max-w-[500px] mx-auto rounded-xl shadow-xl 
                                              transition-all duration-500
                                             object-cover hover:shadow-2xl"
                                />
                            </div>
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className='text-4xl font-bold text-gray-900 mb-6'>About JobLane</h2>
                                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    Discover the Power of Possibility with JobLane: Where Your Professional Journey Takes Flight, 
                                    Guided by a Network of Diverse Opportunities! We connect talented professionals with 
                                    forward-thinking companies to create meaningful career relationships.
                                </p>
                                <Link 
                                    to="/about" 
                                    className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-600 
                                             transition-colors duration-300"
                                >
                                    Learn More About Us
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                              d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}








