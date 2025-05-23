import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  generateCV as generateCVAction,
  suggestCareerObjective,
  generateWorkExperience,
  suggestSkills,
  generatePDF,
} from "../actions/CVActions";

import TemplateSelector from "../components/cv-builder/TemplateSelector";
import PersonalInfoForm from "../components/cv-builder/PersonalInfoForm";
import CareerObjective from "../components/cv-builder/CareerObjective";
import DownloadButton from "../components/cv-builder/DownloadButton";
import { HiOutlineSparkles } from "react-icons/hi";

const CVBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me } = useSelector((state) => state.user);
  // Add state for avatar image
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      setAvatar(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Ảnh phải nhỏ hơn 5MB");
    }
  };

  // CV Data State
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: me?.name || "",
      email: me?.email || "",
      phone: "",
      location: "",
      summary: "",
    },
    jobTitle: "",
    industry: "",
    careerObjective: "",
    experiences: [
      {
        title: "",
        organization: "",
        time: "",
        description: "",
        summary: "",
      },
    ],
    education: [],
    skills: [],
  });

  // Template Selection State
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // Loading State
  const [loading, setLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);

  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState({
    careerObjective: "",
    experience: "",
    skills: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle experience field changes
  const handleExperienceChange = (index, field, value) => {
    setCvData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  };

  // Check authentication and token validity
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token || !me) {
      navigate("/login", { replace: true });
      toast.error("Vui lòng đăng nhập để truy cập CV Builder");
    }
  }, [me, navigate]);

  // Set default template
  useEffect(() => {
    if (!selectedTemplate) {
      setSelectedTemplate("professional");
    }
  }, [selectedTemplate]);

  // Add ref for preview section
  const previewRef = useRef(null);

  // Handle career objective suggestion
  const handleCareerSuggestion = async () => {
    try {
      if (!cvData.jobTitle || !cvData.industry) {
        toast.error("Vui lòng nhập chức danh và ngành nghề!");
        return;
      }
      setIsGenerating(true);
      const careerObjective = await dispatch(
        suggestCareerObjective(cvData.jobTitle, cvData.industry)
      );
      setAiSuggestions((prev) => ({
        ...prev,
        careerObjective: [...prev.careerObjective, ...careerObjective],
      }));
      toast.success("Mục tiêu nghề nghiệp được đề xuất thành công!");
    } catch (error) {
      toast.error("Thất bại khi đề xuất mục tiêu nghề nghiệp");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle skills suggestion
  const handleSkillsSuggestion = async () => {
    try {
      if (!cvData.jobTitle || !cvData.industry) {
        toast.error("Vui lòng nhập chức danh và ngành nghề!");
        return;
      }
      setIsGenerating(true);
      const skills = await dispatch(
        suggestSkills(cvData.jobTitle, cvData.industry)
      );
      setAiSuggestions((prev) => ({
        ...prev,
        skills: [...prev.skills, ...skills],
      }));
      toast.success("Kỹ năng được đề xuất thành công!");
    } catch (error) {
      toast.error("Thất bại khi đề xuất kỹ năng");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle experience suggestion
  const handleExperienceSuggestion = async (index) => {
    try {
      const currentExp = cvData.experiences[index];
      if (!currentExp) {
        toast.error("Vui lòng nhập đầy đủ thông tin kinh nghiệm!");
        return;
      }

      if (!currentExp.title || !currentExp.organization) {
        toast.error("Vui lòng nhập chức vụ và tên công ty");
        return;
      }

      setIsGenerating(true);

      // Call the API with individual experience data
      const expResponse = await dispatch(
        generateWorkExperience({
          title: currentExp.title,
          organization: currentExp.organization,
          description: currentExp.description || "",
          type: currentExp.type || "full-time",
        })
      );

      setAiSuggestions((prev) => ({
        ...prev,
        experience: expResponse,
      }));

      toast.success("Đã tạo kinh nghiệm thành công!");
    } catch (error) {
      console.error("Error generating experience:", error);
      toast.error(error.message || "Thất bại khi tạo mô tả công việc");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle CV generation
  const generateFullCV = useCallback(async () => {
    if (!me) {
      toast.error("Vui lòng đăng nhập để tạo CV");
      return;
    }
    setLoading(true);

    try {
      // Use the local form data directly
      const cvContent = {
        ...cvData,
        // Ensure all required fields are present
        personalInfo: {
          fullName: cvData.personalInfo?.fullName || "",
          email: cvData.personalInfo?.email || "",
          phone: cvData.personalInfo?.phone || "",
          location: cvData.personalInfo?.location || "",
          summary: cvData.personalInfo?.summary || "",
        },
        jobTitle: cvData.jobTitle || "",
        industry: cvData.industry || "",
        experiences: cvData.experiences || [],
        education: cvData.education || [],
        skills: cvData.skills || [],
        certifications: cvData.certifications || [],
        languages: cvData.languages || [],
        projects: cvData.projects || [],
        template: selectedTemplate,
      };
      toast.success("CV đã được tạo thành công!");
      setGeneratedCV(cvContent);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [cvData, selectedTemplate, me, dispatch]);

  // Check authentication and token validity
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token || !me) {
      navigate("/login", { replace: true });
      toast.error("Vui lòng đăng nhập để truy cập CV Builder");
    }
  }, [me, navigate]);

  // Set default template
  useEffect(() => {
    if (!selectedTemplate) {
      setSelectedTemplate("modern");
    }
  }, [selectedTemplate]);

  const templates = [
    {
      id: "professional",
      name: "Chuyên Nghiệp",
      description: "Thiết kế nghiêm túc và phù hợp cho ngành truyền thống",
      styles: {
        primaryColor: "#1a237e",
        secondaryColor: "#3949ab",
        backgroundColor: "#ffffff",
        font: "Times New Roman, serif",
        layout: "structured",
        headerColor: "#1a237e",
        sectionBorderColor: "#c5cae9",
        sectionHeaderColor: "#303f9f",
        textPrimary: "#212121",
        textSecondary: "#616161",
        textMuted: "#9e9e9e",
        sectionStyle: "boxed",
        sectionSpacing: "md",
        headerStyle: "uppercase",
        iconStyle: "outline",
        borderStyle: "solid",
      },
    },
    {
      id: "elegant",
      name: "Thanh Lịch",
      description: "Thiết kế tinh tế, nhẹ nhàng và hài hòa",
      styles: {
        primaryColor: "#6c5ce7",
        secondaryColor: "#b2bec3",
        backgroundColor: "#fdfdfd",
        font: "Garamond, serif",
        layout: "column",
        headerColor: "#6c5ce7",
        sectionBorderColor: "#dfe6e9",
        sectionHeaderColor: "#636e72",
        textPrimary: "#2d3436",
        textSecondary: "#636e72",
        textMuted: "#b2bec3",
        sectionStyle: "subtle",
        sectionSpacing: "lg",
        headerStyle: "italic",
        iconStyle: "classic",
        borderStyle: "dashed",
      },
    },
    {
      id: "techy",
      name: "Công Nghệ",
      description: "Thiết kế sắc nét, hiện đại cho dân công nghệ",
      styles: {
        primaryColor: "#00bcd4",
        secondaryColor: "#263238",
        backgroundColor: "#ffffff",
        font: "Roboto Mono, monospace",
        layout: "grid",
        headerColor: "#00bcd4",
        sectionBorderColor: "#e0f7fa",
        sectionHeaderColor: "#006064",
        textPrimary: "#263238",
        textSecondary: "#455a64",
        textMuted: "#90a4ae",
        sectionStyle: "boxed",
        sectionSpacing: "sm",
        headerStyle: "capslock",
        iconStyle: "line",
        borderStyle: "solid",
      },
    },
    {
      id: "bold",
      name: "Cá Tính",
      description: "Thiết kế đậm và khác biệt, gây ấn tượng mạnh",
      styles: {
        primaryColor: "#ff5722",
        secondaryColor: "#212121",
        backgroundColor: "#ffffff",
        font: "Impact, sans-serif",
        layout: "magazine",
        headerColor: "#ff5722",
        sectionBorderColor: "#fbe9e7",
        sectionHeaderColor: "#d84315",
        textPrimary: "#212121",
        textSecondary: "#424242",
        textMuted: "#757575",
        sectionStyle: "shadow",
        sectionSpacing: "xl",
        headerStyle: "bold-caps",
        iconStyle: "filled",
        borderStyle: "groove",
      },
    },
  ];

  return (
    <div className="min-h-screen  mx-64 px-4 py-8 pt-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">
        Tạo hồ sơ xin việc
      </h1>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <span>💼 Thông Tin Công Việc</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Chức Danh</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cvData.jobTitle}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, jobTitle: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: Kỹ Sư Phần Mềm"
                />
                {cvData.jobTitle && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.jobTitle.length} ký tự
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Ngành Nghề</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cvData.industry}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, industry: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: Công Nghệ Thông Tin"
                />
                {cvData.industry && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.industry.length} ký tự
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500">👤</span> Thông Tin Cá Nhân
            </h2>
          </div>

          {/* Avatar Upload */}
          <div className="mb-6 flex flex-col gap-4">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <span className="font-semibold">Ảnh Đại Diện</span>
              </span>
            </label>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  style={{
                    filter:
                      selectedTemplate === "professional"
                        ? "grayscale(0)"
                        : selectedTemplate === "elegant"
                        ? "grayscale(0.2)"
                        : selectedTemplate === "techy"
                        ? "grayscale(0) brightness(1.1)"
                        : selectedTemplate === "bold"
                        ? "grayscale(0) contrast(1.2)"
                        : "grayscale(0)",
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="text-gray-600 bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {avatar ? "Thay đổi" : "Chọn ảnh"}
                </span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            {avatar && (
              <div className="text-xs text-gray-500">
                Định dạng: JPG, PNG (Dưới 5MB)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Họ và Tên</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        fullName: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
                {cvData.personalInfo.fullName && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.personalInfo.fullName.length} ký tự
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Email</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: email@domain.com"
                />
                {cvData.personalInfo.email && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.personalInfo.email.length} ký tự
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Số Điện Thoại</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: 0901234567"
                />
                {cvData.personalInfo.phone && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.personalInfo.phone.length} ký tự
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Địa Chỉ</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        location: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
            hover:border-blue-100 hover:bg-white"
                  placeholder="Ví dụ: Hà Nội, Việt Nam"
                />
                {cvData.personalInfo.location && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {cvData.personalInfo.location.length} ký tự
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* career */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500">🎯</span> Mục Tiêu Nghề Nghiệp
            </h2>
            <button
              onClick={() => {
                if (cvData.jobTitle && cvData.industry) {
                  toast.success("Đã lấy gợi ý từ AI!");
                }
              }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              Gợi ý từ AI
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={cvData.careerObjective}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    careerObjective: e.target.value,
                  }))
                }
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
          hover:border-blue-100 hover:bg-white"
                placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
                rows={4}
              />
              {cvData.careerObjective && (
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {cvData.careerObjective.length} ký tự
                </div>
              )}
            </div>

            <button
              onClick={handleCareerSuggestion}
              className="w-full flex items-center justify-center gap-2
        bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
        text-white px-4 py-3 rounded-lg font-medium shadow-sm hover:shadow-md
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-sm">Đang tạo...</span>
                </>
              ) : (
                <span className="text-medium font-semibold flex items-center">
                  <HiOutlineSparkles className="text-white text-xl " />
                  Lấy Gợi Ý từ AI
                </span>
              )}
            </button>

            {aiSuggestions.careerObjective && (
              <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Gợi Ý Mục Tiêu Nghề Nghiệp
                    </h3>
                    <button
                      onClick={() =>
                        setAiSuggestions((prev) => ({
                          ...prev,
                          careerObjective: "",
                        }))
                      }
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="prose prose-blue max-w-none text-gray-700">
                    <p>{aiSuggestions.careerObjective}</p>
                  </div>

                  <button
                    onClick={() =>
                      setCvData((prev) => ({
                        ...prev,
                        careerObjective: aiSuggestions.careerObjective.trim(),
                      }))
                    }
                    className="w-full flex items-center justify-center gap-2
              bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg
              transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5 -ml-1 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Áp dụng gợi ý này
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500">🎓</span> Học Vấn
            </h2>
          </div>

          {cvData.education.map((edu, index) => (
            <div
              key={index}
              className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Trường Học</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[index] = {
                          ...newEdu[index],
                          institution: e.target.value,
                        };
                        setCvData((prev) => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
                    />
                    {edu.institution && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {edu.institution.length} ký tự
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Bằng Cấp</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[index] = {
                          ...newEdu[index],
                          degree: e.target.value,
                        };
                        setCvData((prev) => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: Kỹ Sư Công Nghệ Thông Tin"
                    />
                    {edu.degree && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {edu.degree.length} ký tự
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Ngôn Ngữ</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={edu.language}
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[index] = {
                          ...newEdu[index],
                          language: e.target.value,
                        };
                        setCvData((prev) => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: Tiếng Anh"
                    />
                    {edu.language && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {edu.language.length} ký tự
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Trình Độ</span>
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={edu.level}
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[index] = {
                          ...newEdu[index],
                          level: e.target.value,
                        };
                        setCvData((prev) => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                    >
                      <option value="beginner">Sơ Cấp</option>
                      <option value="intermediate">Trung Cấp</option>
                      <option value="advanced">Cao Cấp</option>
                      <option value="fluent">Thành Thạo</option>
                      <option value="native">Bản Địa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    const newEdu = [...cvData.education];
                    newEdu.splice(index, 1);
                    setCvData((prev) => ({ ...prev, education: newEdu }));
                  }}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa Học Vấn
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              setCvData((prev) => ({
                ...prev,
                education: [
                  ...prev.education,
                  {
                    institution: "",
                    degree: "",
                    language: "",
                    level: "beginner",
                  },
                ],
              }))
            }
            className="w-full flex items-center justify-center gap-3
      bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
      text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md
      transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm Học Vấn
          </button>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500">💼</span> Kinh Nghiệm Làm Việc
            </h2>
            <button
              onClick={() => {
                if (cvData.jobTitle && cvData.industry) {
                  toast.success("Đã lấy gợi ý từ AI!");
                }
              }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              Gợi ý từ AI
            </button>
          </div>
          {cvData.experiences.map((exp, index) => (
            <div
              key={index}
              className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Chức Vụ</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        handleExperienceChange(index, "title", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: Kỹ Sư Phần Mềm"
                    />
                    {exp.title && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {exp.title.length} ký tự
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Công Ty</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "organization",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: Công ty ABC"
                    />
                    {exp.organization && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {exp.organization.length} ký tự
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Thời gian</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={exp.time}
                      onChange={(e) =>
                        handleExperienceChange(index, "time", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                      placeholder="Ví dụ: 2022 - 2024"
                    />
                    {exp.time && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {exp.time.length} ký tự
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">Loại Công Việc</span>
                    </span>
                  </label>
                  <select
                    value={exp.type}
                    onChange={(e) =>
                      handleExperienceChange(index, "type", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                  >
                    <option value="full-time">Toàn Thời Gian</option>
                    <option value="part-time">Bán Thời Gian</option>
                    <option value="contract">Hợp Đồng</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Thực Tập</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Mô Tả</span>
                  </span>
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    handleExperienceChange(index, "description", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                />
              </div>
              <button
                onClick={() => handleExperienceSuggestion(index)}
                className="w-full flex items-center justify-center gap-2
            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
            text-white px-4 py-3 rounded-lg font-medium shadow-sm hover:shadow-md
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang Tạo...
                  </>
                ) : (
                  <span className="text-medium font-semibold flex items-center">
                    <HiOutlineSparkles className="text-white text-xl " />
                    Lấy Gợi Ý từ AI
                  </span>
                )}
              </button>
              <div className="space-y-4 mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Tóm tắt kinh nghiệm</span>
                  </span>
                </label>
                <textarea
                  value={cvData.experiences[index].summary}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      experiences: prev.experiences.map((exp, i) =>
                        i === index ? { ...exp, summary: e.target.value } : exp
                      ),
                    }))
                  }
                  className="w-full h-32 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                />
              </div>
              {aiSuggestions.experience && (
                <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-blue-800">
                        Gợi Ý Kinh Nghiệm
                      </h3>
                      <button
                        onClick={() =>
                          setAiSuggestions((prev) => ({
                            ...prev,
                            experience: "",
                          }))
                        }
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-700">
                      <p>{aiSuggestions.experience}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCvData((prev) => {
                          const updatedExperiences = [...prev.experiences];
                          updatedExperiences[index] = {
                            ...updatedExperiences[index],
                            summary: aiSuggestions.experience,
                          };
                          return {
                            ...prev,
                            experiences: updatedExperiences,
                          };
                        });
                        setAiSuggestions((prev) => ({
                          ...prev,
                          experience: "",
                        }));
                      }}
                      className="w-full flex items-center justify-center gap-2
                  bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg
                  transition-all duration-200"
                    >
                      <svg
                        className="h-5 w-5 -ml-1 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Áp dụng gợi ý này
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    const newExps = [...cvData.experiences];
                    newExps.splice(index, 1);
                    setCvData((prev) => ({ ...prev, experiences: newExps }));
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa Kinh Nghiệm
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setCvData((prev) => ({
                ...prev,
                experiences: [
                  ...prev.experiences,
                  {
                    title: "",
                    organization: "",
                    location: "",
                    type: "full-time",
                    startDate: "",
                    endDate: "",
                    description: "",
                    link: "",
                    summary: "",
                  },
                ],
              }))
            }
            className="w-full flex items-center justify-center gap-3
      bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
      text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md
      transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm Kinh Nghiệm
          </button>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-500">🎯</span> Kỹ Năng
            </h2>
            <button
              onClick={() => {
                // Add AI suggestion for job title and industry
                if (cvData.jobTitle && cvData.industry) {
                  toast.success("Đã lấy gợi ý từ AI!");
                }
              }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              Gợi ý từ AI
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ Năng Hiện Tại
              </label>
              <textarea
                value={cvData.skills.join("\n")}
                onChange={(e) =>
                  setCvData((prev) => ({
                    ...prev,
                    skills: e.target.value
                      .split("\n")
                      .filter((skill) => skill.trim()),
                  }))
                }
                className="w-full h-32 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
                hover:border-blue-100 hover:bg-white"
                placeholder="Nhập kỹ năng, mỗi kỹ năng một dòng"
              />
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <button
                onClick={handleSkillsSuggestion}
                className="text-blue-500 hover:text-blue-600 hover:font-bold underline rounded-full text-sm font-medium transition-colors"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang Tạo...
                  </>
                ) : (
                  <span className="text-medium font-semibold flex">
                    <HiOutlineSparkles className="text-blue-500 text-xl" />
                    Lấy Gợi Ý từ AI
                  </span>
                )}
              </button>
              {aiSuggestions.skills.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.skills.map((skill, i) =>
                      i > 0 ? (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-blue-800"
                        >
                          {"+" + skill}
                        </span>
                      ) : null
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCvData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, ...aiSuggestions.skills],
                      }))
                    }
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Áp dụng gợi ý này
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
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang Tạo CV...
              </>
            ) : (
              "Tạo CV Hoàn Chỉnh"
            )}
          </button>
        </div>

        {/* Preview Section */}
        {generatedCV && (
          <div className="mt-8">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
            <h2 className="text-2xl font-bold my-6 text-gray-800">
              Xem Trước CV
            </h2>
            <div ref={previewRef}>
              <div
                className={`p-6 bg-white ${
                  selectedTemplate
                    ? templates.find((t) => t.id === selectedTemplate)?.styles
                        .backgroundColor
                    : "#ffffff"
                }`}
              >
                <div className="flex ">
                  <div
                    className={`p-4 ${
                      selectedTemplate === "professional"
                        ? "bg-white/70 text-gray-800 border-r-4 border-gray-200"
                        : selectedTemplate === "elegant"
                        ? "bg-white/70 shadow-sm backdrop-blur-md text-gray-700 border-r-4 border-gray-200"
                        : selectedTemplate === "techy"
                        ? "bg-gradient-to-b from-blue-50 to-blue-200 text-blue-800 font-medium"
                        : selectedTemplate === "bold"
                        ? "bg-black text-white font-bold shadow-lg"
                        : "text-white"
                    }`}
                  >
                    {/* Header Section with Avatar */}
                    <div className="text-left mb-12">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white mb-4">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              style={{
                                filter:
                                  selectedTemplate === "professional"
                                    ? "grayscale(0)"
                                    : selectedTemplate === "elegant"
                                    ? "grayscale(0.2)"
                                    : selectedTemplate === "techy"
                                    ? "grayscale(0) brightness(1.1)"
                                    : selectedTemplate === "bold"
                                    ? "grayscale(0) contrast(1.2)"
                                    : "grayscale(0)",
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h1
                          className="text-4xl font-bold"
                          style={{
                            color: selectedTemplate
                              ? templates.find((t) => t.id === selectedTemplate)
                                  ?.styles.headerColor
                              : "#3498db",
                          }}
                        >
                          {cvData.personalInfo?.fullName}
                        </h1>
                        <h2
                          className="text-xl font-semibold"
                          style={{
                            color: selectedTemplate
                              ? templates.find((t) => t.id === selectedTemplate)
                                  ?.styles.sectionHeaderColor
                              : "#2c3e50",
                          }}
                        >
                          {cvData.jobTitle}
                        </h2>
                      </div>
                    </div>
                    {/* Contact Information */}
                    <div
                      className={`mt-4 flex flex-col flex-wrap justify-center gap-4 `}
                    >
                      {["industry", "email", "phone", "location"].map(
                        (field, index) => (
                          <div
                            key={field}
                            className={`flex items-center gap-x-3 transition-all duration-200 ease-in-out`}
                          >
                            <svg
                              className={`w-5 h-5 ${
                                (selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.iconStyle === "outline" &&
                                    "stroke-current"
                                  : "",
                                selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.iconStyle === "classic" &&
                                    "fill-current"
                                  : "",
                                selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.iconStyle === "line" &&
                                    "stroke-current"
                                  : "",
                                selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.iconStyle === "filled" &&
                                    "fill-current"
                                  : "")
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{
                                color: selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.primaryColor
                                  : "#3498db",
                              }}
                            >
                              {(() => {
                                switch (field) {
                                  case "industry":
                                    return (
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                    );
                                  case "email":
                                    return (
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    );
                                  case "phone":
                                    return (
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    );
                                  case "location":
                                    return (
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </svg>
                            <p
                              style={{
                                color: selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.textSecondary
                                  : "#666666",
                              }}
                            >
                              {field === "industry" && cvData.industry}
                              {field === "email" && cvData.personalInfo?.email}
                              {field === "phone" && cvData.personalInfo?.phone}
                              {field === "location" &&
                                cvData.personalInfo?.location}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  {/* Experience Section */}
                  <div className={`p-6 shadow-sm`}>
                    {/* Render CV preview based on selected template */}
                    <div
                      className={`mb-12 ${
                        selectedTemplate === "professional"
                          ? "mb-6"
                          : selectedTemplate === "elegant"
                          ? "mb-8"
                          : selectedTemplate === "techy"
                          ? "mb-10"
                          : selectedTemplate === "bold"
                          ? "mb-12"
                          : ""
                      }`}
                    >
                      <h3
                        className={`text-xl ${
                          selectedTemplate === "professional"
                            ? "uppercase tracking-wide"
                            : selectedTemplate === "elegant"
                            ? "italic"
                            : selectedTemplate === "techy"
                            ? "font-mono uppercase"
                            : selectedTemplate === "bold"
                            ? "font-bold text-2xl"
                            : ""
                        }`}
                        style={{
                          color: selectedTemplate
                            ? templates.find((t) => t.id === selectedTemplate)
                                ?.styles.sectionHeaderColor
                            : "#2c3e50",
                        }}
                      >
                        Mục Tiêu Nghề Nghiệp
                      </h3>
                      <div className="prose prose-gray max-w-none">
                        <p
                          style={{
                            color: selectedTemplate
                              ? templates.find((t) => t.id === selectedTemplate)
                                  ?.styles.textPrimary
                              : "#333333",
                          }}
                        >
                          {cvData.personalInfo?.summary ||
                            "Mục tiêu nghề nghiệp sẽ hiển thị ở đây"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-12">
                      <h3
                        className={`text-xl mb-4 ${
                          selectedTemplate === "professional"
                            ? "uppercase tracking-wide"
                            : selectedTemplate === "elegant"
                            ? "italic"
                            : selectedTemplate === "techy"
                            ? "font-mono uppercase"
                            : selectedTemplate === "bold"
                            ? "font-bold text-2xl"
                            : ""
                        }`}
                        style={{
                          color: selectedTemplate
                            ? templates.find((t) => t.id === selectedTemplate)
                                ?.styles.sectionHeaderColor
                            : "#2c3e50",
                        }}
                      >
                        Học Vấn
                      </h3>
                      {Array.isArray(cvData.education) &&
                      cvData.education.length > 0 ? (
                        <div className="space-y-6">
                          {cvData.education.map((edu, index) => (
                            <div
                              key={index}
                              className="border-l-4 pl-4"
                              style={{
                                borderColor: selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.primaryColor
                                  : "#3498db",
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4
                                    className="font-semibold text-lg text-gray-900"
                                    style={{
                                      color: selectedTemplate
                                        ? templates.find(
                                            (t) => t.id === selectedTemplate
                                          )?.styles.secondaryColor
                                        : "#2c3e50",
                                    }}
                                  >
                                    Chứng chỉ: {edu.degree}
                                  </h4>
                                  <p className="text-gray-600 mt-1">
                                    Đại học: {edu.institution}
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    Ngôn ngữ: {edu.language} - {edu.level}
                                  </p>
                                </div>
                                <p className="text-gray-500 text-sm">
                                  {edu.startDate} - {edu.endDate}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Chưa thêm thông tin học vấn
                        </p>
                      )}
                    </div>
                    <div className="mb-12">
                      <h3
                        className={`text-xl mb-4 ${
                          selectedTemplate === "professional"
                            ? "uppercase tracking-wide"
                            : selectedTemplate === "elegant"
                            ? "italic"
                            : selectedTemplate === "techy"
                            ? "font-mono uppercase"
                            : selectedTemplate === "bold"
                            ? "font-bold text-2xl"
                            : ""
                        }`}
                        style={{
                          color: selectedTemplate
                            ? templates.find((t) => t.id === selectedTemplate)
                                ?.styles.sectionHeaderColor
                            : "#2c3e50",
                        }}
                      >
                        Kinh Nghiệm
                      </h3>
                      {Array.isArray(cvData.experiences) &&
                      cvData.experiences.length > 0 ? (
                        <div className="space-y-6">
                          {cvData.experiences.map((exp, index) => (
                            <div
                              key={index}
                              className="border-l-4 pl-4"
                              style={{
                                borderColor: selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.primaryColor
                                  : "#3498db",
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4
                                    className="font-semibold text-lg text-gray-900"
                                    style={{
                                      color: selectedTemplate
                                        ? templates.find(
                                            (t) => t.id === selectedTemplate
                                          )?.styles.secondaryColor
                                        : "#2c3e50",
                                    }}
                                  >
                                    {exp.title}
                                  </h4>
                                  <p className="text-gray-600 mt-1">
                                    Công ty: {exp.organization}
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    Thời gian: {exp.time}
                                  </p>
                                  {exp.summary && (
                                    <div className="mt-4 space-y-2">
                                      <p className="text-gray-700">
                                        {exp.summary}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Chưa thêm thông tin kinh nghiệm
                        </p>
                      )}
                    </div>
                    <div className="mb-12">
                      <h3
                        className={`text-xl mb-4 ${
                          selectedTemplate === "professional"
                            ? "uppercase tracking-wide"
                            : selectedTemplate === "elegant"
                            ? "italic"
                            : selectedTemplate === "techy"
                            ? "font-mono uppercase"
                            : selectedTemplate === "bold"
                            ? "font-bold text-2xl"
                            : ""
                        }`}
                        style={{
                          color: selectedTemplate
                            ? templates.find((t) => t.id === selectedTemplate)
                                ?.styles.sectionHeaderColor
                            : "#2c3e50",
                        }}
                      >
                        Kỹ Năng
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.isArray(cvData.skills) &&
                        cvData.skills.length > 0 ? (
                          cvData.skills.map((skill, i) => (
                            <div
                              key={i}
                              className="relative p-3 rounded-lg"
                              style={{
                                backgroundColor: selectedTemplate
                                  ? templates.find(
                                      (t) => t.id === selectedTemplate
                                    )?.styles.primaryColor
                                  : "#3498db",
                                color: "#ffffff",
                              }}
                            >
                              <span className="absolute -top-2 -right-2 bg-white text-xs px-1.5 py-0.5 rounded-full text-gray-600">
                                {i + 1}
                              </span>
                              <p className="text-sm font-medium">{skill}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">
                            Chưa thêm kỹ năng
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DownloadButton previewRef={previewRef} />
          </div>
        )}
      </div>
    </div>
  );
};
export default CVBuilder;
