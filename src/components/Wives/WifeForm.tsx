import React, { useState, useEffect } from 'react';
import { Wife, Guardian } from '../../types';

interface WifeFormProps {
  wife?: Wife;
  guardians: Guardian[];
  onSubmit: (data: Omit<Wife, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const WifeForm: React.FC<WifeFormProps> = ({ 
  wife, 
  guardians, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    husbandId: 0,
    husbandNationalId: ''
  });

  const [selectedHusband, setSelectedHusband] = useState<Guardian | null>(null);

  // فلترة أولياء الأمور الذكور المتزوجين فقط
  const marriedMaleGuardians = guardians.filter(g => 
    g.gender === 'male' && 
    (g.maritalStatus === 'متزوج' || g.wivesCount > 0)
  );

  useEffect(() => {
    if (wife) {
      setFormData({
        name: wife.name,
        nationalId: wife.nationalId,
        husbandId: wife.husbandId,
        husbandNationalId: wife.husbandNationalId
      });
      
      const husband = guardians.find(g => g.id === wife.husbandId);
      setSelectedHusband(husband || null);
    }
  }, [wife, guardians]);

  // تحديث بيانات الزوج عند اختيار زوج جديد
  useEffect(() => {
    if (formData.husbandId) {
      const husband = guardians.find(g => g.id === formData.husbandId);
      if (husband) {
        setSelectedHusband(husband);
        setFormData(prev => ({
          ...prev,
          husbandNationalId: husband.nationalId
        }));
      }
    }
  }, [formData.husbandId, guardians]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.husbandId) {
      alert('يرجى اختيار الزوج');
      return;
    }

    // الحصول على بيانات الزوج لتحديث المنطقة
    const husband = guardians.find(g => g.id === formData.husbandId);
    const wifeData = {
      ...formData,
      areaId: husband?.areaId || 0,
      areaName: husband?.area?.name || ''
    };

    onSubmit(wifeData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'husbandId' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* بيانات الزوجة */}
      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
        <h3 className="text-lg font-bold text-pink-900 mb-4">بيانات الزوجة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الزوجة *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="أدخل اسم الزوجة الكامل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية الزوجة *
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="أدخل رقم هوية الزوجة"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* بيانات الزوج */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">بيانات الزوج</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختيار الزوج *
            </label>
            <select
              name="husbandId"
              value={formData.husbandId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر الزوج</option>
              {marriedMaleGuardians.map(guardian => (
                <option key={guardian.id} value={guardian.id}>
                  {guardian.name} - {guardian.nationalId}
                </option>
              ))}
            </select>
            {marriedMaleGuardians.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                لا يوجد أولياء أمور ذكور متزوجين في النظام
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية الزوج (تلقائي)
            </label>
            <input
              type="text"
              value={formData.husbandNationalId}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              placeholder="سيتم عرض رقم هوية الزوج بعد الاختيار"
              dir="ltr"
            />
          </div>
        </div>

        {/* معلومات الزوج المختار */}
        {selectedHusband && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">معلومات الزوج المختار</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">الاسم: </span>
                <span className="text-blue-900 font-semibold">{selectedHusband.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">رقم الهوية: </span>
                <span className="text-blue-900 font-mono font-semibold">{selectedHusband.nationalId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">عدد الزوجات الحالي: </span>
                <span className="text-blue-900 font-semibold">{selectedHusband.wivesCount}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">المنطقة: </span>
                <span className="text-blue-900 font-semibold">{selectedHusband.area?.name || 'غير محدد'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">الهاتف: </span>
                <span className="text-blue-900 font-mono font-semibold">{selectedHusband.phone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">المهنة: </span>
                <span className="text-blue-900 font-semibold">{selectedHusband.currentJob || 'غير محدد'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">عدد الأطفال: </span>
                <span className="text-blue-900 font-semibold">{selectedHusband.childrenCount}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">حالة الإقامة: </span>
                <span className={`font-semibold ${
                  selectedHusband.residenceStatus === 'displaced' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {selectedHusband.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 transition-colors"
        >
          {wife ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};