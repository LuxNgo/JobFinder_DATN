const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const LRU = require('lru-cache');
const rateLimit = require('express-rate-limit');

// Initialize Gemini API with proper API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta'
});
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Create a cache for API responses
const apiCache = new LRU({
  max: 500, // Maximum number of items to cache
  maxAge: 1000 * 60 * 5 // Cache items expire after 5 minutes
});

// Rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.'
  }
});

// CV Templates
const CV_TEMPLATES = {
  modern: 'modern-template.html',
  traditional: 'traditional-template.html',
  creative: 'creative-template.html',
  minimal: 'minimal-template.html'
};

// CV Sections
const CV_SECTIONS = [
  'personal_info',
  'career_objective',
  'work_experience',
  'education',
  'skills',
  'certifications',
  'languages',
  'projects_achievements'
];

const generatePDF = async (req, res) => {
  try {
    const { cvData, selectedTemplate } = req.body;
    
    // Validate request
    if (!cvData || !selectedTemplate) {
      return res.status(400).json({ message: 'CV data and template are required' });
    }

    // Get template file path
    const templatePath = path.join(__dirname, '..', 'templates', CV_TEMPLATES[selectedTemplate]);
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Read template file
    const template = await fs.readFile(templatePath, 'utf8');

    // Replace template variables with CV data
    let renderedHTML = template;
    CV_SECTIONS.forEach(section => {
      const sectionData = cvData[section] || '';
      renderedHTML = renderedHTML.replace(`{{${section}}}`, sectionData);
    });

    // Generate PDF using puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(renderedHTML);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    await browser.close();

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV.pdf"');
    res.send(pdf);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
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
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${prompt}`
          }]
        }]
      },
      {
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024
        }
      }
    );

    // Get the response text
    const response = await result.response;
    const text = response.candidates[0]?.content?.parts[0]?.text || '';
    
    // Clean the text by removing markdown formatting
    const cleanedText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')     // Remove **bold** formatting
      .replace(/\*([^*]+)\*/g, '$1')          // Remove *italic* formatting
      .replace(/`([^`]+)`/g, '$1')             // Remove `code` formatting
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove [link](url) formatting
      .replace(/#+\s+/g, '')                  // Remove # headings
      .replace(/-{3,}/g, '')                   // Remove --- horizontal rules
      .trim();
    
    return cleanedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content. Please try again.');
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
      template = 'modern'
    } = req.body;

    // Validate required fields
    if (!jobTitle || !industry) {
      return res.status(400).json({
        success: false,
        error: 'jobTitle and industry are required fields'
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
    const workExperienceBullets = workExperience.length > 0 
      ? await Promise.all(workExperience.map(exp => generateContent(`
        Generate impactful bullet points for the role of ${exp.title} at ${exp.company}.
      Return the result in Vietnamese
        Focus on achievements and quantifiable results.
        Format: List of 3-5 bullet points highlighting key responsibilities and accomplishments.
      `)))
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
    const templatePath = path.join(__dirname, '..', 'templates', selectedTemplate);

    // Read template
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Generate final CV content in the expected format
    const cvContent = {
      personalInfo: {
        fullName: personalInfo?.fullName || '',
        email: personalInfo?.email || '',
        phone: personalInfo?.phone || '',
        location: personalInfo?.location || '',
        summary: careerObjective || 'Career objective will appear here'
      },
      experience: workExperienceBullets.map((bullet, index) => ({
        jobTitle: workExperience[index]?.title || '',
        company: workExperience[index]?.company || '',
        location: workExperience[index]?.location || '',
        startDate: workExperience[index]?.startDate || '',
        endDate: workExperience[index]?.endDate || '',
        description: bullet
      })),
      education: education.map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || ''
      })),
      skills: skillsSection ? skillsSection.split(',').map(skill => skill.trim()) : [],
      certifications: certifications.map(cert => ({
        name: cert.name || '',
        organization: cert.organization || '',
        date: cert.date || ''
      })),
      languages: languages.map(lang => ({
        language: lang.language || '',
        level: lang.level || ''
      })),
      projects: projectsSection ? projectsSection.split('\n').filter(Boolean).map(project => ({
        title: project,
        description: ''
      })) : [],
      template
    };

    // Format for download
    const cvHtml = templateContent.replace(/{{(.*?)}}/g, (match, p1) => {
      return cvContent[p1.trim()];
    });

    res.json({
      success: true,
      cvContent,
      message: 'CV generated successfully'
    });
  } catch (error) {
    console.error('CV generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CV. Please try again later.'
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
      .replace(/###.*?\n/g, '') // Remove markdown headings
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove bullet points
      .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
      .replace(/\n/g, ' ') // Replace newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/Career Objective.*?\n/g, '') // Remove any Career Objective heading
      .replace(/###.*?\n/g, '') // Remove any other markdown headings
      .trim();
    
    res.json({
      success: true,
      objective: formattedResponse
    });
  } catch (error) {
    console.error('Career objective generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate career objective'
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

    const response = await generateContent(`
      You are a professional CV writer. Based on the following input, generate a concise and compelling experience paragraph that summarizes the candidate's role and achievements as a ${title} focused on ${description} with ${type} at ${organization}.
      
      Important: Return only the paragraph text. The tone should be professional, achievement-oriented, and easy to paste directly into a CV or resume.
      
      The paragraph should:
      Start by briefly describing the role and scope
      Highlight key responsibilities using action verbs
      Emphasize accomplishments and quantify results where possible
      Be no more than 4–5 sentences
      
      Return the result in Vietnamese
      Note: Return only the final paragraph
          `);
    const bulletPoints = response.split('\n').filter(point => point.trim());
    apiCache.set(cacheKey, { success: true, experience: bulletPoints });
    res.json({
      success: true,
      experience: bulletPoints
    });
  } catch (error) {
    console.error('Work experience generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate work experience'
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
      Return the skills as a simple list without any markdown formatting or special characters.
      Return the result in Vietnamese
    `);
    const skills = response.split('\n').filter(skill => skill.trim());
    apiCache.set(cacheKey, { success: true, skills });
    res.json({
      success: true,
      skills
    });
  } catch (error) {
    console.error('Skills suggestion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to suggest skills'
    });
  }
};

module.exports = {
  generateCV,
  suggestCareerObjective,
  generateWorkExperience,
  suggestSkills,
  generatePDF,
  apiLimiter
};
