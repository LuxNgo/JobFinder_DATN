import React from 'react';

const PersonalInfoForm = ({ personalInfo, setPersonalInfo }) => {
  const handleChange = (field) => (e) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={handleChange('fullName')}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={handleChange('email')}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ</label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={handleChange('location')}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
