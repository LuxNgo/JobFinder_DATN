import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { AiOutlineMail, AiOutlineUnlock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { TbLoader2 } from 'react-icons/tb'
import { loginUser } from '../actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'

export const Login = () => {

  const { loading, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [eyeTog, setEyeTog] = useState(false)
  const [focusedInput, setFocusedInput] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const loginHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
    setFormData({ email: "", password: "" })
  }

  useEffect(() => {
    if (isLogin) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isLogin])

  return (
    <>
      <MetaData title="Đăng nhập" />
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
          {/* Phần tiêu đề */}
          <div className='text-center space-y-2'>
            <h2 className='text-3xl font-bold text-gray-900'>Chào mừng trở lại</h2>
            <p className='text-gray-500'>Vui lòng nhập thông tin để đăng nhập</p>
          </div>

          <form onSubmit={loginHandler} className='mt-8 space-y-6'>
            <div className='space-y-5'>
              {/* Nhập email */}
              <div className='space-y-2'>
                <label
                  htmlFor="email"
                  className='block text-sm font-medium text-gray-700'
                >
                  Địa chỉ Email
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'email' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <AiOutlineMail className='h-5 w-5' />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200
                      ${focusedInput === 'email' 
                        ? 'border-blue-600 ring-1 ring-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                </div>
              </div>

              {/* Nhập mật khẩu */}
              <div className='space-y-2'>
                <label
                  htmlFor="password"
                  className='block text-sm font-medium text-gray-700'
                >
                  Mật khẩu
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'password' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <AiOutlineUnlock className='h-5 w-5' />
                  </div>
                  <input
                    type={eyeTog ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-12 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200
                      ${focusedInput === 'password'
                        ? 'border-blue-600 ring-1 ring-blue-600'
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  <button 
                    type="button"
                    className='absolute inset-y-0 right-0 flex items-center pr-4 
                             text-gray-400 hover:text-gray-600 transition-colors duration-200'
                    onClick={() => setEyeTog(!eyeTog)}
                  >
                    {eyeTog ? 
                      <AiOutlineEye className='h-5 w-5' /> : 
                      <AiOutlineEyeInvisible className='h-5 w-5' />
                    }
                  </button>
                </div>
              </div>

              {/* Ghi nhớ và Quên mật khẩu */}
              <div className='flex items-center justify-between pt-2'>
                <div className='flex items-center'>
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-600'>
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link 
                  to="/forgot-password"
                  className='text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200'
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className='w-full flex justify-center items-center px-4 py-3.5
                       bg-blue-600 hover:bg-blue-700 
                       text-white font-medium text-base rounded-lg
                       transition-all duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {loading ? (
                <TbLoader2 className='animate-spin h-5 w-5' />
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Liên kết đăng ký */}
            <div className='text-center text-sm text-gray-500'>
              Bạn chưa có tài khoản?{' '}
              <Link 
                to="/register" 
                className='font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200'
              >
                Đăng ký miễn phí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
