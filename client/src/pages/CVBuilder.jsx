import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  generateCV as generateCVAction,
  suggestCareerObjective,
  generateWorkExperience,
  suggestSkills
} from '../actions/CVActions';

export const CVBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me } = useSelector(state => state.user);
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: me?.name || '',
      email: me?.email || '',
      phone: '',
      location: '',
      summary: ''
    },
    jobTitle: '',
    industry: '',
    experiences: [],
    education: [],
    skills: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Function to generate PDF
  const generatePDF = useCallback(async () => {
    if (!me) {
      toast.error('Vui lòng đăng nhập để tạo CV');
      return;
    }

    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      const result = await dispatch(generatePDF(cvData, selectedTemplate));
      
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.personalInfo.fullName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('CV đã được tải xuống thành công!');
    } catch (error) {
      setPdfError(error.message);
      toast.error(error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [cvData, selectedTemplate, me, dispatch]);

  // Check authentication and token validity
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !me) {
      navigate('/login', { replace: true });
      toast.error('Please log in to access CV Builder');
    }
  }, [me, navigate]);

  // Set default template
  useEffect(() => {
    if (!selectedTemplate) {
      setSelectedTemplate('modern');
    }
  }, [selectedTemplate]);

  // Check authentication and token validity
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !me) {
      navigate('/login', { replace: true });
      toast.error('Please log in to access CV Builder');
    }
  }, [me, navigate]);

  const [loading, setLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState({
    careerObjective: '',
    experiences: [],
    skills: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { 
      id: 'professional',
      name: 'Chuyên Nghiệp',
      description: 'Thiết kế nghiêm túc và phù hợp cho ngành truyền thống',
      styles: {
        primaryColor: '#1a237e',
        secondaryColor: '#3949ab',
        backgroundColor: '#ffffff',
        font: 'Times New Roman, serif',
        layout: 'structured',
        headerColor: '#1a237e',
        sectionBorderColor: '#c5cae9',
        sectionHeaderColor: '#303f9f',
        textPrimary: '#212121',
        textSecondary: '#616161',
        textMuted: '#9e9e9e',
        sectionStyle: 'boxed',
        sectionSpacing: 'md',
        headerStyle: 'uppercase',
        iconStyle: 'outline',
        borderStyle: 'solid'
      }
    },
    { 
      id: 'elegant',
      name: 'Thanh Lịch',
      description: 'Thiết kế tinh tế, nhẹ nhàng và hài hòa',
      styles: {
        primaryColor: '#6c5ce7',
        secondaryColor: '#b2bec3',
        backgroundColor: '#fdfdfd',
        font: 'Garamond, serif',
        layout: 'column',
        headerColor: '#6c5ce7',
        sectionBorderColor: '#dfe6e9',
        sectionHeaderColor: '#636e72',
        textPrimary: '#2d3436',
        textSecondary: '#636e72',
        textMuted: '#b2bec3',
        sectionStyle: 'subtle',
        sectionSpacing: 'lg',
        headerStyle: 'italic',
        iconStyle: 'classic',
        borderStyle: 'dashed'
      }
    },
    { 
      id: 'techy',
      name: 'Công Nghệ',
      description: 'Thiết kế sắc nét, hiện đại cho dân công nghệ',
      styles: {
        primaryColor: '#00bcd4',
        secondaryColor: '#263238',
        backgroundColor: '#ffffff',
        font: 'Roboto Mono, monospace',
        layout: 'grid',
        headerColor: '#00bcd4',
        sectionBorderColor: '#e0f7fa',
        sectionHeaderColor: '#006064',
        textPrimary: '#263238',
        textSecondary: '#455a64',
        textMuted: '#90a4ae',
        sectionStyle: 'boxed',
        sectionSpacing: 'sm',
        headerStyle: 'capslock',
        iconStyle: 'line',
        borderStyle: 'solid'
      }
    },
    { 
      id: 'bold',
      name: 'Cá Tính',
      description: 'Thiết kế đậm và khác biệt, gây ấn tượng mạnh',
      styles: {
        primaryColor: '#ff5722',
        secondaryColor: '#212121',
        backgroundColor: '#ffffff',
        font: 'Impact, sans-serif',
        layout: 'magazine',
        headerColor: '#ff5722',
        sectionBorderColor: '#fbe9e7',
        sectionHeaderColor: '#d84315',
        textPrimary: '#212121',
        textSecondary: '#424242',
        textMuted: '#757575',
        sectionStyle: 'shadow',
        sectionSpacing: 'xl',
        headerStyle: 'bold-caps',
        iconStyle: 'filled',
        borderStyle: 'groove'
      }
    }
  ];
    
  // Get AI suggestions for career objective
  const suggestObjective = async () => {
    try {
      setIsGenerating(true);
      const objective = await dispatch(suggestCareerObjective(cvData.jobTitle, cvData.industry));
      setAiSuggestions(prev => ({ ...prev, careerObjective: objective }));
      toast.success('Career objective generated successfully!');
    } catch (error) {
      toast.error('Failed to generate career objective');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate experience bullet points
  const generateExperience = async (exp) => {
    try {
      setIsGenerating(true);
      const points = await dispatch(generateWorkExperience({
        organization: exp.organization,
        description: exp.description
      }));
      setAiSuggestions(prev => ({
        ...prev,
        experiences: [...prev.experiences.slice(0, exp.index), points, ...prev.experiences.slice(exp.index + 1)]
      }));
      toast.success('Experience points generated successfully!');
    } catch (error) {
      toast.error('Failed to generate experience points');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle skills suggestion
  const handleSkillsSuggestion = async () => {
    try {
      setIsGenerating(true);
      const skills = await dispatch(suggestSkills(cvData.jobTitle, cvData.industry));
      setAiSuggestions(prev => ({
        ...prev,
        skills: [...prev.skills, ...skills]
      }));
      toast.success('Skills suggested successfully!');
    } catch (error) {
      toast.error('Failed to suggest skills');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle experience change
  const handleExperienceChange = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const generateFullCV = async () => {
    try {
      setLoading(true);
      const data = {
        jobTitle: cvData.jobTitle,
        industry: cvData.industry,
        personalInfo: {
          fullName: cvData.personalInfo.fullName,
          email: cvData.personalInfo.email,
          phone: cvData.personalInfo.phone,
          location: cvData.personalInfo.location,
          summary: cvData.personalInfo.summary
        },
        experiences: cvData.experiences.map((exp, index) => ({
          title: exp.title,
          organization: exp.organization,
          location: exp.location,
          type: exp.type,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          link: exp.link,
          summary: exp.summary
        })),
        education: cvData.education,
        skills: cvData.skills
      };
      
      const response = await dispatch(generateCVAction(data, selectedTemplate));
      
      if (response) {
        console.log('Raw response:', JSON.stringify(response, null, 2)); // Debug log
        
        // Extract cvContent safely
        const cvContent = response?.cvContent || response;
        
        console.log('Extracted cvContent:', JSON.stringify(cvContent, null, 2)); // Debug log
        
        // Set default empty arrays if data is missing
        const safeContent = {
          personalInfo: {
            name: cvContent?.personalInfo?.name || '',
            email: cvContent?.personalInfo?.email || '',
            phone: cvContent?.personalInfo?.phone || '',
            location: cvContent?.personalInfo?.location || '',
            summary: cvContent?.personalInfo?.summary || ''
          },
          experience: Array.isArray(cvContent?.experience) ? cvContent.experience.map(exp => ({
            ...exp,
            achievements: Array.isArray(exp.achievements) ? exp.achievements : []
          })) : [],
          skills: Array.isArray(cvContent?.skills) ? cvContent.skills : [],
          projects: Array.isArray(cvContent?.projects) ? cvContent.projects : [],
          template: cvContent?.template || ''
        };
        
        console.log('Final safe content:', JSON.stringify(safeContent, null, 2)); // Debug log
        
        setGeneratedCV(data);
        toast.success('CV generated successfully!');
      } else {
        throw new Error('No CV content received from server');
      }
    } catch (error) {
      console.error('CV generation error:', error);
      toast.error(error.message || 'Failed to generate CV');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white container mx-auto px-4 py-8 pt-24">
      {/* Template Selection */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Chọn Mẫu CV</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedTemplate === template.id ? 'shadow-lg border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
              style={{
                backgroundColor: selectedTemplate === template.id 
                  ? templates.find(t => t.id === selectedTemplate)?.styles.backgroundColor 
                  : 'transparent'
              }}
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{
                  color: selectedTemplate === template.id 
                    ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor 
                    : '#333333'
                }}>{template.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{
                  color: selectedTemplate === template.id 
                    ? templates.find(t => t.id === selectedTemplate)?.styles.textSecondary 
                    : '#666666'
                }}>{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CV Form */}
      <div className="space-y-8">
        {/* Job Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thông Tin Công Việc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chức Danh</label>
              <input
                type="text"
                value={cvData.jobTitle}
                onChange={(e) => setCvData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Kỹ Sư Phần Mềm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành Nghề</label>
              <input
                type="text"
                value={cvData.industry}
                onChange={(e) => setCvData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Công Nghệ Thông Tin"
              />
                    </div>
                    </div>
                    </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <input
                type="text"
                value={cvData.personalInfo.fullName}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    fullName: e.target.value
                  }
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
                    </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={cvData.personalInfo.email}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    email: e.target.value
                  }
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
                  </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
              <input
                type="tel"
                value={cvData.personalInfo.phone}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    phone: e.target.value
                  }
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ</label>
              <input
                type="text"
                value={cvData.personalInfo.location}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    location: e.target.value
                  }
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Career Objective */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mục Tiêu Nghề Nghiệp</h2>
          <div className="mb-4">
              <textarea
                value={cvData.personalInfo.summary}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    summary: e.target.value
                  }
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
              />
          </div>
          <button
            onClick={suggestObjective}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang Tạo...
              </>
            ) : (
              'Lấy Gợi Ý từ AI'
            )}
          </button>
          {aiSuggestions.careerObjective && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <p className="text-blue-800 font-medium">Gợi Ý Mục Tiêu Nghề Nghiệp:</p>
                <div className="prose prose-blue max-w-none">
                  <p>{aiSuggestions.careerObjective}</p>
                </div>
                <button
                  onClick={() => setCvData(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      summary: aiSuggestions.careerObjective
                    }
                  }))}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Sử dụng gợi ý này
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Học Vấn</h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bằng Cấp</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...newEdu[index], degree: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trường Học</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...newEdu[index], institution: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn Ngữ</label>
                  <input
                    type="text"
                    value={edu.language}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...newEdu[index], language: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trình Độ</label>
                  <select
                    value={edu.level}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...newEdu[index], level: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Sơ Cấp</option>
                    <option value="intermediate">Trung Cấp</option>
                    <option value="advanced">Cao Cấp</option>
                    <option value="fluent">Thành Thạo</option>
                    <option value="native">Bản Địa</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  const newEdu = [...cvData.education];
                  newEdu.splice(index, 1);
                  setCvData(prev => ({ ...prev, education: newEdu }));
                }}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Xóa Học Vấn
              </button>
            </div>
          ))}
          <button
            onClick={() => setCvData(prev => ({
              ...prev,
              education: [...prev.education, {
                institution: '',
                degree: '',
                language: '',
                level: 'beginner'
              }]
            }))}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Thêm Học Vấn
          </button>
        </div>

        {/* Experiences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Kinh Nghiệm</h2>
          {cvData.experiences.map((exp, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị Trí</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tổ Chức</label>
                  <input
                    type="text"
                    value={exp.organization}
                    onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa Điểm</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                  <select
                    value={exp.type}
                    onChange={(e) => handleExperienceChange(index, 'type', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="work">Kinh Nghiệm Làm Việc</option>
                    <option value="project">Dự Án</option>
                    <option value="volunteer">Tình Nguyện Viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Bắt Đầu</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Kết Thúc</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link(Tùy Chọn)</label>
                  <input
                    type="text"
                    value={exp.link}
                    onChange={(e) => handleExperienceChange(index, 'link', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
              </div>
              <button
                onClick={() => generateExperience(exp)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang Tạo...
                  </>
                ) : (
                  'Tạo Tóm Tắt Kinh Nghiệm'
                )}
              </button>
              {aiSuggestions.experiences[index] && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Tóm Tắt</label>
                    <textarea
                      value={exp.summary}
                      onChange={(e) => handleExperienceChange(index, 'summary', e.target.value)}
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Nhập tóm tắt kinh nghiệm..."
                    />
                  </div>
                  <ul className="space-y-2">
                    {aiSuggestions.experiences[index].map((point, i) => (
                      <li key={i} className="text-blue-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <button
                  onClick={() => {
                    const newExps = [...cvData.experiences];
                    newExps[index] = { ...newExps[index], summary: aiSuggestions.experiences[index] };
                    setCvData(prev => ({ ...prev, experiences: newExps }));
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Sử dụng tóm tắt này
                </button>
                </div>
              )}
              <button
                onClick={() => {
                  const newExps = [...cvData.experience];
                  newExps.splice(index, 1);
                  setCvData(prev => ({ ...prev, experience: newExps }));
                }}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Xóa Kinh Nghiệm
              </button>
            </div>
          ))}
          <button
            onClick={() => setCvData(prev => ({
              ...prev,
              experiences: [...prev.experiences, {
                title: '',
                organization: '',
                location: '',
                type: 'work',
                startDate: '',
                endDate: '',
                description: '',
                link: ''
              }]
            }))}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Thêm Kinh Nghiệm
          </button>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Kỹ Năng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ Năng Hiện Tại</label>
              <textarea
                value={cvData.skills.join('\n')}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  skills: e.target.value.split('\n').filter(skill => skill.trim())
                }))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Nhập kỹ năng, mỗi kỹ năng một dòng"
              />
            </div>
            <div>
              <button
                onClick={handleSkillsSuggestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang Tạo...
                  </>
                ) : (
                  'Lấy Gợi Ý từ AI'
                )}
              </button>
              {aiSuggestions.skills.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-blue-700">AI gợi ý kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                  onClick={() => setCvData(prev => ({
                    ...prev,
                    skills: [...prev.skills, ...aiSuggestions.skills]
                  }))}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm kỹ năng này
                </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate CV Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={generateFullCV}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang Tạo CV...
              </>
            ) : (
              'Tạo CV Hoàn Chỉnh'
            )}
          </button>
        </div>

        {/* Preview Section */}
        {generatedCV && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Xem Trước CV</h2>
            <div className={`rounded-xl shadow-xl p-8 ${
              selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.layout === 'structured' && 'border border-gray-200' : ''
            }`} style={{
              backgroundColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.backgroundColor : '#ffffff',
              fontFamily: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.font : 'Arial, sans-serif',
              borderColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionBorderColor : '#e0e0e0',
              borderStyle: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.borderStyle : 'solid'
            }}>
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex flex-col items-center space-y-2">
                  <h1 className="text-4xl font-bold" style={{
                    color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerColor : '#3498db'
                  }}>
                    {generatedCV.personalInfo?.fullName}
                  </h1>
                  <h2 className="text-xl font-semibold" style={{
                    color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor : '#2c3e50'
                  }}>
                    {generatedCV.jobTitle}
                  </h2>
                </div>
                <div className="mt-4 flex flex-col flex-wrap justify-center gap-4">
                  {['industry', 'email', 'phone', 'location'].map((field, index) => (
                    <div key={field} className={`flex items-center space-x-2 ${
                      selectedTemplate === 'professional' && 'border-b border-gray-200 pb-2',
                      selectedTemplate === 'elegant' && 'opacity-90',
                      selectedTemplate === 'techy' && 'bg-blue-50 rounded-lg p-2',
                      selectedTemplate === 'bold' && 'shadow-md'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.iconStyle === 'outline' && 'stroke-current' : '',
                        selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.iconStyle === 'classic' && 'fill-current' : '',
                        selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.iconStyle === 'line' && 'stroke-current' : '',
                        selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.iconStyle === 'filled' && 'fill-current' : ''
                      }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{
                          color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.primaryColor : '#3498db'
                        }}
                      >
                        {(() => {
                          switch (field) {
                            case 'industry':
                              return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
                            case 'email':
                              return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
                            case 'phone':
                              return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
                            case 'location':
                              return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
                            default:
                              return null;
                          }
                        })()}
                      </svg>
                      <p style={{
                        color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.textSecondary : '#666666'
                      }}>
                        {field === 'industry' && `Ngành nghề: ${generatedCV.industry || 'Ngành nghề'}`}
                        {field === 'email' && `Email: ${generatedCV.personalInfo?.email || 'Email'}`}
                        {field === 'phone' && `Số điện thoại: ${generatedCV.personalInfo?.phone || 'Số điện thoại'}`}
                        {field === 'location' && `Địa chỉ: ${generatedCV.personalInfo?.location || 'Địa chỉ'}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            <div className={`p-6 rounded-lg shadow-md`} style={{
              backgroundColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.backgroundColor : '#ffffff',
              fontFamily: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.font : 'Arial, sans-serif'
            }}>
              {/* Render CV preview based on selected template */}
              <div className={`mb-12 ${
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionSpacing === 'sm' && 'mb-6' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionSpacing === 'md' && 'mb-8' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionSpacing === 'lg' && 'mb-10' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionSpacing === 'xl' && 'mb-12' : ''
              }`}>
                <h3 className={`text-xl ${
                  selectedTemplate === 'professional' && 'uppercase tracking-wide',
                  selectedTemplate === 'elegant' && 'italic',
                  selectedTemplate === 'techy' && 'font-mono uppercase',
                  selectedTemplate === 'bold' && 'font-bold text-2xl'
                }`} style={{
                  color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor : '#2c3e50'
                }}>
                  Mục Tiêu Nghề Nghiệp
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p style={{
                    color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.textPrimary : '#333333'
                  }}>{generatedCV.personalInfo?.summary || 'Mục tiêu nghề nghiệp sẽ hiển thị ở đây'}</p>
                </div>
              </div>
                <div className='mb-12'>
                  <h3 className={`text-xl mb-4 ${
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'uppercase' && 'uppercase tracking-wide' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'italic' && 'italic' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'capslock' && 'font-mono uppercase' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'bold-caps' && 'font-bold text-2xl' : ''
              }`} style={{
                color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor : '#2c3e50'
              }}>
                  Học Vấn
                </h3>
                  {Array.isArray(generatedCV.education) && generatedCV.education.length > 0 ? (
                    <div className="space-y-6">
                      {generatedCV.education.map((edu, index) => (
                        <div key={index} className="border-l-4 pl-4" style={{
                          borderColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.primaryColor : '#3498db'
                        }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900" style={{
                                color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.secondaryColor : '#2c3e50'
                              }}>
                                Chứng chỉ: {edu.degree}
                              </h4>
                              <p className="text-gray-600 mt-1">Đại học: {edu.institution}</p>
                              <p className="text-gray-600 mt-1">Ngôn ngữ: {edu.language} - {edu.level}</p>
                            </div>
                            <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa thêm thông tin học vấn</p>
                  )}
                </div>
                <div className='mb-12'>
                  <h3 className={`text-xl mb-4 ${
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'uppercase' && 'uppercase tracking-wide' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'italic' && 'italic' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'capslock' && 'font-mono uppercase' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'bold-caps' && 'font-bold text-2xl' : ''
              }`} style={{
                color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor : '#2c3e50'
              }}>
                  Kinh Nghiệm
                </h3>
                  {Array.isArray(generatedCV.experiences) && generatedCV.experiences.length > 0 ? (
                    <div className="space-y-6">
                      {generatedCV.experiences.map((exp, index) => (
                        <div key={index} className="border-l-4 pl-4" style={{
                          borderColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.primaryColor : '#3498db'
                        }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900" style={{
                                color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.secondaryColor : '#2c3e50'
                              }}>
                                {exp.title}
                              </h4>
                              <p className="text-gray-600 mt-1">Công ty: {exp.organization}</p>
                              <p className="text-gray-600 mt-1">Thời gian: {exp.startDate} - {exp.endDate}</p>
                              <p className="text-gray-600 mt-1">Nơi làm việc: {exp.location}</p>
                              {exp.summary && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-gray-700">{exp.summary}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa thêm thông tin kinh nghiệm</p>
                  )}
                </div>
                <div className='mb-12'>
                  <h3 className={`text-xl mb-4 ${
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'uppercase' && 'uppercase tracking-wide' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'italic' && 'italic' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'capslock' && 'font-mono uppercase' : '',
                selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.headerStyle === 'bold-caps' && 'font-bold text-2xl' : ''
              }`} style={{
                color: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.sectionHeaderColor : '#2c3e50'
              }}>
                  Kỹ Năng
                </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.isArray(generatedCV.skills) && generatedCV.skills.length > 0 ? (
                      generatedCV.skills.map((skill, i) => (
                        <div key={i} className="relative p-3 rounded-lg" style={{
                          backgroundColor: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.styles.primaryColor : '#3498db',
                          color: '#ffffff'
                        }}>
                          <span className="absolute -top-2 -right-2 bg-white text-xs px-1.5 py-0.5 rounded-full text-gray-600">
                            {i + 1}
                          </span>
                          <p className="text-sm font-medium">{skill}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Chưa thêm kỹ năng</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className={`inline-flex items-center px-8 py-4 ${
                  isGeneratingPDF 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                } text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                {isGeneratingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Tải XUống PDF
                  </>
                )}
              </button>
              {console.log(pdfError)}
              {pdfError && (
                <p className="mt-2 text-red-500 text-sm text-center">{pdfError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

