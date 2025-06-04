const User = require("../models/UserModel");
const Transaction = require('../models/Transaction'); // Import Transaction model
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/auth");
const cloudinary = require("cloudinary");

exports.purchaseRecruiterPackage = async (req, res) => {
  try {
    const { packageId, packageTitle, amount, durationInMonths } = req.body;
    const userId = req.user._id;

    if (!packageId || !packageTitle || amount === undefined || !durationInMonths) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin gói (packageId, packageTitle, amount, durationInMonths).'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    // --- Payment Gateway Integration Point ---
    // In a real application, you would integrate with a payment gateway here.
    // For this example, we'll assume payment is successful.
    // --- End Payment Gateway Integration Point ---

    // Create Transaction record
    const transaction = await Transaction.create({
      user: userId,
      packageId,
      packageTitle,
      amount,
      // currency: 'VND', // Default is VND as per model
    });

    // Update User's role and active package
    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationInMonths, 10));

    user.role = 'recruiter';
    user.activePackage = {
      packageId,
      packageTitle,
      purchaseDate,
      expiryDate,
      amountPaid: amount,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Gói đã được mua thành công! Tài khoản của bạn đã được nâng cấp thành Nhà tuyển dụng.',
      user,
      transactionId: transaction._id,
    });

  } catch (error) {
    console.error('Error purchasing package:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi mua gói.',
      error: error.message,
    });
  }
};

exports.upgradeToRecruiter = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Check if user is already a recruiter
    if (user.role === "recruiter") {
      return res.status(400).json({
        success: false,
        message: "Bạn đã là nhà tuyển dụng",
      });
    }

    // Update user role to recruiter
    user.role = "recruiter";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Chúc mừng! Bạn đã trở thành nhà tuyển dụng",
    });
  } catch (err) {
    console.error("Error upgrading to recruiter:", err);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi nâng cấp tài khoản",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, skills, resume } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatar",

      crop: "scale",
    });

    const myCloud2 = await cloudinary.v2.uploader.upload(resume, {
      folder: "resume",

      crop: "fit",
    });

    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPass,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      skills,
      resume: {
        public_id: myCloud2.public_id,
        url: myCloud2.secure_url,
      },
    });

    const token = createToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "User Created",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại !",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Xin vui lòng nhập đúng mật khẩu !",
      });
    }

    const token = createToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công !",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        isLogin: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    const userPassword = user.password;

    const isMatch = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "",
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ !",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp !",
      });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Mật khẩu đã được thay đổi !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { newName, newEmail, newAvatar, newResume, newSkills } = req.body;

    const user = await User.findById(req.user._id);

    const avatarId = user.avatar.public_id;
    const resumeId = user.resume.public_id;

    await cloudinary.v2.uploader.destroy(avatarId);
    await cloudinary.v2.uploader.destroy(resumeId);

    const myCloud1 = await cloudinary.v2.uploader.upload(newAvatar, {
      folder: "avatar",
      crop: "scale",
    });

    const myCloud2 = await cloudinary.v2.uploader.upload(newResume, {
      folder: "resume",
      crop: "fit",
    });

    user.name = newName;
    user.email = newEmail;
    user.skills = newSkills;
    user.avatar = {
      public_id: myCloud1.public_id,
      url: myCloud1.secure_url,
    };
    user.resume = {
      public_id: myCloud2.public_id,
      url: myCloud2.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Hồ sơ đã được cập nhật !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      await User.findByIdAndRemove(req.user._id);
    } else {
      return res.status(200).json({
        success: false,
        message: "Mật khẩu không khớp !",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tài khoản đã được xóa !",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
