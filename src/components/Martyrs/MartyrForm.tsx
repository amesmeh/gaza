import React, { useState, useEffect } from 'react';
import { Martyr } from '../../types';
import { User, Phone, Car as IdCard, Calendar, Heart, FileText } from 'lucide-react';

interface MartyrFormProps {
  martyr?: Martyr;
  onSubmit: (data: Omit<Martyr, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const MartyrForm: React.FC<MartyrFormProps> = ({ 
  martyr, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    martyrdomDate: '',
    agentName: '',
    agentNationalId: '',
    agentPhone: '',
    relationshipToMartyr: '',
    notes: ''
  });

  useEffect(() => {
    if (martyr) {
      setFormData({
        name: martyr.name,
        nationalId: martyr.nationalId,
        martyrdomDate: martyr.martyrdomDate,
        agentName: martyr.agentName,
        agentNationalId: martyr.agentNationalId,
        agentPhone: martyr.agentPhone,
        relationshipToMartyr: martyr.relationshipToMartyr,
        notes: martyr.notes || ''
      });
    } else {
      // تعيين التاريخ الحالي كافتراضي للشهداء الجدد
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, martyrdomDate: today }));
    }
  }, [martyr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم الشهيد');
      return;
    }

    if (!formData.nationalId.trim()) {
      alert('يرجى إدخال رقم هوية الشهيد');
      return;
    }

    if (!formData.martyrdomDate) {
      alert('يرجى إدخال تاريخ الاستشهاد');
      return;
    }

    if (!formData.agentName.trim()) {
      alert('يرجى إدخال اسم الوكيل');
      return;
    }

    if (!formData.agentNationalId.trim()) {
      alert('يرجى إدخال رقم هوية الوكيل');
      return;
    }

    if (!formData.agentPhone.trim()) {
      alert('يرجى إدخال رقم جوال الوكيل');
      return;
    }

    if (!formData.relationshipToMartyr.trim()) {
      alert('يرجى إدخال صلة القرابة');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* بيانات الشهيد */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
          <Heart className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الشهيد
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الشهيد *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="أدخل اسم الشهيد الكامل"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية الشهيد *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="أدخل رقم هوية الشهيد"
                dir="ltr"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الاستشهاد *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="martyrdomDate"
                value={formData.martyrdomDate}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* بيانات الوكيل */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <User className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الوكيل
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الوكيل *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسم الوكيل الكامل"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية الوكيل *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="agentNationalId"
                value={formData.agentNationalId}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل رقم هوية الوكيل"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم جوال الوكيل *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل رقم جوال الوكيل"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صلة قرابة الوكيل بالشهيد *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Heart className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="relationshipToMartyr"
                value={formData.relationshipToMartyr}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل صلة القرابة (مثال: والد، أخ، عم)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* الملاحظات */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          الملاحظات
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات إضافية
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="أدخل أي ملاحظات إضافية حول الشهيد أو الوكيل..."
          />
        </div>
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
          className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
        >
          {martyr ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};