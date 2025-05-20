const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const LRU = require("lru-cache");

// Initialize Gemini API with proper API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
});
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// Create a cache for API responses
const apiCache = new LRU({
  max: 500, // Maximum number of items to cache
  maxAge: 1000 * 60 * 5, // Cache items expire after 5 minutes
});

// Helper function for Gemini API calls
const generateContent = async (prompt, cacheKey) => {
  try {
    // Check cache first
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Add system prompt for better context
    const systemPrompt = `You are a professional CV writer. Generate content that is:
    1. Professional and polished
    2. Specific and quantifiable where possible
    3. Action-oriented using strong verbs
    4. Concise and impactful
    5. Relevant to the job industry
    6. Return the result in Vietnamese`;

    // Format the request to match the curl command format
    const result = await model.generateContent(
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${prompt}`,
              },
            ],
          },
        ],
      },
      {
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }
    );

    // Get the response text
    const response = await result.response;
    const text = response.candidates[0]?.content?.parts[0]?.text || "";

    // Clean the text by removing markdown formatting
    const cleanedText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove **bold** formatting
      .replace(/\*([^*]+)\*/g, "$1") // Remove *italic* formatting
      .replace(/`([^`]+)`/g, "$1") // Remove `code` formatting
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove [link](url) formatting
      .replace(/#+\s+/g, "") // Remove # headings
      .replace(/-{3,}/g, "") // Remove --- horizontal rules
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Lỗi khi tạo CV. Vui lòng thử lại.");
  }
};

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired,
      experience,
      salary,
      category,
      employmentType,
    } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(logo, {
      folder: "logo",

      crop: "scale",
    });

    const newJob = await Job.create({
      title,
      description,
      companyName,
      companyLogo: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      location,
      skillsRequired,
      experience,
      category,
      salary,
      employmentType,
      postedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Công việc đã được tạo",
      newJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.allJobs = async (req, res) => {
  try {
    const Jobs = await Job.find();

    res.status(200).json({
      success: true,
      Jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.oneJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy");

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

exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const JobId = req.params.id;

    if (user.savedJobs.includes(JobId)) {
      const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
      const arr = user.savedJobs.filter(
        (jobid) => jobid.toString() !== jobIdObjectId.toString()
      );

      user.savedJobs = arr;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Đã xóa công việc",
      });
    } else {
      const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
      user.savedJobs.push(jobIdObjectId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Đã lưu công việc",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");

    res.status(200).json({
      success: true,
      savedJob: user.savedJobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Suggest Skills
exports.suggestJobsByAI = async (req, res) => {
  try {
    const { skills } = req.body;
    const cacheKey = `jobs_${skills}`;
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    const formattedSkills = skills.trim();

    const response = await generateContent(`
     You are a career consultant.

      Based on the following skills: ${formattedSkills}

      Please generate a list of 3 suitable job positions, each including:

      1. Job title in Vietnamese with English title in parentheses.
      2. A brief description of the job, emphasizing the role of the given skills.
      3. The seniority level (e.g., Junior, Specialist, Senior, Team Lead, Manager, etc.).
      4. Relevant industries.
      5. A suitability score as a percentage (e.g., 70, 85, 100) indicating how closely the job matches the given skills. Just return only number.
      6. The competitiveness level of this job compared to the applicant's current one (e.g., 1/10, 2/10, 3/10). Just return only number.

      Formatting requirements:

      - Numbered list (1, 2, 3).
      - Each item should have bullet points for description, seniority, and industries.
      - Return the result in Vietnamese, without markdown, special characters, or run-on paragraphs.
      - Separate each section clearly for readability.

      Example format:

      1. Job Title (English Title)  
      - Mô tả: ...  
      - Vị trí: ...  
      - Ngành nghề: ...

      Please start generating the list now.
    Return the result in Vietnamese.
`);
    const jobs = response.split("\n").filter((job) => job.trim());
    apiCache.set(cacheKey, { success: true, jobs });
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Skills suggestion error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi gợi ý skills",
    });
  }
};
