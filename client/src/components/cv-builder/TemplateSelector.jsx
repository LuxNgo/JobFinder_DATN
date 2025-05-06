import React from 'react';

const TemplateSelector = ({ selectedTemplate, setSelectedTemplate }) => {
  const templates = [
    { 
      id: 'professional',
      name: 'Chuyên Nghiệp',
      description: 'Thiết kế nghiêm túc và phù hợp cho ngành truyền thống'
    },
    { 
      id: 'elegant',
      name: 'Thanh Lịch',
      description: 'Thiết kế tinh tế, nhẹ nhàng và hài hòa'
    },
    { 
      id: 'techy',
      name: 'Công Nghệ',
      description: 'Thiết kế sắc nét, hiện đại cho dân công nghệ'
    },
    { 
      id: 'bold',
      name: 'Cá Tính',
      description: 'Thiết kế đậm và khác biệt, gây ấn tượng mạnh'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Chọn Mẫu CV</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className={`p-4 border rounded-lg cursor-pointer ${selectedTemplate === template.id ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'}`} 
            onClick={() => setSelectedTemplate(template.id)}
            style={{ backgroundColor: selectedTemplate === template.id ? '#f0f9ff' : 'white' }}
          >
            <h3 className="font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{template.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Mẫu {template.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
