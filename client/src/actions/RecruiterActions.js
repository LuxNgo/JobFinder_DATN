import {
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
} from "../slices/RecruiterSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api.config";

export const getAllJobsRecruiter = () => async (dispatch) => {
  try {
    dispatch(getAllJobsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      `${API_BASE_URL}/recruiter/allJobs`,
      config
    );

    dispatch(getAllJobsSuccess(data.jobs));
  } catch (err) {
    dispatch(
      getAllJobsFail(
        err.response?.data?.message || "Lỗi khi lấy dữ liệu công việc"
      )
    );
    toast.error(err.response?.data?.message || "Lỗi khi lấy dữ liệu công việc");
  }
};

export const getAllAppRecruiter = () => async (dispatch) => {
  try {
    dispatch(getAllAppRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      `${API_BASE_URL}/recruiter/allApp`,
      config
    );
    dispatch(getAllAppSuccess(data.applications));
  } catch (err) {
    dispatch(
      getAllAppFail(err.response?.data?.message || "Lỗi khi lấy dữ liệu")
    );
    toast.error(err.response?.data?.message || "Lỗi khi lấy dữ liệu");
  }
};

export const getAppData = (id) => async (dispatch) => {
  try {
    dispatch(getAppRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      `${API_BASE_URL}/recruiter/getApplication/${id}`,
      config
    );

    dispatch(getAppSuccess(data.application));
  } catch (err) {
    dispatch(getAppFail(err.response?.data?.message || "Lỗi khi lấy dữ liệu"));
    toast.error(err.response?.data?.message || "Lỗi khi lấy dữ liệu");
  }
};

export const updateApplication = (id, dataBody) => async (dispatch) => {
  try {
    if (dataBody.status === "not") {
      toast.info("Lựa chọn trạng thái !");
    } else {
      dispatch(updateAppRequest());

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };

      const { data } = await axios.put(
        `${API_BASE_URL}/recruiter/updateApplication/${id}`,
        dataBody,
        config
      );

      dispatch(updateAppSuccess());
      dispatch(getAppData(id));
      toast.success("Trạng thái được cập nhật !");
    }
  } catch (err) {
    dispatch(
      updateAppFail(err.response?.data?.message || "Lỗi khi cập nhật dữ liệu")
    );
    toast.error(err.response?.data?.message || "Lỗi khi cập nhật dữ liệu");
  }
};

export const deleteApp = (id) => async (dispatch) => {
  try {
    dispatch(deleteAppRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.delete(
      `${API_BASE_URL}/recruiter/deleteApplication/${id}`,
      config
    );

    dispatch(getAllAppRecruiter());
    dispatch(deleteAppSuccess());
    toast.success("Đơn xóa thành công!");
  } catch (err) {
    dispatch(
      deleteAppFail(err.response?.data?.message || "Lỗi khi xóa dữ liệu")
    );
    toast.error(err.response?.data?.message || "Lỗi khi xóa dữ liệu");
  }
};

export const getJobData = (id) => async (dispatch) => {
  try {
    dispatch(getJobRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      `${API_BASE_URL}/recruiter/getJob/${id}`,
      config
    );

    dispatch(getJobSuccess(data.job));
  } catch (err) {
    dispatch(
      getJobFail(err.response?.data?.message || "Lỗi khi lấy dữ liệu job")
    );
    toast.error(err.response?.data?.message || "Lỗi khi lấy dữ liệu job");
  }
};

export const updateJobData = (id, jobData) => async (dispatch) => {
  try {
    dispatch(updateJobRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/recruiter/updateJob/${id}`,
      jobData,
      config
    );

    dispatch(updateJobSuccess());
    dispatch(getAllJobsAdmin());
    dispatch(getJobData(id));
    toast.success("Cập nhật công việc thành công !");
  } catch (err) {
    dispatch(
      updateJobFail(
        err.response?.data?.message || "Lỗi khi cập nhật dữ liệu job"
      )
    );
    toast.error(err.response?.data?.message || "Lỗi khi cập nhật dữ liệu job");
  }
};

export const deleteJobData = (id) => async (dispatch) => {
  try {
    dispatch(deleteJobRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.delete(
      `${API_BASE_URL}/recruiter/deleteJob/${id}`,
      config
    );

    dispatch(deleteJobSuccess());
    dispatch(getAllJobsRecruiter());
    toast.success("Xóa công việc thành công !");
  } catch (err) {
    dispatch(
      deleteJobFail(err.response?.data?.message || "Lỗi khi xóa dữ liệu job")
    );
    toast.error(err.response?.data?.message || "Lỗi khi xóa dữ liệu job");
  }
};
