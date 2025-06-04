import {
  registerRequest,
  registerSuccess,
  registerFail,
  loginRequest,
  loginSuccess,
  loginFail,
  isLoginRequest,
  isLoginSuccess,
  isLoginFail,
  getMeRequest,
  getMeSuccess,
  getMeFail,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFail,
  logoutClearState,
  roleUpgradeRequest,
  roleUpgradeSuccess,
  roleUpgradeFail,
  packagePurchaseRequest,
  packagePurchaseSuccess,
  packagePurchaseFail,
} from "../slices/UserSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post(`${API_BASE_URL}/register`, userData);

    dispatch(registerSuccess());
    localStorage.setItem("userToken", data.token);
    dispatch(logOrNot());
    toast.success("Đăng ký thành công !");
  } catch (err) {
    dispatch(registerFail(err.response.data.message));
    if (err.response.data.message.includes("duplicate")) {
      toast.error("Người dùng đã tồn tại");
    } else {
      toast.error(err.response.data.message);
    }
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`${API_BASE_URL}/login`, userData);
    dispatch(loginSuccess());
    localStorage.setItem("userToken", data.token);
    dispatch(logOrNot());
    dispatch(me());
    toast.success("Đăng nhập thành công !");
  } catch (err) {
    dispatch(loginFail(err.response.data.message));
    toast.error(err.response.data.message);
  }
};

export const logOrNot = () => async (dispatch) => {
  try {
    dispatch(isLoginRequest());

    // Get token from localStorage
    const token = localStorage.getItem("userToken");
    if (!token) {
      dispatch(isLoginFail());
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/isLogin`, config);
      if (response.data.success && response.data.isLogin) {
        dispatch(isLoginSuccess(true));
        dispatch(me());
      } else {
        localStorage.removeItem("userToken");
        dispatch(isLoginFail());
      }
    } catch (error) {
      localStorage.removeItem("userToken");
      dispatch(isLoginFail());
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
  } catch (err) {
    dispatch(isLoginFail());
  }
};

export const me = () => async (dispatch) => {
  try {
    dispatch(getMeRequest());

    // Get token from localStorage
    const token = localStorage.getItem("userToken");
    if (!token) {
      // No token means not logged in
      dispatch(getMeFail());
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/me`, config);

      if (response.data.success && response.data.user) {
        localStorage.setItem("role", response.data.user.role);
        dispatch(getMeSuccess(response.data.user));
      } else {
        localStorage.removeItem("userToken");
        dispatch(getMeFail());
        toast.error("Failed to fetch user data");
      }
    } catch (err) {
      // Clear invalid token if request fails
      localStorage.removeItem("userToken");
      dispatch(getMeFail());
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      }
    }
  } catch (err) {
    dispatch(getMeFail());
  }
};

export const changePass = (userData) => async (dispatch) => {
  try {
    dispatch(changePasswordRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/changePassword`,
      userData,
      config
    );

    dispatch(changePasswordSuccess());
    toast.success("Password Changed successfully !");
  } catch (err) {
    dispatch(changePasswordFail(err.response.data.message));
    toast.error(err.response.data.message);
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/updateProfile`,
      userData,
      config
    );

    dispatch(updateProfileSuccess());
    toast.success("Profile Updated successfully !");
    dispatch(me());
  } catch (err) {
    dispatch(updateProfileFail(err.response.data.message));
    toast.error(err.response.data.message);
  }
};

export const deleteAccount = (userData) => async (dispatch) => {
  try {
    console.log(userData);

    dispatch(deleteAccountRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/deleteAccount`,
      userData,
      config
    );

    console.log(data);

    dispatch(deleteAccountSuccess());
    if (data.message === "Account Deleted") {
      toast.success("Account Deleted successfully !");
      localStorage.removeItem("userToken");
      dispatch(logOrNot());
      dispatch(logoutClearState());
    } else {
      toast.error("Xin vui lòng nhập đúng mật khẩu !");
    }
  } catch (err) {
    dispatch(deleteAccountFail(err.response.data.message));
    toast.error(err.response.data.message);
  }
};

export const updateRoleToRecruiter = () => async (dispatch) => {
  try {
    dispatch(roleUpgradeRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/upgrade-to-recruiter`,
      {},
      config
    );

    dispatch(roleUpgradeSuccess());
    toast.success("Chúc mừng! Bạn đã trở thành nhà tuyển dụng");
  } catch (error) {
    dispatch(roleUpgradeFail(error.response?.data?.message || "Có lỗi xảy ra"));
    toast.error(error.response?.data?.message || "Có lỗi xảy ra");
  }
};

export const purchasePackageAction = (packageData) => async (dispatch) => {
  try {
    dispatch(packagePurchaseRequest());

    const token = localStorage.getItem("userToken");
    if (!token) {
      dispatch(packagePurchaseFail("Vui lòng đăng nhập để thực hiện giao dịch."));
      toast.error("Vui lòng đăng nhập để thực hiện giao dịch.");
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Assuming API_BASE_URL is defined and you want to use it.
    // The backend route is /api/v1/user/purchase-package.
    // If API_BASE_URL is just 'http://localhost:3000', then the path should be '/api/v1/user/purchase-package'.
    // If API_BASE_URL includes '/api/v1', then it should be '/user/purchase-package'.
    // Using the full path to be safe, assuming API_BASE_URL does not include /api/v1
    const { data } = await axios.post(`${API_BASE_URL}/user/purchase-package`, packageData, config);

    if (data.success) {
      dispatch(packagePurchaseSuccess(data)); // data should contain { success, message, user, transactionId }
      toast.success(data.message || "Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.");
      dispatch(me()); // Refresh user data to get the latest role and package info
    } else {
      dispatch(packagePurchaseFail(data.message || "Thanh toán không thành công."));
      toast.error(data.message || "Thanh toán không thành công.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi máy chủ trong quá trình thanh toán.";
    dispatch(packagePurchaseFail(errorMessage));
    toast.error(errorMessage);
  }
};
