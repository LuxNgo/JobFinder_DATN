import React, { useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Link } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import { FaUserEdit, FaFileAlt, FaKey, FaTrash, FaBookmark, FaClipboardList } from 'react-icons/fa'

export const MyProfile = () => {
  const { loading, me } = useSelector(state => state.user)
  const [opened, { open, close }] = useDisclosure(false)

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split('-')
    if (parts.length !== 3) return "Invalid date format"
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }

  const menuItems = [
    { icon: <FaUserEdit className="w-5 h-5" />, text: 'Edit Profile', link: '/editProfile' },
    { icon: <FaClipboardList className="w-5 h-5" />, text: 'My Applications', link: '/applied' },
    { icon: <FaBookmark className="w-5 h-5" />, text: 'Saved Jobs', link: '/saved' },
    { icon: <FaKey className="w-5 h-5" />, text: 'Change Password', link: '/changePassword' },
    { icon: <FaTrash className="w-5 h-5" />, text: 'Delete Account', link: '/deleteAccount' }
  ]

  return (
    <>
      <MetaData title="My Profile" />
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8'>
        {loading ? <Loader /> : (
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              {/* Header Section */}
              <div className='bg-blue-600 text-white px-8 py-6'>
                <h1 className='text-3xl font-bold'>My Profile</h1>
              </div>

              {/* Profile Content */}
              <div className='p-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                  {/* Left Column - Avatar */}
                  <div className='md:w-1/3 flex flex-col items-center'>
                    <div className='w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg'>
                      <img 
                        src={me.avatar.url} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                      />
                    </div>
                    
                    {/* Resume Button */}
                    <button
                      onClick={open}
                      className='mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      <FaFileAlt />
                      View Resume
                    </button>
                  </div>

                  {/* Right Column - Info */}
                  <div className='md:w-2/3'>
                    <div className='space-y-6'>
                      {/* Personal Info */}
                      <div className='space-y-4'>
                        <div>
                          <h3 className='text-sm font-medium text-gray-500'>Full Name</h3>
                          <p className='text-lg font-medium text-gray-900'>{me.name}</p>
                        </div>
                        <div>
                          <h3 className='text-sm font-medium text-gray-500'>Email</h3>
                          <p className='text-lg font-medium text-gray-900'>{me.email}</p>
                        </div>
                        <div>
                          <h3 className='text-sm font-medium text-gray-500'>Joined On</h3>
                          <p className='text-lg font-medium text-gray-900'>
                            {convertDateFormat(me.createdAt.substr(0, 10))}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className='text-sm font-medium text-gray-500 mb-2'>Skills</h3>
                        <div className='flex flex-wrap gap-2'>
                          {me.skills.map((skill, i) => (
                            <span 
                              key={i} 
                              className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
                        {menuItems.map((item, index) => (
                          <Link 
                            key={index}
                            to={item.link}
                            className='flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all'
                          >
                            <span className='text-blue-600'>{item.icon}</span>
                            <span className='font-medium text-gray-700'>{item.text}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Modal */}
            <Modal 
              opened={opened} 
              onClose={close} 
              title="Resume"
              size="lg"
            >
              <div className='w-full'>
                <img src={me.resume.url} className='w-full h-auto' alt="Resume" />
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  )
}

