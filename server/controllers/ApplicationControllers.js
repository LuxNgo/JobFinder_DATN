const Job = require('../models/JobModel')
const User = require('../models/UserModel')
const Application = require('../models/ApplicationModel')

const mongoose = require('mongoose')


// Creates a new application
exports.createApplication = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (user.appliedJobs.includes(job._id)) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đăng ký công việc này rồi"
            })
        }

        const application = await Application.create({
            jobId: job._id,
            applicant: user._id,
            status: 'pending'
        });
        user.appliedJobs.push(job._id)
        await user.save();

        res.status(200).json({
            success: true,
            message: "Đăng ký thành công",
            application
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}


// Get a single application
exports.getSingleApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job applicant');

        res.status(200).json({
            success: true,
            application
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// Gets all applications of an user
exports.getUsersAllApplications = async (req, res) => {
    try {
        const allApplications = await Application.find({ applicant: req.user._id }).populate('job')
            .populate('applicant');

        res.status(200).json({
            success: true,
            allApplications
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Delete application 
exports.deleteApplication = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
       
        const applicationId = req.params.id;     

        const application = await Application.findById(req.params.id) 
        

        if(!application){
            return res.status(400).json({
                success: false,
                message: "Application already deleted"
            })
        }
       
        const applicationToDelete = await Application.findByIdAndRemove(applicationId);
       
        const jobId = application.job
        const MongooseObjectId = new mongoose.Types.ObjectId(jobId)

        const newAppliedJobs = user.appliedJobs.filter((e) => (
            e.toString() !== MongooseObjectId.toString()
        ))
    
        
        user.appliedJobs = newAppliedJobs;


        await user.save();

        res.status(200).json({
            success: true,
            message: "Application deleted"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}