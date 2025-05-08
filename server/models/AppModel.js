const mongoose = require('mongoose') ;

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    jobExperience: {
        type: String,
        required: true
    },
    jobCompany: {
        type: String,
        required: true
    },
    jobSalary: {
        type: String,
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantResume: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        },
    },
    applicantEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;
