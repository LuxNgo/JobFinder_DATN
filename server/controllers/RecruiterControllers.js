const Job = require("../models/JobModel");
const Application = require("../models/AppModel");
const cloudinary = require("cloudinary");

// Get all jobs
exports.getAllJobsRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all applications
exports.getAllAppRecruiter = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Application Status
exports.updateApplicationRecruiter = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    application.status = req.body.status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Delete Application
exports.deleteApplicationRecruiter = async (req, res) => {
  try {
    const application = await Application.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Get Application
exports.getApplicationRecruiter = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Job
exports.updateJobRecruiter = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    const logoToDelete_Id = job.companyLogo.public_id;

    await cloudinary.v2.uploader.destroy(logoToDelete_Id);

    const logo = req.body.companyLogo;

    const myCloud = await cloudinary.v2.uploader.upload(logo, {
      folder: "logo",
      crop: "scale",
    });

    req.body.companyLogo = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Job
exports.getJobRecruiter = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Single Job
exports.deleteJobRecruiter = async (req, res) => {
  try {
    const job = await Job.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
