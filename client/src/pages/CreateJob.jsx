import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdOutlineLocationOn,
  MdOutlineFeaturedPlayList,
  MdOutlineWorkOutline,
  MdWorkspacesOutline,
  MdAttachMoney,
  MdOutlineReceiptLong,
} from 'react-icons/md';
import { BiImageAlt, BiBuilding } from 'react-icons/bi';
import { TbLoader2 } from 'react-icons/tb';
import { RxCross1 } from 'react-icons/rx';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MetaData } from '../components/MetaData';
import { Sidebar } from '../components/Sidebar';
import { createJobPost } from '../actions/JobActions';

const InputField = ({ icon: Icon, ...props }) => (
  <motion.div 
    className='bg-white flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md'
  >
    <div className='text-blue-500'>
      <Icon size={20} />
    </div>
    <input 
      {...props} 
      className='outline-none w-full text-gray-900 px-1 py-2 placeholder:text-gray-400 placeholder:font-medium transition-all duration-200'
    />
  </motion.div>
);

const TextAreaField = ({ icon: Icon, ...props }) => (
  <motion.div 
    className='bg-white flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md'
  >
    <div className='text-blue-500 pt-1'>
      <Icon size={20} />
    </div>
    <textarea 
      {...props} 
      className='outline-none w-full text-gray-900 px-1 py-2 placeholder:text-gray-400 placeholder:font-medium resize-none h-32 transition-all duration-200'
    />
  </motion.div>
);

export const CreateJob = () => {
  const { loading } = useSelector(state => state.job);
  const dispatch = useDispatch();

  const [sideTog, setSideTog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    skillsRequired: '',
    experience: '',
    salary: '',
    category: '',
    employmentType: '',
    logo: '',
    logoName: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const logoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result, logoName: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const postHandler = e => {
    e.preventDefault();
    const payload = {
      ...formData,
      skillsRequired: formData.skillsRequired.split(','),
    };
    dispatch(createJobPost(payload));
    setFormData({
      title: '', description: '', companyName: '', location: '', skillsRequired: '', experience: '', salary: '', category: '', employmentType: '', logo: '', logoName: '',
    });
  };

  return (
    <>
      <MetaData title='Đăng tin tuyển dụng' />
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16 px-4 md:px-10'>
        <div className='fixed left-0 top-14 z-20'>
          <div
            onClick={() => setSideTog(!sideTog)}
            className='cursor-pointer bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-blue-100 transition-all duration-200'
          >
            {!sideTog ? 'Menu' : <RxCross1 className='text-xl text-blue-500' />}
          </div>
        </div>
        <Sidebar sideTog={sideTog} />

        <div className='max-w-4xl mx-auto bg-white mt-10 rounded-xl shadow-xl p-6 mb-16'>
          <div className='flex items-center justify-center gap-2 mb-6'>
            <HiOutlineSparkles className='text-blue-500 text-3xl animate-pulse' />
            <h2 className='text-3xl font-semibold text-blue-700'>Đăng Tin Tuyển Dụng</h2>
          </div>
          <form onSubmit={postHandler} className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField icon={MdOutlineWorkOutline} name='title' value={formData.title} onChange={handleChange} placeholder='Tên Công Việc' required />
              <InputField icon={BiBuilding} name='companyName' value={formData.companyName} onChange={handleChange} placeholder='Tên Công ty' required />
              <InputField icon={MdOutlineLocationOn} name='location' value={formData.location} onChange={handleChange} placeholder='Địa chỉ' required />
              <InputField icon={MdAttachMoney} name='salary' value={formData.salary} onChange={handleChange} placeholder='Mức lương' required />
              <InputField icon={MdOutlineReceiptLong} name='experience' value={formData.experience} onChange={handleChange} placeholder='Kinh nghiệm' required />
            </div>
            <TextAreaField icon={MdOutlineFeaturedPlayList} name='description' value={formData.description} onChange={handleChange} placeholder='Mô tả công việc' required />
            <TextAreaField icon={MdWorkspacesOutline} name='skillsRequired' value={formData.skillsRequired} onChange={handleChange} placeholder='Kỹ năng cần có (cách nhau bằng dấu phẩy)' required />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='block w-full px-4 py-3 text-base text-gray-700 bg-white border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                required
              >
                <option value=''>Chọn ngành nghề</option>
                <option value='Technology'>Công nghệ</option>
                <option value='Marketing'>Marketing</option>
                <option value='Finance'>Tài chính</option>
                <option value='Sales'>Bán hàng</option>
                <option value='Legal'>Pháp lý</option>
              </select>

              <select
                name='employmentType'
                value={formData.employmentType}
                onChange={handleChange}
                className='block w-full px-4 py-3 text-base text-gray-700 bg-white border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                required
              >
                <option value=''>Chọn hình thức làm việc</option>
                <option value='full-time'>Toàn thời gian</option>
                <option value='part-time'>Bán thời gian</option>
                <option value='contract'>Hợp đồng</option>
                <option value='internship'>Thực tập</option>
              </select>
            </div>

            <div className='flex items-center gap-4'>
              {formData.logo ? (
                <div className='relative group'>
                  <img src={formData.logo} alt='Logo' className='w-12 h-12 object-contain rounded-md border border-blue-200' />
                  <div className='absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md'></div>
                </div>
              ) : (
                <div className='w-12 h-12 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50'>
                  <BiImageAlt size={32} className='text-blue-500' />
                </div>
              )}
              <label className='cursor-pointer text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors duration-200'>
                {formData.logoName || 'Chọn logo công ty'}
                <input type='file' accept='image/*' onChange={logoChange} className='hidden' />
              </label>
            </div>

            <motion.button
              type='submit'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-2'
            >
              {loading ? (
                <TbLoader2 className='animate-spin text-white' size={24} />
              ) : (
                <>
                  <span>Đăng tin tuyển dụng</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
};