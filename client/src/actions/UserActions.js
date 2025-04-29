import {
    registerRequest, registerSuccess, registerFail, loginRequest, loginSuccess, loginFail
    , isLoginRequest, isLoginSuccess, isLoginFail, getMeRequest, getMeSuccess, getMeFail,
    changePasswordRequest, changePasswordSuccess, changePasswordFail,
    updateProfileRequest, updateProfileSuccess, updateProfileFail,
    deleteAccountRequest, deleteAccountSuccess, deleteAccountFail, logoutClearState
} from '../slices/UserSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_BASE_URL } from '../config/api.config'

export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        const { data } = await axios.post(`${API_BASE_URL}/register`, userData);

        dispatch(registerSuccess())
        localStorage.setItem('userToken', data.token)
        dispatch(logOrNot())
        toast.success("Registration successful !")

    } catch (err) {
        dispatch(registerFail(err.response.data.message))
        if (err.response.data.message.includes("duplicate")) {
            toast.error("User already exists.")
        } else {
            toast.error(err.response.data.message)
        }
    }
}


export const loginUser = (userData) => async (dispatch) => {
    try {
        dispatch(loginRequest())

        const { data } = await axios.post(`${API_BASE_URL}/login`, userData);

        dispatch(loginSuccess())
        localStorage.setItem('userToken', data.token)
        dispatch(logOrNot())
        dispatch(me())
        toast.success("Login successful !")

    } catch (err) {
        dispatch(loginFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const logOrNot = () => async (dispatch) => {
    try {
        dispatch(isLoginRequest())
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        if (!token) {
            dispatch(isLoginFail())
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`${API_BASE_URL}/isLogin`, config);
            
            if (data.success && data.isLogin) {
                dispatch(isLoginSuccess(true))
                // Also get user data if login is successful
                dispatch(me())
            } else {
                // Clear invalid token if login check fails
                localStorage.removeItem('userToken');
                dispatch(isLoginFail())
            }
        } catch (err) {
            // Clear invalid token if request fails
            localStorage.removeItem('userToken');
            dispatch(isLoginFail())
        }
    } catch (err) {
        dispatch(isLoginFail())
    }
}


export const me = () => async (dispatch) => {
    try {
        dispatch(getMeRequest())
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        if (!token) {
            // No token means not logged in
            dispatch(getMeFail())
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`${API_BASE_URL}/me`, config);
            
            if (data.success && data.user) {
                localStorage.setItem("role", data.user.role)
                dispatch(getMeSuccess(data.user))
            } else {
                // Clear invalid token if request fails
                localStorage.removeItem('userToken');
                dispatch(getMeFail())
            }
        } catch (err) {
            // Clear invalid token if request fails
            localStorage.removeItem('userToken');
            dispatch(getMeFail())
            if (err.response?.data?.message) {
                toast.error(err.response.data.message)
            }
        }
    } catch (err) {
        dispatch(getMeFail())
    }
}


export const changePass = (userData) => async (dispatch) => {
    try {
        dispatch(changePasswordRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/changePassword`, userData, config)

        dispatch(changePasswordSuccess())
        toast.success("Password Changed successfully !")

    } catch (err) {
        dispatch(changePasswordFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/updateProfile`, userData, config)

        dispatch(updateProfileSuccess())
        toast.success("Profile Updated successfully !")
        dispatch(me())

    } catch (err) {
        dispatch(updateProfileFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const deleteAccount = (userData) => async (dispatch) => {
    try {
        console.log(userData)


        dispatch(deleteAccountRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/deleteAccount`, userData, config)

        console.log(data)

        dispatch(deleteAccountSuccess())
        if (data.message === "Account Deleted") {
            toast.success("Account Deleted successfully !")
            localStorage.removeItem('userToken')
            dispatch(logOrNot())
            dispatch(logoutClearState())
        }else{
            toast.error("Wrong Password !")
        }


    }
    catch (err) {
        dispatch(deleteAccountFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}
