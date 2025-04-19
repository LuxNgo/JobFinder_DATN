import React, { useState, useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { AiOutlineMail, AiOutlineUnlock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { MdPermIdentity, MdOutlineFeaturedPlayList } from 'react-icons/md'
import { BsFileEarmarkText } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { Link, useNavigate } from 'react-router-dom'
import { TbLoader2 } from 'react-icons/tb'
import { registerUser } from '../actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'

export const Register = () => {
  const { loading, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [eyeTog, setEyeTog] = useState(false)
  const [focusedInput, setFocusedInput] = useState("")

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState("")
  const [avatarName, setAvatarName] = useState("")
  const [resume, setResume] = useState("")
  const [resumeName, setResumeName] = useState("")

  const registerHandler = (e) => {
    e.preventDefault()
    const skillsArr = skills.split(",")
    const data = {
      name,
      email,
      password,
      avatar,
      resume,
      skills: skillsArr
    }
    dispatch(registerUser(data))
    setName("")
    setEmail("")
    setPassword("")
    setAvatar("")
    setAvatarName("")
    setResume("")
    setResumeName("")
    setSkills("")
  }

  useEffect(() => {
    if (isLogin) {
      navigate("/")
    }
  }, [isLogin])

  return (
    <>
      <MetaData title="Register" />
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg mt-10'>
          <div className='text-center space-y-2'>
            <h2 className='text-3xl font-bold text-gray-900'>Create Account</h2>
            <p className='text-gray-500'>Please fill in your details to register</p>
          </div>

          <form onSubmit={registerHandler} className='mt-8 space-y-6'>
            <div className='space-y-5'>
              {/* Name Input */}
              <div className='space-y-2'>
                <label
                  htmlFor="name"
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'name' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <MdPermIdentity className='h-5 w-5' />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200
                      ${focusedInput === 'name' 
                        ? 'border-blue-600 ring-1 ring-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className='space-y-2'>
                <label
                  htmlFor="email"
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address
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
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200
                      ${focusedInput === 'email' 
                        ? 'border-blue-600 ring-1 ring-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label
                  htmlFor="password"
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
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
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-12 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200
                      ${focusedInput === 'password'
                        ? 'border-blue-600 ring-1 ring-blue-600'
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Create a password"
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

              {/* Skills Input */}
              <div className='space-y-2'>
                <label
                  htmlFor="skills"
                  className='block text-sm font-medium text-gray-700'
                >
                  Skills (comma-separated)
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'skills' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <MdOutlineFeaturedPlayList className='h-5 w-5' />
                  </div>
                  <textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    onFocus={() => setFocusedInput('skills')}
                    onBlur={() => setFocusedInput('')}
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200 min-h-[100px]
                      ${focusedInput === 'skills'
                        ? 'border-blue-600 ring-1 ring-blue-600'
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    placeholder="Enter your skills (e.g., JavaScript, React, Node.js)"
                    required
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className='space-y-2'>
                <label
                  htmlFor="avatar"
                  className='block text-sm font-medium text-gray-700'
                >
                  Profile Picture
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'avatar' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <CgProfile className='h-5 w-5' />
                  </div>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setAvatarName(file.name);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setAvatar(reader.result);
                      };
                    }}
                    className='hidden'
                  />
                  <div
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200 cursor-pointer
                      ${focusedInput === 'avatar'
                        ? 'border-blue-600 ring-1 ring-blue-600'
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onClick={() => document.getElementById('avatar').click()}
                  >
                    {avatarName || "Choose profile picture"}
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className='space-y-2'>
                <label
                  htmlFor="resume"
                  className='block text-sm font-medium text-gray-700'
                >
                  Resume
                </label>
                <div className='relative'>
                  <div className={`
                    absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                    ${focusedInput === 'resume' ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    <BsFileEarmarkText className='h-5 w-5' />
                  </div>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setResumeName(file.name);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setResume(reader.result);
                      };
                    }}
                    className='hidden'
                  />
                  <div
                    className={`
                      w-full pl-12 pr-4 py-3 text-gray-900 text-base
                      border rounded-lg outline-none transition-all duration-200 cursor-pointer
                      ${focusedInput === 'resume'
                        ? 'border-blue-600 ring-1 ring-blue-600'
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onClick={() => document.getElementById('resume').click()}
                  >
                    {resumeName || "Upload your resume"}
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !email || !password || !name || !skills}
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
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <div className='text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className='font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200'
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

