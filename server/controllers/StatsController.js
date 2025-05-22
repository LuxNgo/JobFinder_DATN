const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");

exports.getStats = async (req, res) => {
  try {
    // Get active jobs count
    const activeJobs = await Job.countDocuments({ status: "active" });

    // Get companies count (count distinct company names)
    const companies = await Job.distinct("companyName");

    // Get applicants count (count users with role 'applicant')
    const applicants = await User.countDocuments({ role: "applicant" });

    // Get hires count (count accepted applications)
    const hires = await Application.countDocuments({ status: "accepted" });

    const stats = {
      activeJobs,
      companies: companies.length, // Return the length of distinct companies
      applicants,
      hires,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê",
      message: error.message,
    });
  }
};
