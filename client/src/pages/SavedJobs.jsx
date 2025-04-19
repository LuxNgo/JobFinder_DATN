import React, { useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { getSavedJobs } from '../actions/JobActions'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { SaveJobCard } from '../components/SaveJobCard'
import { Link } from 'react-router-dom'
import { FaBookmark, FaBriefcase } from 'react-icons/fa'

export const SavedJobs = () => {
  const dispatch = useDispatch()
  const { savedJobs, saveJobLoading, loading } = useSelector(state => state.job)

  useEffect(() => {
    dispatch(getSavedJobs())
  }, [saveJobLoading])

  return (
    <>
      <MetaData title="Saved Jobs" />
      <div className='min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-5xl mx-auto mt-10'>
          {loading ? (
            <Loader />
          ) : (
            <div className='space-y-6'>
              {/* Header */}
              {savedJobs.length > 0 && (
                <div className='text-center'>
                  <h1 className='text-3xl font-bold text-neutral-900 flex items-center justify-center gap-3'>
                    <FaBookmark />
                    Saved Jobs
                  </h1>
                  <p className='mt-2 text-neutral-600'>
                    You have {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Job Cards */}
              {savedJobs.length > 0 ? (
                <div className='space-y-4'>
                  {savedJobs.slice().reverse().map((job, i) => (
                    <SaveJobCard key={i} job={job} />
                  ))}
                </div>
              ) : (
                <div className='text-center py-16 px-4 rounded-lg bg-white shadow-sm border border-neutral-200'>
                  <div className='flex justify-center'>
                    <img 
                      src="/images/jobEmpty.svg" 
                      className='w-52 h-52 object-contain' 
                      alt="No saved jobs" 
                    />
                  </div>
                  <h2 className='mt-6 text-2xl font-semibold text-neutral-900'>
                    No Saved Jobs Yet
                  </h2>
                  <p className='mt-2 text-neutral-600 max-w-sm mx-auto'>
                    Start exploring and save jobs that interest you to build your collection
                  </p>
                  <Link 
                    to="/jobs" 
                    className='mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white blueCol hover:bg-blue-700 transition-colors duration-200'
                  >
                    <FaBriefcase className="mr-2" />
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


