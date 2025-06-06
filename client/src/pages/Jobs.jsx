import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { FiSearch } from "react-icons/fi";
import { Loader } from "../components/Loader";
import { JobCard } from "../components/JobCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllJobs,
  getSingleJob,
  suggestJobsByAI,
  searchJobs, // <-- Import the new searchJobs action
} from "../actions/JobActions";
import { Slider } from "@mantine/core";
import { RxCross2 } from "react-icons/rx";
import useIsMobile from "../hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiChevronDown,
  BiChevronUp,
  BiSearch,
  BiSolidChevronDown,
  BiSolidChevronUp,
} from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import MatchScore from "../components/MatchScore/MatchScore";
import CompetitionLevel from "../components/CompetitionLevel/CompetitionLevel";
import MatchAndCompetition from "../components/MatchAndCompetition/MatchAndCompetition";
import JobAISection from "../components/JobAISection/JobAISection";

export const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, loading } = useSelector((state) => state.job);

  // const [baseJobs, setBaseJobs] = useState([]); // REMOVED: Base jobs no longer needed for client-side filtering
  const [jobs, setJobs] = useState([]);
  // Add this state at the top of your component
  const [isSkillsSectionVisible, setIsSkillsSectionVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [company, setCompany] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useIsMobile();

  const data = ["Technology", "Marketing", "Finance", "Sales", "Legal"];

  const companyData = [
    "Vingroup",
    "FPT Corporation",
    "Viettel Group",
    "VNPT",
    "Vinamilk",
    "Techcombank",
    "BIDV",
  ];

  // Salary Range Options and Handler
  const salaryRangeOptions = [
    "Trợ cấp 2 triệu",
    "8 - 12 triệu",
    "12 - 15 triệu",
    "20 - 25 triệu",
    "25 - 35 triệu",
    "Trên 50 triệu",
  ];

  const handleSalaryRangeChange = (rangeValue) => {
    setSelectedSalaryRanges((prev) =>
      prev.includes(rangeValue)
        ? prev.filter((r) => r !== rangeValue)
        : [...prev, rangeValue]
    );
    // searchHandler will be called by useEffect due to state change
  };

  useEffect(() => {
    dispatch(getAllJobs()); // Fetches all jobs on initial load
  }, [dispatch]);

  useEffect(() => {
    setJobs(allJobs || []); // Update local jobs state when allJobs from Redux store changes
  }, [allJobs]);

  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle skills suggestion
  const handleSkillsSuggestion = async () => {
    try {
      if (!skills) {
        toast.error("Vui lòng nhập kỹ năng!");
        return;
      }
      setIsGenerating(true);
      const jobs = await dispatch(suggestJobsByAI(skills));
      setAiSuggestions(jobs);
      toast.success("Các công việc được đề xuất thành công!");
    } catch (error) {
      toast.error("Thất bại khi đề xuất công việc");
    } finally {
      setIsGenerating(false);
    }
  };

  // useEffect to trigger search when filter states change
  useEffect(() => {
    // Optional: Add a condition to prevent search on initial mount if all filters are empty
    // For example, if (!search && !location && selectedTypes.length === 0 && ... etc. ) return;
    searchHandler();
  }, [
    search,
    location,
    selectedTypes,
    selectedExperience,
    category,
    company,
    selectedSalaryRanges,
    dispatch,
  ]); // dispatch is included if searchHandler dispatches

  const searchHandler = () => {
    const params = {
      keyword: search.trim() || undefined,
      location: location.trim() || undefined,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      experienceLevels:
        selectedExperience.length > 0 ? selectedExperience : undefined,
      category: category || undefined,
      company: company || undefined,
      salaryRanges:
        selectedSalaryRanges.length > 0 ? selectedSalaryRanges : undefined,
    };
    // Remove undefined keys to keep query params clean
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    dispatch(searchJobs(params));
    setCurrentPage(1); // Reset to first page after search
  };

  // REMOVED: leftFilter, removeLeftFilter, rightFilter, removeRightFilter
  // This logic is now handled by searchHandler and clearAllFilters

  const clearAllFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedTypes([]);
    setSelectedExperience([]);
    setCategory("");
    setCompany("");
    setSelectedSalaryRanges([]);

    // Dispatch searchJobs with empty parameters to fetch all or default jobs
    // Or dispatch(getAllJobs()) if that's preferred for fetching all jobs
    dispatch(searchJobs({}));
    setCurrentPage(1);
  };

  const handleJobTypeChange = (type) => {
    setSelectedTypes((prevSelectedTypes) => {
      return prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type];
    });
    // searchHandler will be called by useEffect
  };

  const handleExperienceChange = (level) => {
    setSelectedExperience((prevSelectedLevels) => {
      return prevSelectedLevels.includes(level)
        ? prevSelectedLevels.filter((l) => l !== level)
        : [...prevSelectedLevels, level];
    });
    // searchHandler will be called by useEffect
  };

  // Pagination

  const itemsPerPage = 5;

  const totalPageCount = Math.ceil(jobs.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPageCount));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = jobs.slice(startIndex, endIndex);

  const pageButtons = [];
  const maxButtonsToShow = 3; // Maximum number of page buttons to show

  let startButton = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endButton = Math.min(totalPageCount, startButton + maxButtonsToShow - 1);

  for (let i = startButton; i <= endButton; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`mx-1 px-3 py-1 border border-gray-700 rounded ${
          currentPage === i
            ? "bg-gray-800  text-white"
            : "bg-gray-900  text-white hover:bg-gray-800 hover:text-white"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <>
      <MetaData title="JobFinder - Tìm Việc Làm" />
      <div className="min-h-screen bg-slate-50">
        {loading ? (
          <Loader />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="mb-12 mt-8">
              <div className="text-center mb-12 text-blue-600">
                <h1 className="text-5xl font-bold mb-4">
                  Tìm công việc mơ ước của bạn
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  {jobs.length}+ cơ hội đang chờ bạn
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* What Search */}
                    <div className="flex-1 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Công việc
                      </label>
                      <div className="relative">
                        <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              searchHandler();
                            }
                          }}
                          placeholder="Chức danh hoặc từ khóa"
                          className="w-full pl-12 pr-4 py-3.5 text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {search && (
                          <button
                            onClick={() => {
                              setSearch("");
                              searchHandler();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <IoClose className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Where Search */}
                    <div className="flex-1 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa điểm
                      </label>
                      <div className="relative">
                        <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              searchHandler();
                            }
                          }}
                          placeholder="Thành phố hoặc làm từ xa"
                          className="w-full pl-12 pr-4 py-3.5 text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {location && (
                          <button
                            onClick={() => {
                              setLocation("");
                              searchHandler();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <IoClose className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => searchHandler()} // Keep this if you want the button to explicitly trigger a search too, or remove if useEffect is sufficient.
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap font-medium"
                      >
                        <BiSearch className="w-5 h-5" />
                        Tìm việc
                      </button>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() =>
                          setIsSkillsSectionVisible(!isSkillsSectionVisible)
                        }
                        className="bg-blue-50 text-white px-8 py-3.5 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2 whitespace-nowrap font-medium"
                      >
                        <span className="text-blue-500">
                          {isSkillsSectionVisible ? (
                            <BiSolidChevronDown className="w-5 h-5" />
                          ) : (
                            <BiSolidChevronUp className="w-5 h-5" />
                          )}
                        </span>
                        <span className="font-medium text-blue-500 ">
                          Gợi ý công việc từ AI
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Skills Input Section */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    {isSkillsSectionVisible && (
                      <div>
                        {/* Skills Label */}
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <span className="flex items-center gap-2 underline text-blue-500 text-xl font-bold">
                              <BiSearch />
                              Kỹ Năng
                            </span>
                          </label>
                          <span className="text-xs text-gray-500">
                            Nhập mỗi kỹ năng trên một dòng
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none
        bg-gray-50 placeholder-gray-400 text-gray-800 transition-all duration-200
        hover:border-blue-100 hover:bg-white"
                            placeholder="Ví dụ: Java, Python, React, SQL, AWS..."
                          />
                          {skills && skills.length > 0 && (
                            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                              {skills.split("\n").filter(Boolean).length} kỹ
                              năng
                            </div>
                          )}
                        </div>
                        {/* Generate Button */}
                        <button
                          onClick={handleSkillsSuggestion}
                          className="mt-4 w-full flex items-center justify-center gap-2
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
                            <span className="text-medium font-semibold">
                              Lấy gợi ý từ AI
                            </span>
                          )}
                        </button>
                        {aiSuggestions.length > 0 && (
                          <JobAISection aiSuggestions={aiSuggestions} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <span className="text-sm font-medium text-gray-700">
                      Phổ biến:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Remote",
                        "Full-time",
                        "Part-time",
                        "Hợp đồng",
                        "Fresher",
                        "Senior",
                      ].map((filter) => (
                        <button
                          key={filter}
                          className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium"
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
              {/* Enhanced Filters Sidebar */}
              {!isMobile && (
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Bộ lọc
                      </h2>
                      <button
                        onClick={clearAllFilters} // Use the new clearAllFilters function
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Xóa tất cả
                      </button>
                    </div>

                    {/* Experience Level */}
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Trình độ kinh nghiệm
                      </h3>
                      <div className="space-y-3">
                        {[
                          "6 tháng",
                          "Tối thiểu 1 năm",
                          "2 - 3 năm",
                          "3 - 5 năm",
                          "Trên 5 năm",
                        ].map((displayLevel) => {
                          const queryValue = displayLevel.toLowerCase();
                          return (
                            <label
                              key={displayLevel} // Key uses original displayLevel for UI uniqueness
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedExperience.includes(
                                  queryValue
                                )}
                                onChange={() =>
                                  handleExperienceChange(queryValue)
                                }
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                {displayLevel}{" "}
                                {/* Show mixed-case displayLevel to user */}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Job Type */}
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Loại công việc
                      </h3>
                      <div className="space-y-3">
                        {[
                          "Full-time",
                          "Part-time",
                          "Hợp đồng",
                          "Tạm thời",
                          "Internship",
                        ].map((type) => (
                          <label
                            key={type.toLowerCase()}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(
                                type.toLowerCase()
                              )}
                              onChange={() => {
                                handleJobTypeChange(type.toLowerCase()); // This function internally calls searchHandler via setTimeout
                              }}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Ngành nghề
                      </h3>
                      <div className="space-y-3">
                        {data.map(
                          (
                            categoryOption // Renamed map variable to avoid conflict with state variable
                          ) => (
                            <label
                              key={categoryOption}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="radio"
                                name="category"
                                value={categoryOption}
                                checked={category === categoryOption} // Corrected: state `category` vs map item `categoryOption`
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                {categoryOption}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Công ty
                      </h3>
                      <div className="space-y-3">
                        {companyData.map((comp) => (
                          <label
                            key={comp}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="company"
                              value={comp}
                              checked={company === comp}
                              onChange={(e) => setCompany(e.target.value)}
                              className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                              {comp}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range Checkboxes */}
                    {/* Salary Range */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Mức lương
                      </h3>
                      <div className="space-y-3">
                        {salaryRangeOptions.map((range) => (
                          <label
                            key={range}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSalaryRanges.includes(range)}
                              onChange={() => handleSalaryRangeChange(range)}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                              {range}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Listings */}
              <div className="lg:col-span-9">
                <div className="space-y-6">
                  {displayedData.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-2xl font-semibold text-gray-600 mb-4">
                        Không tìm thấy công việc
                      </div>
                      <p className="text-gray-500">
                        Không có công việc nào phù hợp với tiêu chí tìm kiếm của
                        bạn.
                      </p>
                    </div>
                  ) : (
                    displayedData.map((job, index) => (
                      <div key={index}>
                        <JobCard job={job} />
                      </div>
                    ))
                  )}
                </div>

                {/* Enhanced Pagination */}
                {jobs.length > itemsPerPage && (
                  <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {pageButtons}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPageCount}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tiếp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
