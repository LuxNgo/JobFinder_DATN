import {newPostRequest, newPostSuccess, newPostFail, allJobsRequest, allJobsSuccess, allJobsFail,
    jobDetailsRequest, jobDetailsSuccess, jobDetailsFail,  jobSaveRequest, jobSaveSuccess, jobSaveFail,
    getSavedJobsRequest, getSavedJobsSuccess, getSavedJobsFail
}  from '../slices/JobSlice'
import {toast} from 'react-toastify'
import {me} from '../actions/UserActions'
import axios from 'axios'
import { API_BASE_URL } from '../config/api.config'

export const createJobPost = (jobData) => async (dispatch) => {
    try{
        dispatch(newPostRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.post(`${API_BASE_URL}/create/job`,jobData,config) ;        

        dispatch(newPostSuccess()) ;
        toast.success("Job posted successfully !")

    }catch(err){
        dispatch(newPostFail(err.response.data.message))
    }
}

export const getAllJobs = () => async (dispatch) => {
    try{
        dispatch(allJobsRequest()) ;

        const {data} = await axios.get(`${API_BASE_URL}/jobs`) ;

        dispatch(allJobsSuccess(data.Jobs)) ;

    }catch(err){
        dispatch(allJobsFail(err.response.data.message))   
    }
}

export const getSingleJob = (id) => async (dispatch) => {
    try{
        dispatch(jobDetailsRequest()) ;

        const {data} = await axios.get(`${API_BASE_URL}/job/${id}`) ;

        dispatch(jobDetailsSuccess(data.job)) ;

    }catch(err){
        dispatch(jobDetailsFail(err.response.data.message))   
    }
}

export const saveJob = (id) => async (dispatch) => {
    try{
        dispatch(jobSaveRequest()) ;

        const config = {
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const {data} = await axios.get(`${API_BASE_URL}/saveJob/${id}`,config) ;

        dispatch(me())
        dispatch(jobSaveSuccess()) ;
        toast.success(data.message)   

    }catch(err){
        dispatch(jobSaveFail(err.response.data.message)) ;
    }
} 

export const getSavedJobs = () => async (dispatch) => {
    try{
        dispatch(getSavedJobsRequest())

        const config = {
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const {data} = await axios.get(`${API_BASE_URL}/getSavedJobs`,config) ;

        dispatch(getSavedJobsSuccess(data))

    }catch(err){
        dispatch(getSavedJobsFail(err.response.data.message))
    }
}