import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
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
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "../actions/JobActions";
import { HiOutlineSparkles } from "react-icons/hi";
import { InputField, TextAreaField } from "./EditJobAdmin";
import { motion } from "framer-motion";
import { Loader } from "../components/Loader";

export const CreateJob = () => {
  const { loading } = useSelector((state) => state.job);

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [category, setCategory] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState("");
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
  const postHandler = (e) => {
    e.preventDefault();
    const skillsArr = skillsRequired.split(",");
    const data = {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired: skillsArr,
      experience,
      salary,
      category,
      employmentType,
    };

    dispatch(createJobPost(data));

    setTitle("");
    setDescription("");
    setCompanyName("");
    setLocation("");
    setSalary("");
    setExperience("");
    setSkillsRequired("");
    setCategory("");
    setEmploymentType("");
    setLogo("");
    setLogoName("");
  };

  return (
    <>
      <MetaData title="Chỉnh sửa tin tuyển dụng" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-14 md:px-20 px-3">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <Sidebar />
            <div className=" flex justify-center w-full items-start pt-6 pb-10">
              <form
                onSubmit={postHandler}
                className="max-w-4xl mx-auto bg-white mt-10 rounded-xl shadow-xl p-6"
              >
                <div className="flex flex-col w-full justify-center items-center gap-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <HiOutlineSparkles className="text-blue-500 text-3xl animate-pulse" />
                    <h2 className="text-3xl font-bold text-blue-700 uppercase">
                      Đăng tin tuyển dụng
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
                    <button
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full"
                    >
                      {loading ? (
                        <TbLoader2 className="animate-spin" size={24} />
                      ) : (
                        "Post Job"
                      )}
                    </button>
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
