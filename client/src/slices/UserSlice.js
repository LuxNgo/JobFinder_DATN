import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "User",
  initialState: {
    packagePurchaseLoading: false,
    packagePurchaseError: null,
    loading: false,
    error: null,
    isLogin: false,
    me: {
      avatar: {
        public_id: "",
        url: "",
      },
      resume: {
        public_id: "",
        url: "",
      },
      _id: "",
      name: "",
      email: "",
      role: "",
      skills: [],
      createdAt: "",
      appliedJobs: [],
    },
    userDetails: {
      avatar: {
        public_id: "",
        url: "",
      },
      resume: {
        public_id: "",
        url: "",
      },
      _id: "",
      name: "",
      email: "",
      role: "",
      skills: [],
      createdAt: "",
    },
  },
  reducers: {
    roleUpgradeRequest: (state) => {
      state.loading = true;
    },
    roleUpgradeSuccess: (state) => {
      state.loading = false;
    },
    roleUpgradeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.loading = true;
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state) => {
      state.loading = false;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    isLoginRequest: (state) => {
      state.isLogin = false;
    },
    isLoginSuccess: (state) => {
      state.isLogin = true;
    },
    isLoginFail: (state, action) => {
      state.isLogin = false;
    },

    getMeRequest: (state) => {
      state.loading = true;
    },
    getMeSuccess: (state, action) => {
      state.loading = false;
      state.me = action.payload;
    },
    getMeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    changePasswordRequest: (state) => {
      state.loading = true;
    },
    changePasswordSuccess: (state) => {
      state.loading = false;
    },
    changePasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfileRequest: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state) => {
      state.loading = false;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAccountRequest: (state) => {
      state.loading = true;
    },
    deleteAccountSuccess: (state) => {
      state.loading = false;
    },
    deleteAccountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    packagePurchaseRequest: (state) => {
      state.packagePurchaseLoading = true;
      state.packagePurchaseError = null;
    },
    packagePurchaseSuccess: (state, action) => {
      state.packagePurchaseLoading = false;
      state.me = action.payload.user; // Assuming payload.user contains the updated user object
      // If your backend doesn't return the full user object with activePackage, 
      // you might need to manually set state.me.role and state.me.activePackage here
      // e.g., state.me.role = 'recruiter'; 
      // state.me.activePackage = action.payload.activePackageData; 
      state.isLogin = true; // Ensure user is still considered logged in
    },
    packagePurchaseFail: (state, action) => {
      state.packagePurchaseLoading = false;
      state.packagePurchaseError = action.payload;
    },
    clearPackagePurchaseError: (state) => {
      state.packagePurchaseError = null;
    },

    logoutClearState: (state) => {
      state.me = {
        avatar: {
          public_id: "",
          url: "",
        },
        resume: {
          public_id: "",
          url: "",
        },
        _id: "",
        name: "",
        email: "",
        role: "",
        skills: [],
        createdAt: "",
        appliedJobs: [],
      };
      state.userDetails = {
        avatar: {
          public_id: "",
          url: "",
        },
        resume: {
          public_id: "",
          url: "",
        },
        _id: "",
        name: "",
        email: "",
        role: "",
        skills: [],
        createdAt: "",
      };
      state.isLogin = false;
    },
  },
});

export const {
  roleUpgradeRequest,
  roleUpgradeSuccess,
  roleUpgradeFail,
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
  packagePurchaseRequest,
  packagePurchaseSuccess,
  packagePurchaseFail,
  clearPackagePurchaseError,
} = UserSlice.actions;

export default UserSlice.reducer;
