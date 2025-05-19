import {
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
} from "../slices/JobSlice";
import { toast } from "react-toastify";
import { me } from "../actions/UserActions";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

export const SUGGEST_JOBS_BY_AI_REQUEST = "SUGGEST_JOBS_BY_AI_REQUEST";
export const SUGGEST_JOBS_BY_AI_SUCCESS = "SUGGEST_JOBS_BY_AI_SUCCESS";
export const SUGGEST_JOBS_BY_AI_FAIL = "SUGGEST_JOBS_BY_AI_FAIL";

export const suggestJobsByAIRequest = () => ({
  type: SUGGEST_JOBS_BY_AI_REQUEST,
});

export const suggestJobsByAISuccess = (skills) => ({
  type: SUGGEST_JOBS_BY_AI_SUCCESS,
  payload: skills,
});

export const suggestJobsByAIFail = (error) => ({
  type: SUGGEST_JOBS_BY_AI_FAIL,
  payload: error,
});

export const createJobPost = (jobData) => async (dispatch) => {
  try {
    dispatch(newPostRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/create/job`,
      jobData,
      config
    );

    dispatch(newPostSuccess());
    toast.success("Tạo tin tuyển dụng thành công !");
  } catch (err) {
    dispatch(newPostFail(err.response.data.message));
  }
};

export const getAllJobs = () => async (dispatch) => {
  try {
    dispatch(allJobsRequest());

    const { data } = await axios.get(`${API_BASE_URL}/jobs`);

    // The server returns data in the format { success: true, Jobs: [] }
    if (data && data.success && data.Jobs) {
      dispatch(allJobsSuccess(data.Jobs));
    } else {
      dispatch(allJobsFail("Định dạng dữ liệu không hợp lệ"));
    }
  } catch (err) {
    dispatch(
      allJobsFail(
        err.response?.data?.message || "Lỗi khi lấy danh sách công việc"
      )
    );
  }
};

export const getSingleJob = (id) => async (dispatch) => {
  try {
    dispatch(jobDetailsRequest());

    const { data } = await axios.get(`${API_BASE_URL}/job/${id}`);

    dispatch(jobDetailsSuccess(data.job));
  } catch (err) {
    dispatch(jobDetailsFail(err.response.data.message));
  }
};

export const saveJob = (id) => async (dispatch) => {
  try {
    dispatch(jobSaveRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(`${API_BASE_URL}/saveJob/${id}`, config);

    dispatch(me());
    dispatch(jobSaveSuccess());
    toast.success(data.message);
  } catch (err) {
    dispatch(jobSaveFail(err.response.data.message));
  }
};

export const getSavedJobs = () => async (dispatch) => {
  try {
    dispatch(getSavedJobsRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(`${API_BASE_URL}/getSavedJobs`, config);

    dispatch(getSavedJobsSuccess(data));
  } catch (err) {
    dispatch(getSavedJobsFail(err.response.data.message));
  }
};

export const suggestJobsByAI = (skills) => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("Vui lòng đăng nhập trước");
    }
    dispatch(suggestJobsByAIRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const formattedSkills = skills
      .split("\n")
      .map((skill) => skill.trim())
      .join(",");
    const { data } = await axios.post(
      `${API_BASE_URL}/jobs/suggest-ai`,
      { skills: formattedSkills },
      config
    );
    dispatch(suggestJobsByAISuccess(data.jobs));
    return data.jobs;
  } catch (error) {
    dispatch(
      suggestJobsByAIFail(
        error.response?.data?.message || "Lỗi khi gợi ý kỹ năng"
      )
    );
    toast.error("Thất bại");
    throw error;
  }
};
