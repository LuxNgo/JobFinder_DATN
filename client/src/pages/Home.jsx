import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "../actions/StatsActions";
import { MetaData } from "../components/MetaData";
import { getAllJobs } from "../actions/JobActions";
import Testimonials from "../components/Testimonials/Testimonials.jsx";
import jobSearchImage from "../assets/images/image.job.search.svg";
import coporateImage from "../assets/images/image.coperate.png";

export const Home = () => {
  const dispatch = useDispatch();
  const { loading, allJobs } = useSelector((state) => state.job);
  const { stats, loading: statsLoading } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getAllJobs());
    dispatch(getStats());
  }, [dispatch]);

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) return "Ngày không hợp lệ";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const companyLogos = Array.from({ length: 20 }, (_, i) => ({
    link: `/images/JobData/${i + 1}.jpg`,
  }));

  return (
    <>
      <MetaData title="JobLane - Tìm Việc Làm Mơ Ước Của Bạn" />
      <div className="min-h-screen flex flex-col text-black">
        {/* Hero Section */}
        <div className="relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="relative min-h-[700px] flex items-center">
            <div className="container mx-20 px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-left space-y-8 z-10">
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight space-y-4">
                  <div>Tìm Việc Làm </div>
                  <div>
                    <span className="text-blue-400">Mơ Ước </span>Của Bạn
                  </div>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
                  Kết nối với các nhà tuyển dụng hàng đầu và khám phá cơ hội phù
                  hợp với kỹ năng và ước mơ của bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/jobs"
                    className="px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-full 
                                                 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50
                                                 flex items-center gap-2 group hover:-translate-y-1"
                  >
                    Tìm Việc Làm
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                  {localStorage.getItem("role") === "recruiter" ? (
                    <Link
                      to="/recruiter/dashboard"
                      className="px-8 py-4 text-lg font-semibold text-blue-500 bg-white rounded-full 
                               hover:bg-blue-50 transition-all duration-300 shadow-lg
                               flex items-center gap-2 hover:-translate-y-1"
                    >
                      Đăng tin tuyển dụng
                    </Link>
                  ) : (
                    <Link
                      to="/upgrade-to-recruiter"
                      className="px-8 py-4 text-lg font-semibold text-blue-500 bg-white rounded-full 
                               hover:bg-blue-50 transition-all duration-300 shadow-lg
                               flex items-center gap-2 hover:-translate-y-1"
                    >
                      Đăng tin tuyển dụng
                    </Link>
                  )}
                </div>
              </div>
              {/* Hero Image */}
              <div className="flex-1 relative">
                {/* Blob shapes */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 right-32 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 right-20 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

                {/* Image container */}
                <div className="relative z-10 backdrop-blur-sm bg-white/10 rounded-2xl p-6">
                  <img
                    src={jobSearchImage}
                    alt="Tìm Kiếm Việc Làm"
                    className="w-full max-w-[600px] mx-auto 
                                                 relative z-10 
                                                 transition-all duration-500
                                                 hover:transform hover:scale-102
                                                 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-12 -mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
              {statsLoading ? (
                <div className="text-center col-span-4">
                  <div className="animate-pulse">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      Loading...
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      {stats?.activeJobs || "10K+"}
                    </div>
                    <div className="text-gray-600">Công Việc Đang Tuyển</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      {stats?.companies || "5K+"}
                    </div>
                    <div className="text-gray-600">Doanh Nghiệp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      {stats?.applicants || "1M+"}
                    </div>
                    <div className="text-gray-600">Ứng Viên</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      {stats?.hires || "8K+"}
                    </div>
                    <div className="text-gray-600">Đã Tuyển Dụng</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Jobs Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cơ Hội Nổi Bật
              </h2>
              <div className="h-1 w-20 bg-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">
                Khám phá các vị trí được chọn lọc từ các công ty hàng đầu
              </p>
            </div>

            {loading ? (
              <div className="w-full h-40 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 mx-20">
                {allJobs && allJobs.length >= 4 ? (
                  [3, 1, 2].map((index) =>
                    allJobs[index] ? (
                      <Link
                        key={allJobs[index]._id}
                        to={`/details/${allJobs[index]._id}`}
                        className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 
                                                     transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 flex justify-center items-center bg-gray-50 rounded-lg p-2 overflow-hidden">
                            <img
                              src={
                                allJobs[index].companyLogo?.url ||
                                "/default-logo.png"
                              }
                              alt={allJobs[index].title}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 
                                                               transition-colors duration-300 line-clamp-2"
                            >
                              {allJobs[index].title}
                            </h3>
                            <p className="text-lg text-gray-700 font-medium">
                              {allJobs[index].companyName}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                          {allJobs[index].description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                          <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                            {convertDateFormat(
                              allJobs[index].createdAt?.slice(0, 10) || ""
                            )}
                          </span>
                          <span className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full">
                            {allJobs[index].employmentType}
                          </span>
                          <span className="px-3 py-1 text-sm text-green-600 bg-green-50 rounded-full">
                            {allJobs[index].location}
                          </span>
                        </div>
                      </Link>
                    ) : null
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Không có công việc nào được tìm thấy
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Companies Section with Image Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Được Tin Tưởng Bởi Các Doanh Nghiệp Hàng Đầu
              </h2>
              <div className="h-1 w-20 bg-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">
                Tham gia cùng hàng nghìn doanh nghiệp tin tưởng chúng tôi trong
                việc tuyển dụng
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              {companyLogos.map((logo, i) => (
                <div
                  key={i}
                  className="relative group w-32 h-32 p-4 bg-white rounded-xl shadow-md 
                                              hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <img
                    src={logo.link}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 
                                                 transition-all duration-300 group-hover:scale-110"
                    alt="Logo công ty"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* About Section with Image */}
        <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-50"></div>
                <img
                  src={coporateImage}
                  alt="Về JobFinder"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    JobFinder
                  </h3>
                  <p className="text-sm text-gray-600">
                    Kết nối người tài năng với cơ hội phù hợp nhất
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Về JobFinder
                  </h2>
                  <p className="text-14 text-gray-600 leading-relaxed">
                    Khám phá Sức Mạnh của Khả Năng với JobFinder: Nơi Hành Trình
                    Nghề Nghiệp của Bạn Bắt Đầu, Được Hướng Dẫn bởi Mạng Lưới Cơ
                    Hội Đa Dạng! Chúng tôi kết nối các chuyên viên tài năng với
                    các công ty tiên phong để tạo ra mối quan hệ nghề nghiệp ý
                    nghĩa.
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 p-6 bg-blue-50 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      Tầm Nhìn
                    </h3>
                    <p className="text-gray-600 text-14">
                      Đưa người tài năng đến với cơ hội phù hợp nhất
                    </p>
                  </div>
                  <div className="flex-1 p-6 bg-blue-50 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      Sứ Mệnh
                    </h3>
                    <p className="text-gray-600 text-14">
                      Xây dựng nền tảng kết nối nhân tài và doanh nghiệp
                    </p>
                  </div>
                </div>
                <div>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
                  >
                    Tìm hiểu thêm về chúng tôi
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
