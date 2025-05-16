import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { getJobData, updateJobData } from "../actions/AdminActions";
import {
  MdOutlineLocationOn,
  MdOutlineFeaturedPlayList,
  MdOutlineWorkOutline,
  MdWorkspacesOutline,
  MdAttachMoney,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { BiImageAlt } from "react-icons/bi";
import { TbLoader2 } from "react-icons/tb";
import { BiBuilding } from "react-icons/bi";
import { toast } from "react-toastify";
import { HiOutlineSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const EditJobAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, jobData } = useSelector((state) => state.admin);
  const [title, setTitle] = useState(jobData.title);
  const [description, setDescription] = useState(jobData.description);
  const [companyName, setCompanyName] = useState(jobData.companyName);
  const [location, setLocation] = useState(jobData.location);
  const [skillsRequired, setSkillsRequired] = useState(jobData.skillsRequired);
  const [experience, setExperience] = useState(jobData.experience);
  const [salary, setSalary] = useState(jobData.salary);
  const [category, setCategory] = useState(jobData.category);
  const [employmentType, setEmploymentType] = useState(jobData.employmentType);
  const [logo, setLogo] = useState(jobData.companyLogo.url);
  const [logoName, setLogoName] = useState("Select New Logo");
  const logoChange = (e) => {
    if (e.target.name === "logo") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setLogo(reader.result);
          setLogoName(e.target.files[0].name);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const postEditHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    dispatch(getJobData(id));
  }, []);

  useEffect(() => {
    setTitle(jobData.title);
    setDescription(jobData.description);
    setCompanyName(jobData.companyName);
    setLocation(jobData.location);
    setSkillsRequired(jobData.skillsRequired);
    setExperience(jobData.experience);
    setSalary(jobData.salary);
    setCategory(jobData.category);
    setEmploymentType(jobData.employmentType);
    setLogo(jobData.companyLogo.url);
  }, [jobData]);

  const updateJobHandler = () => {
    let skillsArr = skillsRequired;
    if (typeof skillsRequired === "string") {
      skillsArr = skillsRequired.split(",");
    }

    if (logo.includes("cloudinary")) {
      toast.info("Vui lòng chọn logo mới !");
    } else {
      const updatedData = {
        title,
        companyName,
        location,
        skillsRequired: skillsArr,
        experience,
        salary,
        category,
        employmentType,
        companyLogo: logo,
        description,
      };
      dispatch(updateJobData(id, updatedData));
    }
  };
  return (
    <>
      <MetaData title="Chỉnh sửa tin tuyển dụng" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 md:px-20 px-3">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className=" flex justify-center w-full items-start pb-10">
              <form
                onSubmit={postEditHandler}
                className="max-w-4xl mx-auto bg-white mt-10 rounded-xl shadow-xl p-6"
              >
                <Link
                  to={
                    localStorage.getItem("role") === "recruiter"
                      ? "/recruiter/allJobs"
                      : "/admin/allJobs"
                  }
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to
                </Link>
                <div className="flex flex-col w-full justify-center items-center gap-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <HiOutlineSparkles className="text-blue-500 text-3xl animate-pulse" />
                    <h2 className="text-3xl font-bold text-blue-700 uppercase">
                      Chỉnh sửa tin tuyển dụng
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Job Title */}
                    <InputField
                      icon={MdOutlineWorkOutline}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Tên công việc"
                      className="w-full"
                    />
                    {/* Company Name */}
                    <InputField
                      icon={BiBuilding}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="Tên công ty"
                      className="w-full"
                    />
                    {/* Company Logo */}
                    <div className="bg-white flex justify-center items-center rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md w-full">
                      <div className="text-blue-500 px-4">
                        {logo.length !== 0 ? (
                          <img src={logo} className="w-[3em]" alt="" />
                        ) : (
                          <BiImageAlt size={20} />
                        )}
                      </div>
                      <label
                        htmlFor="logo"
                        className="outline-none w-full cursor-pointer text-gray-900 px-2 pr-4 py-2.5"
                      >
                        {logoName.length === 0 ? (
                          <span className="text-gray-400">
                            Chọn logo công ty...
                          </span>
                        ) : (
                          logoName
                        )}
                      </label>
                      <input
                        id="logo"
                        name="logo"
                        required
                        onChange={logoChange}
                        accept="image/*"
                        type="file"
                        className="outline-none w-full hidden"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Experience */}
                    <InputField
                      icon={MdOutlineReceiptLong}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      placeholder="Kinh nghiệm"
                      className="w-full"
                    />
                    {/* Location */}
                    <InputField
                      icon={MdOutlineLocationOn}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="Địa chỉ"
                      className="w-full"
                    />
                    {/* Salary */}
                    <InputField
                      icon={MdAttachMoney}
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      required
                      placeholder="Mức lương"
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Job Description */}
                    <TextAreaField
                      icon={MdOutlineFeaturedPlayList}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả công việc"
                      className="w-full"
                    />
                    {/* Skills Required */}
                    <TextAreaField
                      icon={MdWorkspacesOutline}
                      value={skillsRequired}
                      onChange={(e) => setSkillsRequired(e.target.value)}
                      placeholder="Kỹ năng yêu cầu"
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    {/* Category */}
                    <div className="bg-white flex justify-center items-center shadow-sm">
                      <select
                        required
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        name=""
                        id="large"
                        className="block w-full px-6 py-2.5 text-base text-gray-900 rounded-xl border border-blue-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option selected value="">
                          Chọn ngành nghề
                        </option>
                        <option value="Technology">Công nghệ</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Tài chính</option>
                        <option value="Sales">Bán hàng</option>
                        <option value="Legal">Pháp lý</option>
                      </select>
                    </div>
                    {/* Employment Type */}
                    <div className="bg-white flex justify-center items-center shadow-sm">
                      <select
                        required
                        onChange={(e) => setEmploymentType(e.target.value)}
                        value={employmentType}
                        name=""
                        id="large"
                        className="block w-full px-6 py-2.5 text-base text-gray-900 rounded-xl border border-blue-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option selected value="">
                          Chọn hình thức làm việc
                        </option>
                        <option value="full-time">Toàn thời gian</option>
                        <option value="part-time">Bán thời gian</option>
                        <option value="contract">Hợp đồng</option>
                        <option value="internship">Thực tập</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={updateJobHandler}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full"
                    >
                      {loading ? (
                        <TbLoader2
                          className="animate-spin text-white"
                          size={24}
                        />
                      ) : (
                        <>
                          <span>Lưu thay đổi</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const InputField = ({ icon: Icon, ...props }) => (
  <motion.div className="bg-white flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="text-blue-500">
      <Icon size={20} />
    </div>
    <input
      {...props}
      className="outline-none w-full text-gray-900 px-1 py-2 placeholder:text-gray-400 placeholder:font-medium transition-all duration-200"
    />
  </motion.div>
);

export const TextAreaField = ({ icon: Icon, ...props }) => (
  <motion.div className="bg-white flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md w-full">
    <div className="text-blue-500 pt-1">
      <Icon size={20} />
    </div>
    <textarea
      {...props}
      className="outline-none w-full text-gray-900 px-1 py-2 placeholder:text-gray-400 placeholder:font-medium resize-none h-32 transition-all duration-200"
    />
  </motion.div>
);
