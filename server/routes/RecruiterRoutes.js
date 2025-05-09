const express = require("express");
const {
  getAllJobsRecruiter,
  getAllAppRecruiter,
  updateApplicationRecruiter,
  deleteApplicationRecruiter,
  getApplicationRecruiter,
  getJobRecruiter,
  updateJobRecruiter,
  deleteJobRecruiter,
} = require("../controllers/RecruiterControllers");
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth");
const {
  applicationIdValidator,
  validateHandler,
  JobIdValidator,
} = require("../middlewares/validators");
const router = express.Router();

// Recruiter Routes
router
  .route("/recruiter/allJobs")
  .get(isAuthenticated, authorizationRoles("recruiter"), getAllJobsRecruiter);
router
  .route("/recruiter/allApp")
  .get(isAuthenticated, authorizationRoles("recruiter"), getAllAppRecruiter);
router
  .route("/recruiter/getApplication/:id")
  .get(
    isAuthenticated,
    authorizationRoles("recruiter"),
    applicationIdValidator(),
    validateHandler,
    getApplicationRecruiter
  );
router
  .route("/recruiter/updateApplication/:id")
  .put(
    isAuthenticated,
    authorizationRoles("recruiter"),
    applicationIdValidator(),
    validateHandler,
    updateApplicationRecruiter
  );
router
  .route("/recruiter/deleteApplication/:id")
  .delete(
    isAuthenticated,
    authorizationRoles("recruiter"),
    applicationIdValidator(),
    validateHandler,
    deleteApplicationRecruiter
  );

// Job Routes
router
  .route("/recruiter/getJob/:id")
  .get(
    isAuthenticated,
    authorizationRoles("recruiter"),
    JobIdValidator(),
    validateHandler,
    getJobRecruiter
  );
router
  .route("/recruiter/updateJob/:id")
  .put(
    isAuthenticated,
    authorizationRoles("recruiter"),
    JobIdValidator(),
    validateHandler,
    updateJobRecruiter
  );
router
  .route("/recruiter/deleteJob/:id")
  .delete(
    isAuthenticated,
    authorizationRoles("recruiter"),
    JobIdValidator(),
    validateHandler,
    deleteJobRecruiter
  );

module.exports = router;
