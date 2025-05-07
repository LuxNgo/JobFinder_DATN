const express = require('express');
const router = express.Router();
const Application = require('../models/ApplicationModel');
const Job = require('../models/JobModel');
const User = require('../models/UserModel');

exports.createApplication = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Công việc không tồn tại'
            });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({
            jobId: req.params.id,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đăng ký công việc này rồi'
            });
        }

        const application = await Application.create({
            jobId: req.params.id,
            applicant: req.user._id,
            status: 'pending'
        });

        // Update user's applied jobs
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { appliedJobs: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: 'Đăng ký thành công',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('jobId', 'title companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSingleApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'title companyName')
            .populate('applicant', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Đơn đăng ký không tồn tại'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Đơn đăng ký không tồn tại'
            });
        }

        if (application.applicant.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Không có quyền xóa đơn đăng ký này'
            });
        }

        await application.deleteOne();

        // Update user's applied jobs
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { appliedJobs: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: 'Đã xóa đơn đăng ký'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
