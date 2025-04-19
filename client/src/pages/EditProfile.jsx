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
  <div className="bg-white flex items-center rounded-md overflow-hidden">
    <div className="text-gray-600 px-3 py-2">
      <Icon size={20} />
    </div>
    <input
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      type={type}
      className="outline-none w-full text-gray-800 px-3 py-2"
    />
  </div>
);

const FileInput = ({ icon: Icon, id, label, onChange, accept }) => (
  <div className="space-y-1">
    <div className="bg-white flex items-center rounded-md overflow-hidden">
      <div className="text-gray-600 px-3 py-2">
        <Icon size={20} />
      </div>
      <label 
        htmlFor={id}
        className="outline-none w-full cursor-pointer text-gray-600 px-3 py-2"
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
    <p className="text-xs text-gray-400 px-2">Accepted formats: {accept}</p>
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
        skills: Array.isArray(me.skills) ? me.skills.join(', ') : me.skills || ''
      }));
    }
  }, [me]);

  useEffect(() => {
    dispatch(ME());
  }, [dispatch]);

  const handleFileChange = useCallback((fileType) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
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
      toast.error('Please select both profile picture and resume');
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
      <div className="min-h-screen bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="bg-gray-900 rounded-lg shadow-xl p-6 space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-white mb-8">
              Edit Profile
            </h1>

            <InputField
              icon={AiOutlineUser}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Full Name"
            />

            <InputField
              icon={AiOutlineMail}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email Address"
              type="email"
            />

            <FileInput
              icon={AiOutlineUser}
              id="avatar"
              label={formData.avatarName || "Select Profile Picture"}
              onChange={handleFileChange('avatar')}
              accept="image/*"
            />

            <FileInput
              icon={AiOutlineFile}
              id="resume"
              label={formData.resumeName || "Select Resume"}
              onChange={handleFileChange('resume')}
              accept="image/*"
            />

            <div className="bg-white flex items-center rounded-md overflow-hidden">
              <div className="text-gray-600 px-3 py-2">
                <AiOutlineTags size={20} />
              </div>
              <textarea
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Skills (comma separated)"
                className="outline-none w-full text-gray-800 px-3 py-2 min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

