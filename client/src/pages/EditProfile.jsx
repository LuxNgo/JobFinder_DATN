import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, me as ME } from '../actions/UserActions';
import { Loader } from '../components/Loader';
import { MetaData } from '../components/MetaData';
import { 
  AiOutlineMail, 
  AiOutlineUser, 
  AiOutlineFile, 
  AiOutlineTags 
} from 'react-icons/ai';

const InputField = ({ icon: Icon, value, onChange, placeholder, type = "text", required = true }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
      <Icon size={20} className="text-gray-400" />
    </div>
    <input
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      type={type}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
    />
  </div>
);

const FileInput = ({ icon: Icon, id, label, onChange, accept }) => (
  <div className="relative w-full">
    <div className="absolute top-3 left-0 pl-3 flex items-center">
      <Icon size={20} className="text-gray-400" />
    </div>
    <div className="w-full">
      <label 
        htmlFor={id}
        className="block w-full px-10 py-3 rounded-xl border border-blue-200 cursor-pointer text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
      >
        {label}
      </label>
      <input
        id={id}
        onChange={onChange}
        accept={accept}
        type="file"
        className="hidden"
      />
    </div>
    <p className="text-xs text-blue-400 px-4 mt-4 ml-6">Định dạng được chấp nhận: {accept}</p>
  </div>
);

export const EditProfile = () => {
  const dispatch = useDispatch();
  const { loading, me } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    avatar: '',
    avatarName: '',
    resume: '',
    resumeName: ''
  });

  useEffect(() => {
    if (me) {
      setFormData(prev => ({
        ...prev,
        name: me.name || '',
        email: me.email || '',
        skills: Array.isArray(me.skills) ? me.skills.join(', ') : me.skills || '',
        avatar: me.avatar?.url || '',
        avatarName: me.avatar?.public_id || '',
        resume: me.resume?.url || '',
        resumeName: me.resume?.public_id || ''
      }));
    }
  }, [me]);

  // useEffect(() => {
  //   // Only fetch user data once when component mounts
  //   const fetchUserData = async () => {
  //     try {
  //       await dispatch(ME());
  //     } catch (error) {
  //       toast.error('Lỗi khi lấy thông tin người dùng');
  //     }
  //   };

  //   fetchUserData();
  // }, [dispatch]);

  const handleFileChange = useCallback((fileType) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn một file ảnh');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFormData(prev => ({
          ...prev,
          [fileType]: reader.result,
          [`${fileType}Name`]: file.name
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!formData.avatar || !formData.resume) {
      toast.error('Vui lòng chọn cả ảnh đại diện và hồ sơ');
      return;
    }

    const skillArr = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    const data = {
      newName: formData.name,
      newEmail: formData.email,
      newAvatar: formData.avatar,
      newResume: formData.resume,
      newSkills: skillArr
    };

    dispatch(updateProfile(data));
  }, [formData, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <MetaData title="Edit Profile" />
      <div className="min-h-screen bg-blue-50 py-16 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-md mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-blue-100"
          >
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
              Chỉnh sửa hồ sơ
            </h1>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Tên đầy đủ</label>
              <InputField
                icon={AiOutlineUser}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên đầy đủ"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <InputField
                icon={AiOutlineMail}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập email"
                type="email"
              />
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
              <FileInput
                icon={AiOutlineUser}
                id="avatar"
                label={formData.avatarName || "Chọn ảnh đại diện"}
                onChange={handleFileChange('avatar')}
                accept="image/*"
              />
            </div>

            <div className="space-y-5">
              <label className="block text-sm font-medium text-gray-700">Hồ sơ</label>
              <FileInput
                icon={AiOutlineFile}
                id="resume"
                label={formData.resumeName || "Chọn hồ sơ"}
                onChange={handleFileChange('resume')}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-700">Kỹ năng</label>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-gray-500 px-3 py-2">
                  <AiOutlineTags size={20} />
                </div>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="Nhập kỹ năng (cách nhau bằng dấu phẩy)"
                  className="outline-none w-full text-blue-700 px-3 py-2 min-h-[100px] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg active:bg-blue-800"
            >
              Cập nhật hồ sơ
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
