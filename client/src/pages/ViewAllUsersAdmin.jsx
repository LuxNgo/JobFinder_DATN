import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { Sidebar } from '../components/Sidebar'
import { MdOutlineModeEditOutline, MdOutlineSearch } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { getAllUsersAdmin, deleteUser } from '../actions/AdminActions'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { HiOutlineSparkles } from 'react-icons/hi'


export const ViewAllUsersAdmin = () => {
  const dispatch = useDispatch()
  const { loading, allUsers } = useSelector(state => state.admin)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(getAllUsersAdmin())
  }, [])


  const deleteUserHandler = async (id) => {
    try {
      await dispatch(deleteUser(id))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }



  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <MetaData title="Quản lý người dùng" />
      <div className='bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen pt-14 md:px-20 px-3 text-gray-900'>
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div>
            <Sidebar />
            
            <div className="flex justify-between items-center mb-6 pt-14">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="text-blue-500 text-2xl" />
                <h1 className='text-3xl font-bold text-blue-700 uppercase'>Quản lý người dùng</h1>
              </div>
              <div className="relative bg-white">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-gray-900 rounded-lg px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-blue-200 shadow-sm"
                />
                <MdOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 transition-transform duration-300" />
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-900 uppercase bg-blue-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      ID người dùng
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Tên
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Vai trò
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers && allUsers
                    .filter(user => user._id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((user, i) => (
                      <tr key={i} className="bg-white border-b hover:bg-blue-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {user._id}
                        </th>
                        <td className="px-6 py-4">
                          {user.name}
                        </td>
                        <td className="px-6 py-4">
                          {user.role}
                        </td>
                        <td className="px-6 py-4">
                          {convertDateFormat(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 flex gap-4 items-center">
                          <Link 
                            to={`/admin/user/role/${user._id}`} 
                            className='text-blue-500 hover:text-blue-400 cursor-pointer flex items-center gap-2'
                          >
                            <MdOutlineModeEditOutline size={20} />
                            <span>Sửa</span>
                          </Link>
                          <button 
                            onClick={() => deleteUserHandler(user._id)}
                            className='text-red-500 hover:text-red-400 cursor-pointer flex items-center gap-2'
                          >
                            <AiOutlineDelete size={20} />
                            <span>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
