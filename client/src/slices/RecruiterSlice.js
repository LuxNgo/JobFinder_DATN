import { createSlice } from "@reduxjs/toolkit";

const RecruiterSlice = createSlice({
  name: `recruiter`,
  initialState: {
    loading: false,
    allJobsRecruiter: null,
    allApplicationsRecruiter: null,
    allUsersRecruiter: null,
    error: null,
    applicationData: {
      job: {
        title: "",
        companyName: "",
        location: "",
        experience: "",
        companyName: "",
      },
      applicant: {
        name: "",
        email: "",
      },
      applicantResume: {
        url: "",
      },
      status: "",
      createdAt: "",
    },
    jobData: {
      title: "",
      description: "",
      companyName: "",
      companyLogo: {
        url: "",
      },
      location: "",
      skillsRequired: [],
      category: "",
      employmentType: "",
      experience: "",
      salary: "",
    },
  },
  reducers: {
    getAllJobsRequest: (state) => {
      state.loading = true;
    },
    getAllJobsSuccess: (state, action) => {
      state.loading = false;
      state.allJobsRecruiter = action.payload;
    },
    getAllJobsFail: (state, action) => {
      state.loading = false;
      error = action.payload;
    },

    getAllAppRequest: (state) => {
      state.loading = true;
    },
    getAllAppSuccess: (state, action) => {
      state.loading = false;
      state.allApplicationsRecruiter = action.payload;
    },
    getAllAppFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAppRequest: (state) => {
      state.loading = true;
    },
    getAppSuccess: (state, action) => {
      state.loading = false;
      state.applicationData = action.payload;
    },
    getAppFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAppRequest: (state) => {
      state.loading = true;
    },
    updateAppSuccess: (state) => {
      state.loading = false;
    },
    updateAppFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAppRequest: (state) => {
      state.loading = true;
    },
    deleteAppSuccess: (state) => {
      state.loading = false;
    },
    deleteAppFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getJobRequest: (state) => {
      state.loading = true;
    },
    getJobSuccess: (state, action) => {
      state.loading = false;
      state.jobData = action.payload;
    },
    getJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateJobRequest: (state) => {
      state.loading = true;
    },
    updateJobSuccess: (state) => {
      state.loading = false;
    },
    updateJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteJobRequest: (state) => {
      state.loading = true;
    },
    deleteJobSuccess: (state) => {
      state.loading = false;
    },
    deleteJobFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getAllJobsRequest,
  getAllJobsSuccess,
  getAllJobsFail,
  getAllAppRequest,
  getAllAppSuccess,
  getAllAppFail,

  getAppRequest,
  getAppSuccess,
  getAppFail,
  updateAppRequest,
  updateAppSuccess,
  updateAppFail,
  deleteAppRequest,
  deleteAppSuccess,
  deleteAppFail,

  getJobRequest,
  getJobSuccess,
  getJobFail,
  updateJobRequest,
  updateJobSuccess,
  updateJobFail,
  deleteJobRequest,
  deleteJobSuccess,
  deleteJobFail,
} = RecruiterSlice.actions;
export default RecruiterSlice.reducer;
