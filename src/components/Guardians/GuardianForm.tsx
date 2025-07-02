import React, { useState, useEffect } from 'react';
import { Guardian, Area } from '../../types';

interface GuardianFormProps {
  guardian?: Guardian;
  areas: Area[];
  onSubmit: (data: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const GuardianForm: React.FC<GuardianFormProps> = ({ 
  guardian, 
  areas, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    currentJob: '',
    phone: '',
    gender: 'male' as 'male' | 'female',
    maritalStatus: 'متزوج',
    childrenCount: 0,
    wivesCount: 0,
    familyMembersCount: 1,
    areaId: 0,
    residenceStatus: 'resident' as 'resident' | 'displaced',
    originalGovernorate: '',
    originalCity: '',
    displacementAddress: ''
  });

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  useEffect(() => {
    if (guardian) {
      setFormData({
        name: guardian.name,
        nationalId: guardian.nationalId,
        currentJob: guardian.currentJob || '',
        phone: guardian.phone,
        gender: guardian.gender,
        maritalStatus: guardian.maritalStatus,
        childrenCount: guardian.childrenCount,
        wivesCount: guardian.wivesCount,
        familyMembersCount: guardian.familyMembersCount,
        areaId: guardian.areaId,
        residenceStatus: guardian.residenceStatus,
        originalGovernorate: guardian.originalGovernorate || '',
        originalCity: guardian.originalCity || '',
        displacementAddress: guardian.displacementAddress || ''
      });
      
      const area = areas.find(a => a.id === guardian.areaId);
      setSelectedArea(area || null);
    }
  }, [guardian, areas]);

  // حساب عدد أفراد العائلة تلقائياً
  useEffect(() => {
    const totalMembers = formData.childrenCount + formData.wivesCount + 1;
    setFormData(prev => ({ ...prev, familyMembersCount: totalMembers }));
  }, [formData.childrenCount, formData.wivesCount]);

  // تحديث المندوب عند اختيار الحي
  useEffect(() => {
    if (formData.areaId) {
      const area = areas.find(a => a.id === formData.areaId);
      setSelectedArea(area || null);
    }
  }, [formData.areaId, areas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const maritalStatusOptions = ['متزوج', 'أرمل', 'مطلق', 'أعزب'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* البيانات الأساسية */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-base font-bold text-blue-900 mb-3">البيانات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              اسم ولي الأمر *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="أدخل اسم ولي الأمر"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              رقم هوية ولي الأمر *
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="أدخل رقم الهوية"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              الوظيفة الحالية
            </label>
            <input
              type="text"
              name="currentJob"
              value={formData.currentJob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="أدخل الوظيفة الحالية"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              رقم الجوال *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="أدخل رقم الجوال"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              الجنس *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>
      </div>

      {/* البيانات العائلية */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-base font-bold text-green-900 mb-3">البيانات العائلية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              الحالة الاجتماعية *
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              {maritalStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              عدد الأبناء
            </label>
            <input
              type="number"
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              عدد الزوجات
            </label>
            <input
              type="number"
              name="wivesCount"
              value={formData.wivesCount}
              onChange={handleChange}
              min="0"
              max="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              عدد أفراد العائلة (تلقائي)
            </label>
            <input
              type="number"
              value={formData.familyMembersCount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
            />
          </div>
        </div>
      </div>

      {/* العنوان والسكن */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-base font-bold text-purple-900 mb-3">العنوان والسكن</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              الحي *
            </label>
            <select
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="">اختر الحي</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              اسم مندوب الحي (تلقائي)
            </label>
            <input
              type="text"
              value={selectedArea?.representativeName || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
              placeholder="سيتم عرض اسم المندوب بعد اختيار الحي"
            />
          </div>
        </div>
      </div>

      {/* حالة الإقامة */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-base font-bold text-orange-900 mb-3">حالة الإقامة</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              حالة الإقامة *
            </label>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="residenceStatus"
                  value="resident"
                  checked={formData.residenceStatus === 'resident'}
                  onChange={handleChange}
                  className="ml-2 rtl:mr-2 rtl:ml-0"
                />
                مقيم
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="residenceStatus"
                  value="displaced"
                  checked={formData.residenceStatus === 'displaced'}
                  onChange={handleChange}
                  className="ml-2 rtl:mr-2 rtl:ml-0"
                />
                نازح
              </label>
            </div>
          </div>

          {formData.residenceStatus === 'displaced' && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-4">بيانات النزوح</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    المحافظة الأصلية
                  </label>
                  <input
                    type="text"
                    name="originalGovernorate"
                    value={formData.originalGovernorate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="أدخل المحافظة الأصلية"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    المدينة الأصلية
                  </label>
                  <input
                    type="text"
                    name="originalCity"
                    value={formData.originalCity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="أدخل المدينة الأصلية"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    عنوان النزوح
                  </label>
                  <input
                    type="text"
                    name="displacementAddress"
                    value={formData.displacementAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="أدخل عنوان النزوح الحالي"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
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
          {guardian ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};