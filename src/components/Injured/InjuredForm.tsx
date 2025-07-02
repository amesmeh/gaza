import React, { useState, useEffect } from 'react';
import { Injured, Guardian } from '../../types';
import { User, Phone, Car as IdCard, Calendar, Stethoscope, FileText, Search, AlertCircle, CheckCircle } from 'lucide-react';

interface InjuredFormProps {
  injured?: Injured;
  guardians: Guardian[];
  onSubmit: (data: Omit<Injured, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const InjuredForm: React.FC<InjuredFormProps> = ({ 
  injured, 
  guardians, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phone: '',
    injuryDate: '',
    injuryType: '',
    notes: ''
  });

  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  // أنواع الإصابات المتاحة
  const injuryTypes = [
    'إصابة خطيرة',
    'إصابة متوسطة',
    'إصابة بسيطة',
    'إصابة بالرأس',
    'إصابة بالأطراف',
    'إصابة بالصدر',
    'إصابة بالبطن',
    'إصابة بالعمود الفقري',
    'إصابة بالعين',
    'حروق',
    'بتر',
    'إصابة أخرى'
  ];

  useEffect(() => {
    if (injured) {
      setFormData({
        name: injured.name,
        nationalId: injured.nationalId,
        phone: injured.phone,
        injuryDate: injured.injuryDate,
        injuryType: injured.injuryType,
        notes: injured.notes || ''
      });
    } else {
      // تعيين التاريخ الحالي كافتراضي للإصابات الجديدة
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, injuryDate: today }));
    }
  }, [injured]);

  // البحث في أولياء الأمور بالاسم أو رقم الهوية
  const filteredGuardians = guardians.filter(guardian => {
    if (!guardianSearchTerm.trim()) return false;
    
    const searchTerm = guardianSearchTerm.toLowerCase();
    return (
      guardian.name.toLowerCase().includes(searchTerm) ||
      guardian.nationalId.includes(searchTerm) ||
      guardian.phone.includes(searchTerm)
    );
  });

  // البحث بواسطة رقم الهوية
  const handleGuardianSearch = (searchValue: string) => {
    setGuardianSearchTerm(searchValue);
    setShowGuardianDropdown(true);

    // البحث التلقائي بواسطة رقم الهوية
    if (searchValue.length >= 3) {
      const foundGuardian = guardians.find(g => 
        g.nationalId.includes(searchValue) || 
        g.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (foundGuardian) {
        setSelectedGuardian(foundGuardian);
        setFormData(prev => ({ 
          ...prev, 
          name: foundGuardian.name,
          nationalId: foundGuardian.nationalId,
          phone: foundGuardian.phone
        }));
      }
    }
  };

  const handleGuardianSelect = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData(prev => ({ 
      ...prev, 
      name: guardian.name,
      nationalId: guardian.nationalId,
      phone: guardian.phone
    }));
    setGuardianSearchTerm(guardian.nationalId);
    setShowGuardianDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم الجريح');
      return;
    }

    if (!formData.nationalId.trim()) {
      alert('يرجى إدخال رقم هوية الجريح');
      return;
    }

    if (!formData.phone.trim()) {
      alert('يرجى إدخال رقم جوال الجريح');
      return;
    }

    if (!formData.injuryDate) {
      alert('يرجى إدخال تاريخ الإصابة');
      return;
    }

    if (!formData.injuryType) {
      alert('يرجى اختيار نوع الإصابة');
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
      {/* بيانات الجريح مع البحث الذكي */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <User className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الجريح
        </h3>
        
        <div className="space-y-6">
          {/* البحث الذكي */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البحث عن ولي أمر (اختياري - للتعبئة التلقائية)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={guardianSearchTerm}
                onChange={(e) => handleGuardianSearch(e.target.value)}
                onFocus={() => setShowGuardianDropdown(true)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ابحث بالاسم أو رقم الهوية..."
              />
            </div>

            {/* قائمة النتائج */}
            {showGuardianDropdown && guardianSearchTerm.trim() !== '' && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredGuardians.length > 0 ? (
                  filteredGuardians.map(guardian => (
                    <button
                      key={guardian.id}
                      type="button"
                      onClick={() => handleGuardianSelect(guardian)}
                      className="w-full text-right p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <User className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{guardian.name}</div>
                          <div className="text-sm text-gray-500 font-mono" dir="ltr">{guardian.nationalId}</div>
                          <div className="text-xs text-gray-400">
                            {guardian.phone} - {guardian.area?.name || 'غير محدد'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </div>

          {/* معلومات ولي الأمر المختار */}
          {selectedGuardian && (
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
                تم اختيار ولي الأمر
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">الاسم: </span>
                  <span className="text-blue-900 font-semibold">{selectedGuardian.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">رقم الهوية: </span>
                  <span className="text-blue-900 font-mono font-semibold">{selectedGuardian.nationalId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الهاتف: </span>
                  <span className="text-blue-900 font-mono font-semibold">{selectedGuardian.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المنطقة: </span>
                  <span className="text-blue-900 font-semibold">{selectedGuardian.area?.name || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الجنس: </span>
                  <span className="text-blue-900 font-semibold">{selectedGuardian.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">حالة الإقامة: </span>
                  <span className={`font-semibold ${
                    selectedGuardian.residenceStatus === 'displaced' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {selectedGuardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الجريح *
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
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم الجريح الكامل"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم هوية الجريح *
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
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رقم هوية الجريح"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الجوال *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل رقم جوال الجريح"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات الإصابة */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
          <Stethoscope className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الإصابة
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الإصابة *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="injuryDate"
                value={formData.injuryDate}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الإصابة *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Stethoscope className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="injuryType"
                value={formData.injuryType}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">اختر نوع الإصابة</option>
                {injuryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
            placeholder="أدخل أي ملاحظات إضافية حول الإصابة..."
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
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {injured ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};