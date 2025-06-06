const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");
const Transaction = require("../models/Transaction"); // Added Transaction model
const cloudinary = require("cloudinary");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

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

// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all applications
exports.getAllApp = async (req, res) => {
  try {
    const applications = await Application.find();

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
exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    application.status = req.body.status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái đơn đăng ký !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa đơn đăng ký !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Get Application
exports.getApplication = async (req, res) => {
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

// Update User Role
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.role = req.body.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Đã cập nhật vai trò người dùng !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa người dùng !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
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
      message: "Đã cập nhật thông tin công việc !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Job
exports.getJob = async (req, res) => {
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

// Get All Transactions for Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Sales Statistics
exports.getSalesStatistics = async (req, res) => {
  try {
    const salesData = await Transaction.aggregate([
      {
        $group: {
          _id: null, // Group all transactions together
          totalSales: { $sum: "$amount" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    if (salesData.length > 0) {
      res.status(200).json({
        success: true,
        totalSales: salesData[0].totalSales,
        totalTransactions: salesData[0].totalTransactions
      });
    } else {
      // No transactions found
      res.status(200).json({
        success: true,
        totalSales: 0,
        totalTransactions: 0
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Single Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa thông tin công việc !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
