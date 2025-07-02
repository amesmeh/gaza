import React, { useState, useEffect } from 'react';
import { Area } from '../../types';

interface AreaFormProps {
  area?: Area;
  onSubmit: (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const AreaForm: React.FC<AreaFormProps> = ({ area, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    representativeName: '',
    representativeId: '',
    representativePhone: ''
  });

  useEffect(() => {
    if (area) {
      setFormData({
        name: area.name,
        representativeName: area.representativeName,
        representativeId: area.representativeId,
        representativePhone: area.representativePhone
      });
    }
  }, [area]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          اسم المنطقة *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="أدخل اسم المنطقة"
        />
      </div>

      <div>
        <label htmlFor="representativeName" className="block text-sm font-medium text-gray-700 mb-2">
          اسم المندوب *
        </label>
        <input
          type="text"
          id="representativeName"
          name="representativeName"
          value={formData.representativeName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="أدخل اسم المندوب"
        />
      </div>

      <div>
        <label htmlFor="representativeId" className="block text-sm font-medium text-gray-700 mb-2">
          رقم هوية المندوب *
        </label>
        <input
          type="text"
          id="representativeId"
          name="representativeId"
          value={formData.representativeId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="أدخل رقم الهوية"
        />
      </div>

      <div>
        <label htmlFor="representativePhone" className="block text-sm font-medium text-gray-700 mb-2">
          رقم الهاتف *
        </label>
        <input
          type="tel"
          id="representativePhone"
          name="representativePhone"
          value={formData.representativePhone}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="أدخل رقم الهاتف"
          dir="ltr"
        />
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
        >
          {area ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};