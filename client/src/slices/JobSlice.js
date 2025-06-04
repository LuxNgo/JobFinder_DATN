import { createSlice } from "@reduxjs/toolkit";

const JobSlice = createSlice({
  name: "Job",
  initialState: {
    loading: false,
    saveJobLoading: false,
    error: null,
    jobDetails: {
      __v: 0,
      _id: "",
      category: "",
      companyLogo: {
        public_id: "",
        url: "",
      },
      companyName: "",
      createdAt: "",
      description: "",
      employmentType: "",
      experience: "",
      location: "",
      postedBy: "",
      salary: "",
      skillsRequired: [],
      status: "",
      title: " ",
    },
    savedJobs: [],
    allJobs: [],
  },
  reducers: {
    newPostRequest: (state) => {
      state.loading = true;
    },
    newPostSuccess: (state) => {
      state.loading = false;
    },
    newPostFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    allJobsRequest: (state) => {
      state.loading = true;
    },
    allJobsSuccess: (state, action) => {
      state.loading = false;
      state.allJobs = action.payload;
    },
    allJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    jobDetailsRequest: (state) => {
      state.loading = true;
    },
    jobDetailsSuccess: (state, action) => {
      state.loading = false;
      state.jobDetails = action.payload;
    },
    jobDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    jobSaveRequest: (state) => {
      state.saveJobLoading = true;
    },
    jobSaveSuccess: (state) => {
      state.saveJobLoading = false;
    },
    jobSaveFail: (state, action) => {
      state.saveJobLoading = false;
      state.error = action.payload;
    },

    getSavedJobsRequest: (state, action) => {
      state.loading = true;
    },
    getSavedJobsSuccess: (state, action) => {
      state.loading = false;
      state.savedJobs = action.payload.savedJob;
    },
    getSavedJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reducers for job search
    searchJobsRequest: (state) => {
      state.loading = true;
      state.error = null; // Clear previous errors
    },
    searchJobsSuccess: (state, action) => {
      state.loading = false;
      state.allJobs = action.payload; // Update allJobs with search results
      state.error = null;
    },
    searchJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  newPostRequest,
  newPostSuccess,
  newPostFail,
  allJobsRequest,
  allJobsSuccess,
  allJobsFail,
  jobDetailsRequest,
  jobDetailsSuccess,
  jobDetailsFail,
  jobSaveRequest,
  jobSaveSuccess,
  jobSaveFail,
  getSavedJobsRequest,
  getSavedJobsSuccess,
  getSavedJobsFail,
  // Export new search action creators
  searchJobsRequest,
  searchJobsSuccess,
  searchJobsFail,
} = JobSlice.actions;

export default JobSlice.reducer;
