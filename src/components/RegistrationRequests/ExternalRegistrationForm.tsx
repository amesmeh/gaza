import React, { useState, useEffect } from 'react';
import { Area } from '../../types';
import { User, Phone, Car as IdCard, MapPin, Home, Briefcase, Heart, Baby, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface ExternalRegistrationFormProps {
  onSubmit: (data: any) => void;
}

export const ExternalRegistrationForm: React.FC<ExternalRegistrationFormProps> = ({ onSubmit }) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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
    // بيانات العائلة
    childrenCount: 0,
    wivesCount: 0,
    // بيانات إضافية
    notes: '',
    // الزوجات والأبناء
    wives: [] as { name: string; nationalId: string }[],
    children: [] as { name: string; nationalId: string; birthDate: string; gender: 'male' | 'female' }[]
  });

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [nationalIdExists, setNationalIdExists] = useState(false);

  // محاكاة جلب المناطق من الخادم
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // بيانات المناطق الوهمية
        const mockAreas: Area[] = [
          {
            id: 1,
            name: 'الرباط',
            representativeName: 'محمد أحمد',
            representativeId: '123456789',
            representativePhone: '0597111222',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            guardiansCount: 120
          },
          {
            id: 2,
            name: 'الشجاعية',
            representativeName: 'أحمد محمود',
            representativeId: '234567890',
            representativePhone: '0598222333',
            createdAt: '2024-01-02T10:00:00Z',
            updatedAt: '2024-01-02T10:00:00Z',
            guardiansCount: 85
          },
          {
            id: 3,
            name: 'جباليا',
            representativeName: 'محمود خالد',
            representativeId: '345678901',
            representativePhone: '0599333444',
            createdAt: '2024-01-03T10:00:00Z',
            updatedAt: '2024-01-03T10:00:00Z',
            guardiansCount: 150
          },
          {
            id: 4,
            name: 'النصيرات',
            representativeName: 'خالد سعيد',
            representativeId: '456789012',
            representativePhone: '0591444555',
            createdAt: '2024-01-04T10:00:00Z',
            updatedAt: '2024-01-04T10:00:00Z',
            guardiansCount: 110
          },
          {
            id: 5,
            name: 'خان يونس',
            representativeName: 'سعيد عبد الله',
            representativeId: '567890123',
            representativePhone: '0592555666',
            createdAt: '2024-01-05T10:00:00Z',
            updatedAt: '2024-01-05T10:00:00Z',
            guardiansCount: 130
          }
        ];
        
        setAreas(mockAreas);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال البيانات إلى الخادم
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // محاكاة نجاح العملية
      setSubmitSuccess(true);
      
      // إعادة تعيين النموذج بعد فترة
      setTimeout(() => {
        setFormData({
          name: '',
          nationalId: '',
          phone: '',
          gender: 'male',
          maritalStatus: 'متزوج',
          currentJob: '',
          residenceStatus: 'resident',
          originalGovernorate: '',
          originalCity: '',
          displacementAddress: '',
          areaId: 0,
          areaName: '',
          childrenCount: 0,
          wivesCount: 0,
          notes: '',
          wives: [],
          children: []
        });
        setSubmitSuccess(false);
      }, 5000);
      
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
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
      wives: [...prev.wives, { name: '', nationalId: '' }],
      wivesCount: prev.wivesCount + 1
    }));
  };

  // حذف زوجة
  const removeWife = (index: number) => {
    setFormData(prev => ({
      ...prev,
      wives: prev.wives.filter((_, i) => i !== index),
      wivesCount: prev.wivesCount - 1
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
      children: [...prev.children, { name: '', nationalId: '', birthDate: today, gender: 'male' }],
      childrenCount: prev.childrenCount + 1
    }));
  };

  // حذف ابن
  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
      childrenCount: prev.childrenCount - 1
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">جاري تحميل النموذج...</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-600 text-center mb-6">سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن.</p>
            <p className="text-gray-500 text-sm">رقم الطلب: {Math.floor(Math.random() * 1000000)}</p>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الأبناء *
            </label>
            <input
              type="number"
              name="childrenCount"
              value={formData.childrenCount}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الزوجات *
            </label>
            <input
              type="number"
              name="wivesCount"
              value={formData.wivesCount}
              onChange={handleChange}
              min="0"
              max="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
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
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting || nationalIdExists}
          className={`px-8 py-3 text-lg font-medium text-white rounded-xl shadow-lg transition-all duration-200 ${
            isSubmitting || nationalIdExists
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإرسال...
            </span>
          ) : (
            'إرسال الطلب'
          )}
        </button>
      </div>
    </form>
  );
};