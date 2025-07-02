import React, { useState, useEffect } from 'react';
import { RegistrationRequest, Area } from '../../types';
import { User, Phone, Car as IdCard, MapPin, Home, Briefcase, Heart, Baby, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface RegistrationRequestFormProps {
  areas: Area[];
  onSubmit: (data: Omit<RegistrationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onCancel: () => void;
}

export const RegistrationRequestForm: React.FC<RegistrationRequestFormProps> = ({ 
  areas, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    // بيانات ولي الأمر
    name: '',
    nationalId: '',
    phone: '',
    gender: 'male' as 'male' | 'female',
    maritalStatus: 'متزوج',
    currentJob: '',
    residenceStatus: 'resident' as 'resident' | 'displaced',
    originalGovernorate: '',
    originalCity: '',
    displacementAddress: '',
    areaId: 0,
    areaName: '',
    // بيانات إضافية
    notes: '',
    // الزوجات والأبناء
    wives: [] as { name: string; nationalId: string }[],
    children: [] as { name: string; nationalId: string; birthDate: string; gender: 'male' | 'female' }[]
  });

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [nationalIdExists, setNationalIdExists] = useState(false);

  // تحديث المنطقة عند اختيار الحي
  useEffect(() => {
    if (formData.areaId) {
      const area = areas.find(a => a.id === formData.areaId);
      setSelectedArea(area || null);
      if (area) {
        setFormData(prev => ({ ...prev, areaName: area.name }));
      }
    }
  }, [formData.areaId, areas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nationalIdExists) {
      alert('رقم الهوية موجود مسبقاً، يرجى استخدام رقم هوية آخر');
      return;
    }

    if (!formData.name.trim()) {
      alert('يرجى إدخال الاسم');
      return;
    }

    if (!formData.nationalId.trim()) {
      alert('يرجى إدخال رقم الهوية');
      return;
    }

    if (!formData.phone.trim()) {
      alert('يرجى إدخال رقم الجوال');
      return;
    }

    if (!formData.areaId) {
      alert('يرجى اختيار المنطقة');
      return;
    }

    // التحقق من صحة بيانات الزوجات
    const hasInvalidWives = formData.wives.some(wife => !wife.name.trim() || !wife.nationalId.trim());
    if (hasInvalidWives) {
      alert('يرجى إدخال جميع بيانات الزوجات بشكل صحيح أو حذف السجلات الفارغة');
      return;
    }

    // التحقق من صحة بيانات الأبناء
    const hasInvalidChildren = formData.children.some(
      child => !child.name.trim() || !child.nationalId.trim() || !child.birthDate
    );
    if (hasInvalidChildren) {
      alert('يرجى إدخال جميع بيانات الأبناء بشكل صحيح أو حذف السجلات الفارغة');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // التحقق من وجود رقم الهوية (محاكاة)
    if (name === 'nationalId' && value.trim().length > 5) {
      // هذا مجرد محاكاة للتحقق من وجود رقم الهوية
      // في التطبيق الحقيقي، يجب التحقق من قاعدة البيانات
      setNationalIdExists(value === '123456789');
    } else if (name === 'nationalId') {
      setNationalIdExists(false);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // إضافة زوجة جديدة
  const addWife = () => {
    setFormData(prev => ({
      ...prev,
      wives: [...prev.wives, { name: '', nationalId: '' }]
    }));
  };

  // حذف زوجة
  const removeWife = (index: number) => {
    setFormData(prev => ({
      ...prev,
      wives: prev.wives.filter((_, i) => i !== index)
    }));
  };

  // تحديث بيانات الزوجة
  const updateWife = (index: number, field: keyof typeof formData.wives[0], value: string) => {
    setFormData(prev => {
      const updatedWives = [...prev.wives];
      updatedWives[index] = { ...updatedWives[index], [field]: value };
      return { ...prev, wives: updatedWives };
    });
  };

  // إضافة ابن جديد
  const addChild = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', nationalId: '', birthDate: today, gender: 'male' }]
    }));
  };

  // حذف ابن
  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  // تحديث بيانات الابن
  const updateChild = (index: number, field: keyof typeof formData.children[0], value: string | 'male' | 'female') => {
    setFormData(prev => {
      const updatedChildren = [...prev.children];
      updatedChildren[index] = { ...updatedChildren[index], [field]: value };
      return { ...prev, children: updatedChildren };
    });
  };

  const maritalStatusOptions = ['متزوج', 'أرمل', 'مطلق', 'أعزب'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* البيانات الأساسية */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">البيانات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهوية *
            </label>
            <div>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border ${nationalIdExists ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="أدخل رقم الهوية"
                dir="ltr"
              />
              {nationalIdExists && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  رقم الهوية موجود مسبقاً
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوظيفة الحالية
            </label>
            <input
              type="text"
              name="currentJob"
              value={formData.currentJob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل الوظيفة الحالية"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الجوال *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل رقم الجوال"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الجنس *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>
      </div>

      {/* البيانات العائلية */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">البيانات العائلية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة الاجتماعية *
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {maritalStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* العنوان والسكن */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4">العنوان والسكن</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة *
            </label>
            <select
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">اختر المنطقة</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم مندوب المنطقة (تلقائي)
            </label>
            <input
              type="text"
              value={selectedArea?.representativeName || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              placeholder="سيتم عرض اسم المندوب بعد اختيار المنطقة"
            />
          </div>
        </div>
      </div>

      {/* حالة الإقامة */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-lg font-bold text-orange-900 mb-4">حالة الإقامة</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المحافظة الأصلية
                  </label>
                  <input
                    type="text"
                    name="originalGovernorate"
                    value={formData.originalGovernorate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="أدخل المحافظة الأصلية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة الأصلية
                  </label>
                  <input
                    type="text"
                    name="originalCity"
                    value={formData.originalCity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="أدخل المدينة الأصلية"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان النزوح
                  </label>
                  <input
                    type="text"
                    name="displacementAddress"
                    value={formData.displacementAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="أدخل عنوان النزوح الحالي"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* بيانات الزوجات */}
      {formData.gender === 'male' && formData.maritalStatus === 'متزوج' && (
        <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-pink-900">بيانات الزوجات</h3>
            <button
              type="button"
              onClick={addWife}
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة زوجة</span>
            </button>
          </div>

          {formData.wives.length > 0 ? (
            <div className="space-y-4">
              {formData.wives.map((wife, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-pink-100 relative">
                  <button
                    type="button"
                    onClick={() => removeWife(index)}
                    className="absolute top-2 left-2 p-1 text-red-600 hover:bg-red-50 rounded-full"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الزوجة *
                      </label>
                      <input
                        type="text"
                        value={wife.name}
                        onChange={(e) => updateWife(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="أدخل اسم الزوجة"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم هوية الزوجة *
                      </label>
                      <input
                        type="text"
                        value={wife.nationalId}
                        onChange={(e) => updateWife(index, 'nationalId', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="أدخل رقم هوية الزوجة"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center border border-pink-100">
              <Heart className="h-12 w-12 text-pink-300 mx-auto mb-4" />
              <p className="text-pink-600 font-medium">لا توجد زوجات مضافة</p>
              <p className="text-pink-500 text-sm mt-2">اضغط على زر "إضافة زوجة" لإضافة زوجة جديدة</p>
            </div>
          )}
        </div>
      )}

      {/* بيانات الأبناء */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-900">بيانات الأبناء</h3>
          <button
            type="button"
            onClick={addChild}
            className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة ابن</span>
          </button>
        </div>

        {formData.children.length > 0 ? (
          <div className="space-y-4">
            {formData.children.map((child, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 relative">
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="absolute top-2 left-2 p-1 text-red-600 hover:bg-red-50 rounded-full"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الابن *
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم الابن"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم هوية الابن *
                    </label>
                    <input
                      type="text"
                      value={child.nationalId}
                      onChange={(e) => updateChild(index, 'nationalId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رقم هوية الابن"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الميلاد *
                    </label>
                    <input
                      type="date"
                      value={child.birthDate}
                      onChange={(e) => updateChild(index, 'birthDate', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الجنس *
                    </label>
                    <select
                      value={child.gender}
                      onChange={(e) => updateChild(index, 'gender', e.target.value as 'male' | 'female')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center border border-blue-100">
            <Baby className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-600 font-medium">لا يوجد أبناء مضافين</p>
            <p className="text-blue-500 text-sm mt-2">اضغط على زر "إضافة ابن" لإضافة ابن جديد</p>
          </div>
        )}
      </div>

      {/* ملاحظات */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ملاحظات</h3>
        
        <div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            placeholder="أدخل أي ملاحظات إضافية..."
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
          className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition-colors"
          disabled={nationalIdExists}
        >
          تقديم الطلب
        </button>
      </div>
    </form>
  );
};