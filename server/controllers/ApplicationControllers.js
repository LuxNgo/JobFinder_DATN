const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");

const mongoose = require("mongoose");

// Creates a new application
exports.createApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const JobId = req.params.id;

    // Check if user has already applied
    if (user.appliedJobs.includes(JobId)) {
      // Remove job from applied jobs
      const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
      const arr = user.appliedJobs.filter(
        (jobid) => jobid.toString() !== jobIdObjectId.toString()
      );
      user.appliedJobs = arr;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Đã xóa công việc khỏi danh sách đã ứng tuyển",
      });
    } else {
      // Create new application
      const application = await Application.create({
        jobId: job._id,
        jobTitle: job.title,
        jobLocation: job.location,
        jobExperience: job.experience,
        jobCompany: job.companyName,
        jobSalary: job.salary,
        postedBy: job.postedBy,
        applicantId: user._id,
        applicantName: user.name,
        applicantResume: user.resume,
        applicantEmail: user.email,
        status: "pending",
      });
      // Update user's applied jobs
      user.appliedJobs.push(job._id);
      await user.save();

      res.status(200).json({
        success: true,
        message: "Đăng ký thành công",
        application,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get a single application
exports.getSingleApplication = async (req, res) => {
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

// Gets all applications of an user
exports.getUsersAllApplications = async (req, res) => {
  try {
    // Find applications and populate the applicant field
    const allApplications = await Application.find({
      applicantId: req.user._id,
    });

    res.status(200).json({
      success: true,
      applications: allApplications,
      count: allApplications.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đăng ký",
      });
    }

    // Remove jobId from user's appliedJobs array
    const user = await User.findById(application.applicantId);
    if (user) {
      user.appliedJobs = user.appliedJobs.filter(
        (id) => id.toString() !== application.jobId.toString()
      );
      await user.save();
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa đơn đăng ký thành công",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Remove a job from user's appliedJobs array and delete the application
exports.removeAppliedJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Delete the application record
    await Application.findOneAndDelete({
      jobId,
      applicantId: user._id,
    });

    // Remove jobId from user's appliedJobs array
    user.appliedJobs = user.appliedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đã xóa công việc khỏi danh sách đã ứng tuyển",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
