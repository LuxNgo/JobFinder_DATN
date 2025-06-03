import {createSlice} from '@reduxjs/toolkit'

const ApplicationSlice = createSlice({
    name: 'Application',
    initialState:{
        loading: false,
        error: null,
        appliedJobs: [],
        applicationDetails: {
          applicant:{  _id: "",
            name: "",
            email: ""
          },
          applicantResume:{
            public_id:"",
            url:""
          },
          job: {
            _id: "",
            title: "",
            companyName: ""
          },
          status: "",
          createdAt: "" ,          
        }
    },
    reducers:{
        createApplicationRequest: (state)=>{
            state.loading = true 
        },
        createApplicationSuccess: (state, action)=>{
            state.loading = false 
            state.appliedJobs = action.payload
        },
        createApplicationFail: (state, action)=>{
            state.loading = false
            state.error = action.payload 
        },

        allAppliedJobsRequest: (state)=>{
            state.loading = true 
        },
        allAppliedJobsSuccess: (state,action)=>{
            state.loading = false 
            state.appliedJobs = action.payload
        },
        allAppliedJobsFail: (state, action)=>{
            state.loading = false
            state.error = action.payload 
        },


        applicationDetailsRequest: (state)=>{
            state.loading = true ;
        },
        applicationDetailsSuccess: (state, action)=>{
            state.loading = false ;
            state.applicationDetails = action.payload
        },
        applicationDetailsFail: (state, action)=>{
            state.loading = false ;
            state.error = action.payload
        },


        removeAppliedJobRequest: (state) => {
            state.loading = true;
        },
        removeAppliedJobSuccess: (state, action) => {
            state.loading = false;
            state.appliedJobs = action.payload;
        },
        removeAppliedJobFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


        deleteApplicationRequest: (state)=>{
            state.loading = true ;
        },
        deleteApplicationSuccess: (state)=>{
            state.loading = false ;
        },
        deleteApplicationFail: (state, action)=>{
            state.loading = false ;
            state.error = action.payload
        }
    }
})

export const {createApplicationRequest ,createApplicationSuccess, createApplicationFail,
    allAppliedJobsRequest, allAppliedJobsSuccess, allAppliedJobsFail,
    applicationDetailsRequest, applicationDetailsSuccess, applicationDetailsFail,
    removeAppliedJobRequest, removeAppliedJobSuccess, removeAppliedJobFail,
    deleteApplicationRequest, deleteApplicationSuccess, deleteApplicationFail } = ApplicationSlice.actions

export default ApplicationSlice.reducer