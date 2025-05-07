import axios from 'axios'
import {createApplicationRequest , createApplicationSuccess, createApplicationFail,
    allAppliedJobsRequest, allAppliedJobsSuccess, allAppliedJobsFail,
    applicationDetailsRequest, applicationDetailsSuccess, applicationDetailsFail,
    deleteApplicationRequest, deleteApplicationSuccess, deleteApplicationFail} from '../slices/ApplicationSlice'
    
import {me} from '../actions/UserActions'
import {toast} from 'react-toastify'
import { API_BASE_URL } from '../config/api.config'

export const createApplication = (id) => async (dispatch) =>{
    try{
        dispatch(createApplicationRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }


        const { data } = await axios.post(`${API_BASE_URL}/createApplication/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        
        console.log(data)
        dispatch(createApplicationSuccess())
        dispatch(me())

    }catch(err){
        dispatch(createApplicationFail(err.response.data.message))
        toast.error(err.response.data.message)
        dispatch(me())
    }
}


export const getAppliedJob = () => async (dispatch) => {
    try{

        dispatch(allAppliedJobsRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/getAllApplication`,config) ;

        dispatch(allAppliedJobsSuccess(data.allApplications))

    }catch(err){
        dispatch(allAppliedJobsFail())
    }
}


export const getSingleApplication = (id) => async (dispatch) => {
    try{

        dispatch(applicationDetailsRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/singleApplication/${id}`,config) ;

        dispatch(applicationDetailsSuccess(data.application))

    }catch(err){
        dispatch(applicationDetailsFail())
    }
}

export const deleteApplication = (id) => async (dispatch) => {
    try{

        dispatch(deleteApplicationRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/deleteApplication/${id}`,config)

        dispatch(deleteApplicationSuccess())
        dispatch(getAppliedJob())
        dispatch(me())
        
        toast.success("Đơn xóa thành công !") 

    }catch(err){
        dispatch(deleteApplicationFail(err.response.data.message))
    }
}