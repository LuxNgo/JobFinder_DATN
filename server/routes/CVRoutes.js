const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { 
  generateCV,
  suggestCareerObjective,
  generateWorkExperience,
  suggestSkills,
  generatePDF,
  apiLimiter,
} = require('../controllers/CVControllers');

const router = express.Router();

// CV Generation endpoints
router.route('/cv/generate').post(isAuthenticated, apiLimiter, generateCV);
router.route('/cv/suggest-objective').post(isAuthenticated, apiLimiter, suggestCareerObjective);
router.route('/cv/generate-experience').post(isAuthenticated, apiLimiter, generateWorkExperience);
router.route('/cv/suggest-skills').post(isAuthenticated, apiLimiter, suggestSkills);
router.route('/cv/generate-pdf').post(isAuthenticated, apiLimiter, generatePDF);

module.exports = router;
