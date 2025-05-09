import axios from "axios";
import { USER_ROLE_UPGRADE_REQUEST, USER_ROLE_UPGRADE_SUCCESS, USER_ROLE_UPGRADE_FAIL } from "../constants/UserConstants";

export const updateRoleToRecruiter = () => async (dispatch) => {
  try {
    dispatch({ type: USER_ROLE_UPGRADE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/v1/user/upgrade-to-recruiter",
      {},
      config
    );

    dispatch({
      type: USER_ROLE_UPGRADE_SUCCESS,
      payload: data.message,
    });

    // Update user role in localStorage
    localStorage.setItem("role", "recruiter");

    // Redirect to recruiter dashboard
    window.location.href = "/recruiter/dashboard";
  } catch (error) {
    dispatch({
      type: USER_ROLE_UPGRADE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
