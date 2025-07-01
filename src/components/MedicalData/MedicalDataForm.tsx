import React, { useState, useEffect } from 'react';
import { MedicalData, Guardian } from '../../types';
import { User, Phone, Car as IdCard, Building, FileText, Search, AlertCircle, CheckCircle } from 'lucide-react';

interface MedicalDataFormProps {
  medicalData?: MedicalData;
  guardians: Guardian[];
  onSubmit: (data: Omit<MedicalData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const MedicalDataForm: React.FC<MedicalDataFormProps> = ({ 
  medicalData, 
  guardians, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientNationalId: '',
    guardianNationalId: '',
    guardianName: '',
    diseaseType: '',
    phone: '',
    notes: ''
  });

  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  // أنواع الأمراض المتاحة
  const diseaseTypes = [
    'مرض مزمن',
    'مرض قلب',
    'مرض الربو',
    'مرض الصرع',
    'مرض السكري',
    'مرض الكلى',
    'مرض الضغط',
    'مرض الغدة الدرقية',
    'مرض الكبد',
    'مرض السرطان',
    'مرض الجهاز الهضمي',
    'مرض الجهاز التنفسي',
    'مرض العظام',
    'مرض العيون',
    'مرض الأعصاب',
    'مرض نفسي',
    'مرض جلدي',
    'مرض آخر'
  ];

  useEffect(() => {
    if (medicalData) {
      setFormData({
        patientName: medicalData.patientName,
        patientNationalId: medicalData.patientNationalId,
        guardianNationalId: medicalData.guardianNationalId,
        guardianName: medicalData.guardianName || '',
        diseaseType: medicalData.diseaseType,
        phone: medicalData.phone || '',
        notes: medicalData.notes || ''
      });
      
      const guardian = guardians.find(g => g.nationalId === medicalData.guardianNationalId);
      setSelectedGuardian(guardian || null);
      if (guardian) {
        setGuardianSearchTerm(guardian.nationalId);
      }
    }
  }, [medicalData, guardians]);

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
          guardianNationalId: foundGuardian.nationalId,
          guardianName: foundGuardian.name,
          phone: foundGuardian.phone
        }));
      }
    }
  };

  const handleGuardianSelect = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData(prev => ({ 
      ...prev, 
      guardianNationalId: guardian.nationalId,
      guardianName: guardian.name,
      phone: guardian.phone
    }));
    setGuardianSearchTerm(guardian.nationalId);
    setShowGuardianDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName.trim()) {
      alert('يرجى إدخال اسم المريض');
      return;
    }

    if (!formData.patientNationalId.trim()) {
      alert('يرجى إدخال رقم هوية المريض');
      return;
    }

    if (!formData.guardianNationalId.trim()) {
      alert('يرجى إدخال رقم هوية ولي الأمر');
      return;
    }

    if (!formData.diseaseType) {
      alert('يرجى اختيار نوع المرض');
      return;
    }

    if (!formData.phone.trim()) {
      alert('يرجى إدخال رقم الجوال');
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
      {/* بيانات المريض */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <User className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات المريض
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المريض *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسم المريض الكامل"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية المريض *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="patientNationalId"
                value={formData.patientNationalId}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل رقم هوية المريض"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* بيانات ولي الأمر مع البحث الذكي */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
          <User className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات ولي الأمر
        </h3>
        
        <div className="space-y-6">
          {/* البحث الذكي */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البحث عن ولي الأمر (بالاسم أو رقم الهوية) *
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
                ولي الأمر المختار
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">الاسم: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">رقم الهوية: </span>
                  <span className="text-green-900 font-mono font-semibold">{selectedGuardian.nationalId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الهاتف: </span>
                  <span className="text-green-900 font-mono font-semibold">{selectedGuardian.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المنطقة: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.area?.name || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">عدد أفراد العائلة: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.familyMembersCount}</span>
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
                رقم هوية ولي الأمر *
              </label>
              <input
                type="text"
                name="guardianNationalId"
                value={formData.guardianNationalId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="يتم تعبئته تلقائياً عند اختيار ولي الأمر"
                dir="ltr"
                readOnly={!!selectedGuardian}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم ولي الأمر
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="يتم تعبئته تلقائياً"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* بيانات المرض */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
          <Building className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات المرض
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع المرض *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="diseaseType"
                value={formData.diseaseType}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">اختر نوع المرض</option>
                {diseaseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="أدخل رقم جوال المريض أو ولي الأمر"
                dir="ltr"
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
            placeholder="أدخل أي ملاحظات إضافية حول المرض أو المريض..."
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
          className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-colors"
        >
          {medicalData ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};