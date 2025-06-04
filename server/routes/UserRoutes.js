const express = require("express");
const {
  register,
  login,
  isLogin,
  me,
  changePassword,
  updateProfile,
  deleteAccount,
  upgradeToRecruiter,
  purchaseRecruiterPackage, // Added purchaseRecruiterPackage here
} = require("../controllers/UserControllers"); // Corrected path
const { isAuthenticated } = require("../middlewares/auth");
const {
  registerValidator,
  validateHandler,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  deleteAccountValidator,
} = require("../middlewares/validators");
const router = express.Router();

router.route("/register").post(registerValidator(), validateHandler, register);
router.route("/login").post(loginValidator(), validateHandler, login);
router.route("/isLogin").get(isAuthenticated, isLogin);
router.route("/me").get(isAuthenticated, me);
router
  .route("/changePassword")
  .put(
    isAuthenticated,
    changePasswordValidator(),
    validateHandler,
    changePassword
  );
router
  .route("/updateProfile")
  .put(
    isAuthenticated,
    updateProfileValidator(),
    validateHandler,
    updateProfile
  );
router
  .route("/deleteAccount")
  .put(
    isAuthenticated,
    deleteAccountValidator(),
    validateHandler,
    deleteAccount
  );
router.route("/upgrade-to-recruiter").put(isAuthenticated, upgradeToRecruiter);

// Purchase Recruiter Package
router.post('/user/purchase-package', isAuthenticated, purchaseRecruiterPackage);

module.exports = router;
