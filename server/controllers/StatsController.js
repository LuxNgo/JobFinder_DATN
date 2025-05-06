const Job = require('../models/JobModel');
const Company = require('../models/CompanyModel');
const User = require('../models/UserModel');
const Application = require('../models/ApplicationModel');

exports.getStats = async (req, res) => {
    try {
        // Get active jobs count
        const activeJobs = await Job.countDocuments({ status: 'active' });
        
        // Get companies count
        const companies = await Job.countDocuments();
        
        // Get applicants count
        const applicants = await User.countDocuments({ role: 'applicant' });
        
        // Get hires count (you can adjust this query based on your hiring model)
        const hires = await Application.countDocuments({ status: 'accepted' });

        const stats = {
            activeJobs,
            companies,
            applicants,
            hires
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
            message: error.message
        });
    }
};

