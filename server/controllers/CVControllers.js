const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const LRU = require("lru-cache");
const rateLimit = require("express-rate-limit");

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

// Rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

// CV Templates
const CV_TEMPLATES = {
  professional: "professional-template.html",
  elegant: "elegant-template.html",
  bold: "bold-template.html",
  techy: "techy-template.html",
};

// CV Sections
const CV_SECTIONS = [
  "personal_info",
  "career_objective",
  "work_experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects_achievements",
];

const generatePDF = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { cvData, template } = req.body;

    // Validate input
    if (!cvData || !template) {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        details: "Both cvData and template are required",
      });
    }

    if (!CV_TEMPLATES[template]) {
      return res.status(400).json({
        success: false,
        error: "Invalid template",
        details: `Template '${template}' is not supported.`,
      });
    }

    // Load template HTML file
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      CV_TEMPLATES[template]
    );
    const htmlTemplate = await fs.readFile(templatePath, "utf-8");

    // Compile template with Handlebars
    const compiledTemplate = Handlebars.compile(htmlTemplate);

    // Prepare CV data
    const transformedData = {
      personalInfo: {
        fullName: cvData.personalInfo?.fullName || "N/A",
        email: cvData.personalInfo?.email || "N/A",
        phone: cvData.personalInfo?.phone || "N/A",
        location: cvData.personalInfo?.location || "N/A",
        summary: cvData.personalInfo?.summary || "",
      },
      experience:
        cvData.experiences?.map((exp) => ({
          title: exp.title || "N/A",
          organization: exp.organization || "N/A",
          startDate: exp.startDate || "N/A",
          endDate: exp.endDate || "Hiện tại",
          description: exp.description || "",
        })) || [],
      education:
        cvData.education?.map((edu) => ({
          degree: edu.degree || "N/A",
          institution: edu.institution || "N/A",
          startDate: edu.startDate || "N/A",
          endDate: edu.endDate || "Hiện tại",
        })) || [],
      skills: cvData.skills || [],
    };

    // Render HTML with data
    const renderedHTML = compiledTemplate(transformedData);

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(renderedHTML, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    });

    await browser.close();

    // Send PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cvData.personalInfo?.fullName || "CV"}.pdf"`
    );
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

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

// Generate CV
// Generate CV
const generateCV = async (req, res) => {
  try {
    // Destructure with default empty arrays for optional fields
    const {
      personalInfo,
      jobTitle,
      industry,
      workExperience = [],
      education = [],
      skills = [],
      certifications = [],
      languages = [],
      projects = [],
      template = "modern",
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập chức danh và ngành nghề",
      });
    }

    // Generate career objective
    const careerObjective = await generateContent(`
      Generate a compelling career objective for a ${jobTitle} in ${industry} industry.
    Return the result in Vietnamese
      Focus on key skills and achievements relevant to this role.
      Format: A clear, concise statement that highlights your career goals and what you bring to the role.
    `);

    // Generate work experience bullet points if workExperience exists and has items
    let enhancedWorkExperience = [];
    if (workExperience && workExperience.length > 0) {
      for (const exp of workExperience) {
        try {
          // Create a mock request object for generateWorkExperience
          const mockReq = {
            body: {
              title: exp.title || "",
              organization: exp.organization || "",
              description: exp.description || "",
              type: exp.type || "full-time",
            },
          };
          const mockRes = {
            json: (data) => {
              if (data.success && data.experience) {
                enhancedWorkExperience.push({
                  ...exp,
                  generatedDescription: data.experience.join("\n"),
                });
              }
            },
          };

          await generateWorkExperience(mockReq, mockRes);
        } catch (error) {
          console.error("Error generating work experience:", error);
          // If generation fails, keep the original experience
          enhancedWorkExperience.push(exp);
        }
      }
    }
    const workExperienceBullets =
      workExperience.length > 0
        ? await Promise.all(
            workExperience.map((exp) =>
              generateContent(`
        Generate impactful bullet points for the role of ${exp.title} at ${exp.company}.
      Return the result in Vietnamese
        Focus on achievements and quantifiable results.
        Format: List of 3-5 bullet points highlighting key responsibilities and accomplishments.
      `)
            )
          )
        : [];

    // Generate skills section with industry-specific suggestions
    const skillsSection = await generateContent(`
      Generate a concise paragraph highlighting 3-5 key skills relevant to the ${industry} industry.
      Return the result in Vietnamese
      Focus on the most essential technical and soft skills for this industry.
      Format: A single paragraph that flows naturally and highlights key skills.
      Return the skills in a single paragraph without bullet points or markdown formatting.
    `);

    // Generate projects/achievements
    const projectsSection = await generateContent(`
      Generate impactful project descriptions for a ${jobTitle}.
      Return the result in Vietnamese
      Focus on technical achievements and business impact.
      Format: List of 3-4 key projects with brief descriptions and outcomes.
      Return the projects as a simple list without any markdown formatting or special characters.
    `);

    // Select appropriate template based on industry
    const selectedTemplate = CV_TEMPLATES[template];
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      selectedTemplate
    );

    // Read template
    const templateContent = await fs.readFile(templatePath, "utf-8");

    // Generate final CV content in the expected format
    const cvContent = {
      personalInfo: {
        fullName: personalInfo?.fullName || "",
        email: personalInfo?.email || "",
        phone: personalInfo?.phone || "",
        location: personalInfo?.location || "",
        summary: careerObjective || "Career objective will appear here",
      },
      experience: (enhancedWorkExperience.length > 0
        ? enhancedWorkExperience
        : workExperience
      ).map((exp, index) => ({
        jobTitle: exp.title || "",
        company: exp.organization || "",
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description:
          exp.generatedDescription || workExperienceBullets[index] || "",
      })),
      education: education.map((edu) => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
      })),
      skills: skillsSection
        ? skillsSection.split(",").map((skill) => skill.trim())
        : [],
      certifications: certifications.map((cert) => ({
        name: cert.name || "",
        organization: cert.organization || "",
        date: cert.date || "",
      })),
      languages: languages.map((lang) => ({
        language: lang.language || "",
        level: lang.level || "",
      })),
      projects: projectsSection
        ? projectsSection
            .split("\n")
            .filter(Boolean)
            .map((project) => ({
              title: project,
              description: "",
            }))
        : [],
      template,
    };

    // Format for download
    const cvHtml = templateContent.replace(/{{(.*?)}}/g, (match, p1) => {
      return cvContent[p1.trim()];
    });

    res.json({
      success: true,
      cvContent,
      message: "CV đã được tạo thành công",
    });
  } catch (error) {
    console.error("CV generation error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi tạo CV. Vui lòng thử lại.",
    });
  }
};

// Suggest Career Objective
const suggestCareerObjective = async (req, res) => {
  try {
    const { jobTitle, industry } = req.body;

    // Create a focused prompt that generates a specific career objective
    const prompt = `You are a professional CV writer. Generate a concise and compelling career objective for a ${jobTitle} position in the ${industry} industry.
    Return the result in Vietnamese 
    
    Important: Return only the career objective text without any headings, bullet points, or markdown formatting. The text should be clean and ready to use. Do not show text "Career Objective"
    
    The objective should be 1-2 sentences long and focus on:
    - The candidate's passion for the industry
    - Their career aspirations
    - Their value proposition for the role
    
    Example output:
    A highly creative and technically skilled video editor eager to contribute to a forward-thinking technology company by leveraging expertise in visual storytelling and cutting-edge editing techniques to produce engaging and impactful content.
    
    Note: Return just the text without any formatting characters. Do not show text "Career Objective"`;

    const response = await generateContent(prompt);

    // Clean up the response and format it properly
    const formattedResponse = response
      .replace(/###.*?\n/g, "") // Remove markdown headings
      .replace(/\*\*/g, "") // Remove bold markdown
      .replace(/\*/g, "") // Remove bullet points
      .replace(/\n\s*\n/g, " ") // Replace multiple newlines with space
      .replace(/\n/g, " ") // Replace newlines with space
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/Career Objective.*?\n/g, "") // Remove any Career Objective heading
      .replace(/###.*?\n/g, "") // Remove any other markdown headings
      .trim();

    res.json({
      success: true,
      objective: formattedResponse,
    });
  } catch (error) {
    console.error("Career objective generation error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi tạo career objective",
    });
  }
};

// Generate Work Experience
const generateWorkExperience = async (req, res) => {
  try {
    const { title, organization, description, type } = req.body;
    const cacheKey = `workExperience_${title}_${organization}_${description}_${type}`;
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const prompt = `
      You are a professional CV writer. Based on the following input, generate a concise and compelling experience paragraph in Vietnamese that summarizes the candidate's role and achievements.
      
      Job Title: ${title}
      Company: ${organization}
      Job Type: ${type}
      Description: ${description}
      
      The paragraph should:
      1. Start by briefly describing the role and scope
      2. Highlight key responsibilities using action verbs
      3. Emphasize accomplishments and quantify results where possible
      4. Be 4-5 sentences long
      
      Return ONLY the Vietnamese paragraph text, no explanations or additional text.
      `;

    const response = await generateContent(prompt);

    // Clean up the response to ensure we only get the content
    let cleanedResponse = response.trim();
    // Remove any markdown formatting or code blocks
    cleanedResponse = cleanedResponse.replace(
      /```(?:[a-z]*\n)?([\s\S]*?)\n```/g,
      "$1"
    );
    // Remove any surrounding quotes
    cleanedResponse = cleanedResponse.replace(/^["']|["']$/g, "").trim();
    // Split into bullet points if multiple lines, otherwise return as a single paragraph
    let experienceContent;
    if (cleanedResponse.includes("\n")) {
      experienceContent = cleanedResponse
        .split("\n")
        .filter((point) => point.trim());
    } else {
      experienceContent = [cleanedResponse];
    }

    apiCache.set(cacheKey, { success: true, experience: experienceContent });
    res.json({
      success: true,
      experience: experienceContent,
    });
  } catch (error) {
    console.error("Work experience generation error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi tạo work experience",
    });
  }
};

// Suggest Skills
const suggestSkills = async (req, res) => {
  try {
    const { jobTitle, industry } = req.body;
    const cacheKey = `skills_${jobTitle}_${industry}`;
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const response = await generateContent(`
      Generate a comprehensive list of skills relevant to the ${jobTitle} job title.
      Focus on technical and soft skills commonly required in this industry.
      Format: List of 3-5 key skills, including both technical and soft skills.
      Each skill is a line.
      Do not include any introductory text, bullet points, special characters, or formatting.
      Return the skills as a simple list without any markdown formatting or special characters.
      Return the result in Vietnamese
    `);
    const skills = response.split("\n").filter((skill) => skill.trim());
    apiCache.set(cacheKey, { success: true, skills });
    res.json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Skills suggestion error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi gợi ý skills",
    });
  }
};

module.exports = {
  generateCV,
  suggestCareerObjective,
  generateWorkExperience,
  suggestSkills,
  generatePDF,
  apiLimiter,
};
