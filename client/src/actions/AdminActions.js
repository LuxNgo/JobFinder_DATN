import {
    getAllJobsRequest,getAllJobsSuccess,getAllJobsFail,
    getAllUsersRequest,getAllUsersSuccess,getAllUsersFail,
    getAllAppRequest,getAllAppSuccess,getAllAppFail,
    getAppRequest, getAppSuccess, getAppFail,
    updateAppRequest, updateAppSuccess, updateAppFail,
    deleteAppRequest, deleteAppSuccess, deleteAppFail,
    getUserRequest,getUserSuccess,getUserFail,
    updateUserRequest,updateUserSuccess,updateUserFail,
    deleteUserRequest,deleteUserSuccess,deleteUserFail,
    getJobRequest, getJobSuccess, getJobFail,
    updateJobRequest, updateJobSuccess, updateJobFail,
    deleteJobRequest, deleteJobSuccess, deleteJobFail
} from '../slices/AdminSlice'
import axios from 'axios'
import {toast} from 'react-toastify'
import { API_BASE_URL } from '../config/api.config'

export const getAllJobsAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllJobsRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/allJobs`,config) ;

        dispatch(getAllJobsSuccess(data.jobs))

    }catch(err){
        dispatch(getAllJobsFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu công việc')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu công việc')
    }
}

export const getAllUsersAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllUsersRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/allUsers`,config) ;

        dispatch(getAllUsersSuccess(data.users))

    }catch(err){
        dispatch(getAllUsersFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu users')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu users')
    }
}

export const getAllAppAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllAppRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/allApp`,config) ;

        dispatch(getAllAppSuccess(data.applications))

    }catch(err){
        dispatch(getAllAppFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu')
    }
}

export const getAppData = (id) => async (dispatch) => {
    try{
        dispatch(getAppRequest())    
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/getApplication/${id}`,config)
        
        dispatch(getAppSuccess(data.application))

    }catch(err){
        dispatch(getAppFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu'))
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu')
    }
}

export const updateApplication = (id,dataBody) => async (dispatch) => {
    try{    
        console.log(dataBody.status)
        if(dataBody.status === "not"){
            toast.info("Lựa chọn trạng thái !")
        }else{
         dispatch(updateAppRequest())    


         const config = {
             headers: {
                 Authorization: `Bearer ${localStorage.getItem('userToken')}`
             } 
         } 

         const {data} = await axios.put(`${API_BASE_URL}/admin/updateApplication/${id}`,dataBody,config)
        
         dispatch(updateAppSuccess())
         dispatch(getAppData(id))
         toast.success("Trạng thái được cập nhật !") 
        }
        
    }catch(err){
        dispatch(updateAppFail(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu'))
        toast.error(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu')
    }
}  


export const deleteApp = (id) => async (dispatch) => {
    try{
        dispatch(deleteAppRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/admin/deleteApplication/${id}`,config)

        
        dispatch(getAllAppAdmin()) 
        dispatch(deleteAppSuccess())
        toast.success("Đơn xóa thành công!")

    }catch(err){
        dispatch(deleteAppFail(err.response?.data?.message || 'Lỗi khi xóa dữ liệu'))
        toast.error(err.response?.data?.message || 'Lỗi khi xóa dữ liệu')
    }
}



export const getUserData = (id) => async (dispatch) => {
    try{
        dispatch(getUserRequest())
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/getUser/${id}`,config)

        dispatch(getUserSuccess(data.user))

    }catch(err){
        dispatch(getUserFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu user')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu user')
    }
} 


export const updateUser = (id,userData) => async (dispatch) => {
    try{
        dispatch(updateUserRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.put(`${API_BASE_URL}/admin/updateUser/${id}`,userData,config)

        dispatch(getUserData(id)) ;
        dispatch(updateUserSuccess())

    }catch(err){
        dispatch(updateUserFail(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu user'))
        toast.error(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu user')
    }
}


export const deleteUser = (id) => async (dispatch) => {
    try{
        dispatch(deleteUserRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/admin/deleteUser/${id}`,config)

        dispatch(getAllUsersAdmin()) ;
        toast.success("Xóa user thành công !")
        dispatch(deleteUserSuccess())

    }catch(err){
        dispatch(deleteUserFail(err.response?.data?.message || 'Lỗi khi xóa dữ liệu user'))
        toast.error(err.response?.data?.message || 'Lỗi khi xóa dữ liệu user')
    }
}


export const getJobData = (id) => async (dispatch) => {
    try{
        dispatch(getJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/admin/getJob/${id}`,config) ;

        dispatch(getJobSuccess(data.job))

    }catch(err){    
        dispatch(getJobFail(err.response?.data?.message || 'Lỗi khi lấy dữ liệu job')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi lấy dữ liệu job')
    }
}

export const updateJobData = (id,jobData) => async (dispatch) => {
    try{
        dispatch(updateJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.put(`${API_BASE_URL}/admin/updateJob/${id}`,jobData,config) ;

        dispatch(updateJobSuccess())
        dispatch(getAllJobsAdmin())
        dispatch(getJobData(id)) 
        toast.success("Cập nhật công việc thành công !")

    }catch(err){    
        dispatch(updateJobFail(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu job')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi cập nhật dữ liệu job')
    }
}


export const deleteJobData = (id) => async (dispatch) => {
    try{
        dispatch(deleteJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/admin/deleteJob/${id}`,config) ;

        dispatch(deleteJobSuccess())
        dispatch(getAllJobsAdmin())
        toast.success("Xóa công việc thành công !")

    }catch(err){    
        dispatch(deleteJobFail(err.response?.data?.message || 'Lỗi khi xóa dữ liệu job')) ;
        toast.error(err.response?.data?.message || 'Lỗi khi xóa dữ liệu job')
    }
}
