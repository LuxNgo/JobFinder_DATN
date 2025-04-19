import React, { useState } from 'react'
import { MetaData } from '../components/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineUnlock, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdOutlineVpnKey } from 'react-icons/md'
import { TbLoader2 } from 'react-icons/tb'
import { changePass } from '../actions/UserActions'

export const ChangePassword = () => {
    const { loading } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [eyeTog1, setEyeTog1] = useState(false)
    const [eyeTog2, setEyeTog2] = useState(false)
    const [eyeTog3, setEyeTog3] = useState(false)
    const [focusedInput, setFocusedInput] = useState("")

    const changeHandler = (e) => {
        e.preventDefault()
        const data = { oldPassword, newPassword, confirmPassword }
        dispatch(changePass(data))

        if (!loading) {
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }
    }

    return (
        <>
            <MetaData title="Change Password" />
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg mt-10'>
                    <div className='text-center space-y-2'>
                        <h2 className='text-3xl font-bold text-gray-900'>Change Password</h2>
                        <p className='text-gray-500'>Enter your current password and choose a new one</p>
                    </div>

                    <form onSubmit={changeHandler} className='mt-8 space-y-6'>
                        <div className='space-y-5'>
                            {/* Current Password */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor="currentPassword"
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Current Password
                                </label>
                                <div className='relative'>
                                    <div className={`
                                        absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                                        ${focusedInput === 'currentPassword' ? 'text-blue-600' : 'text-gray-400'}
                                    `}>
                                        <MdOutlineVpnKey className='h-5 w-5' />
                                    </div>
                                    <input
                                        id="currentPassword"
                                        type={eyeTog1 ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('currentPassword')}
                                        onBlur={() => setFocusedInput('')}
                                        className={`
                                            w-full pl-12 pr-12 py-3 text-gray-900 text-base
                                            border rounded-lg outline-none transition-all duration-200
                                            ${focusedInput === 'currentPassword' 
                                                ? 'border-blue-600 ring-1 ring-blue-600' 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                        placeholder="Enter your current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setEyeTog1(!eyeTog1)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        {eyeTog1 ? <AiOutlineEye className='h-5 w-5' /> : <AiOutlineEyeInvisible className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor="newPassword"
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    New Password
                                </label>
                                <div className='relative'>
                                    <div className={`
                                        absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                                        ${focusedInput === 'newPassword' ? 'text-blue-600' : 'text-gray-400'}
                                    `}>
                                        <AiOutlineUnlock className='h-5 w-5' />
                                    </div>
                                    <input
                                        id="newPassword"
                                        type={eyeTog2 ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('newPassword')}
                                        onBlur={() => setFocusedInput('')}
                                        className={`
                                            w-full pl-12 pr-12 py-3 text-gray-900 text-base
                                            border rounded-lg outline-none transition-all duration-200
                                            ${focusedInput === 'newPassword' 
                                                ? 'border-blue-600 ring-1 ring-blue-600' 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                        placeholder="Enter your new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setEyeTog2(!eyeTog2)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        {eyeTog2 ? <AiOutlineEye className='h-5 w-5' /> : <AiOutlineEyeInvisible className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor="confirmPassword"
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Confirm New Password
                                </label>
                                <div className='relative'>
                                    <div className={`
                                        absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none
                                        ${focusedInput === 'confirmPassword' ? 'text-blue-600' : 'text-gray-400'}
                                    `}>
                                        <AiOutlineLock className='h-5 w-5' />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={eyeTog3 ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('confirmPassword')}
                                        onBlur={() => setFocusedInput('')}
                                        className={`
                                            w-full pl-12 pr-12 py-3 text-gray-900 text-base
                                            border rounded-lg outline-none transition-all duration-200
                                            ${focusedInput === 'confirmPassword' 
                                                ? 'border-blue-600 ring-1 ring-blue-600' 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                        placeholder="Confirm your new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setEyeTog3(!eyeTog3)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        {eyeTog3 ? <AiOutlineEye className='h-5 w-5' /> : <AiOutlineEyeInvisible className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            {loading ? (
                                <TbLoader2 className='animate-spin h-5 w-5' />
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}


