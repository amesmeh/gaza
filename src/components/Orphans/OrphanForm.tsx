import React, { useState, useEffect } from 'react';
import { Orphan, Martyr } from '../../types';
import { User, Phone, Car as IdCard, Calendar, UserRoundX, MapPin, GraduationCap, Heart, Users, Search, AlertCircle, CheckCircle, Fuel as Mosque } from 'lucide-react';

interface OrphanFormProps {
  orphan?: Orphan;
  martyrs: Martyr[];
  onSubmit: (data: Omit<Orphan, 'id' | 'createdAt' | 'updatedAt' | 'age'>) => void;
  onCancel: () => void;
}

export const OrphanForm: React.FC<OrphanFormProps> = ({ 
  orphan, 
  martyrs, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    healthStatus: '',
    educationalStage: '',
    martyrNationalId: '',
    martyrName: '',
    martyrdomDate: '',
    maleSiblingsCount: 0,
    femaleSiblingsCount: 0,
    guardianName: '',
    guardianRelationship: '',
    address: '',
    phone: '',
    notes: ''
  });

  const [martyrSearchTerm, setMartyrSearchTerm] = useState('');
  const [showMartyrDropdown, setShowMartyrDropdown] = useState(false);
  const [selectedMartyr, setSelectedMartyr] = useState<Martyr | null>(null);

  // الحالات الصحية المتاحة
  const healthStatuses = [
    'جيدة',
    'متوسطة',
    'ضعيفة',
    'سيئة'
  ];

  // المراحل الدراسية المتاحة
  const educationalStages = [
    'روضة',
    'ابتدائي',
    'إعدادي',
    'ثانوي',
    'جامعي',
    'غير متعلم'
  ];

  // صلات القرابة المتاحة
  const guardianRelationships = [
    'أب',
    'أم',
    'جد',
    'جدة',
    'عم',
    'عمة',
    'خال',
    'خالة',
    'أخ',
    'أخت',
    'قريب',
    'وصي قانوني',
    'أخرى'
  ];

  useEffect(() => {
    if (orphan) {
      setFormData({
        name: orphan.name,
        nationalId: orphan.nationalId,
        gender: orphan.gender,
        birthDate: orphan.birthDate,
        healthStatus: orphan.healthStatus,
        educationalStage: orphan.educationalStage,
        martyrNationalId: orphan.martyrNationalId,
        martyrName: orphan.martyrName,
        martyrdomDate: orphan.martyrdomDate,
        maleSiblingsCount: orphan.maleSiblingsCount,
        femaleSiblingsCount: orphan.femaleSiblingsCount,
        guardianName: orphan.guardianName,
        guardianRelationship: orphan.guardianRelationship,
        address: orphan.address,
        phone: orphan.phone,
        notes: orphan.notes || ''
      });
      
      const martyr = martyrs.find(m => m.nationalId === orphan.martyrNationalId);
      setSelectedMartyr(martyr || null);
      if (martyr) {
        setMartyrSearchTerm(martyr.nationalId);
      }
    } else {
      // تعيين التاريخ الحالي كافتراضي لتاريخ الميلاد
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, birthDate: today }));
    }
  }, [orphan, martyrs]);

  // البحث في الشهداء بالاسم أو رقم الهوية
  const filteredMartyrs = martyrs.filter(martyr => {
    if (!martyrSearchTerm.trim()) return false;
    
    const searchTerm = martyrSearchTerm.toLowerCase();
    return (
      martyr.name.toLowerCase().includes(searchTerm) ||
      martyr.nationalId.includes(searchTerm)
    );
  });

  // البحث بواسطة رقم الهوية
  const handleMartyrSearch = (searchValue: string) => {
    setMartyrSearchTerm(searchValue);
    setShowMartyrDropdown(true);

    // البحث التلقائي بواسطة رقم الهوية
    if (searchValue.length >= 3) {
      const foundMartyr = martyrs.find(m => 
        m.nationalId.includes(searchValue) || 
        m.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (foundMartyr) {
        setSelectedMartyr(foundMartyr);
        setFormData(prev => ({ 
          ...prev, 
          martyrNationalId: foundMartyr.nationalId,
          martyrName: foundMartyr.name,
          martyrdomDate: foundMartyr.martyrdomDate
        }));
      }
    }
  };

  const handleMartyrSelect = (martyr: Martyr) => {
    setSelectedMartyr(martyr);
    setFormData(prev => ({ 
      ...prev, 
      martyrNationalId: martyr.nationalId,
      martyrName: martyr.name,
      martyrdomDate: martyr.martyrdomDate
    }));
    setMartyrSearchTerm(martyr.nationalId);
    setShowMartyrDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم اليتيم');
      return;
    }

    if (!formData.nationalId.trim()) {
      alert('يرجى إدخال رقم هوية اليتيم');
      return;
    }

    if (!formData.birthDate) {
      alert('يرجى إدخال تاريخ الميلاد');
      return;
    }

    if (!formData.healthStatus) {
      alert('يرجى اختيار الحالة الصحية');
      return;
    }

    if (!formData.educationalStage) {
      alert('يرجى اختيار المرحلة الدراسية');
      return;
    }

    if (!formData.martyrNationalId.trim()) {
      alert('يرجى إدخال رقم هوية الشهيد/المتوفي');
      return;
    }

    if (!formData.martyrName.trim()) {
      alert('يرجى إدخال اسم الشهيد/المتوفي');
      return;
    }

    if (!formData.guardianName.trim()) {
      alert('يرجى إدخال اسم الوصي');
      return;
    }

    if (!formData.guardianRelationship) {
      alert('يرجى اختيار صلة قرابة الوصي');
      return;
    }

    if (!formData.address.trim()) {
      alert('يرجى إدخال العنوان');
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
      [name]: name === 'maleSiblingsCount' || name === 'femaleSiblingsCount' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  // حساب العمر المتوقع من تاريخ الميلاد
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const currentAge = calculateAge(formData.birthDate);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* بيانات اليتيم الأساسية */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
          <UserRoundX className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات اليتيم الأساسية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم اليتيم *
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="أدخل اسم اليتيم الكامل"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية اليتيم *
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="أدخل رقم هوية اليتيم"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الجنس *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الميلاد *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            {formData.birthDate && (
              <p className="text-sm text-amber-600 mt-1">
                العمر المحسوب: <span className="font-semibold">{currentAge} سنة</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* الحالة الصحية والتعليمية */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          الحالة الصحية والتعليمية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة الصحية *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Heart className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">اختر الحالة الصحية</option>
                {healthStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المرحلة الدراسية *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="educationalStage"
                value={formData.educationalStage}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">اختر المرحلة الدراسية</option>
                {educationalStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات الشهيد/المتوفي مع البحث الذكي */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
          <Mosque className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الشهيد/المتوفي
        </h3>
        
        <div className="space-y-6">
          {/* البحث الذكي */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البحث عن الشهيد (بالاسم أو رقم الهوية)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={martyrSearchTerm}
                onChange={(e) => handleMartyrSearch(e.target.value)}
                onFocus={() => setShowMartyrDropdown(true)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="ابحث بالاسم أو رقم الهوية..."
              />
            </div>

            {/* قائمة النتائج */}
            {showMartyrDropdown && martyrSearchTerm.trim() !== '' && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredMartyrs.length > 0 ? (
                  filteredMartyrs.map(martyr => (
                    <button
                      key={martyr.id}
                      type="button"
                      onClick={() => handleMartyrSelect(martyr)}
                      className="w-full text-right p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Mosque className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{martyr.name}</div>
                          <div className="text-sm text-gray-500 font-mono" dir="ltr">{martyr.nationalId}</div>
                          <div className="text-xs text-gray-400">
                            تاريخ الاستشهاد: {new Date(martyr.martyrdomDate).toLocaleDateString('ar-EG')}
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

          {/* معلومات الشهيد المختار */}
          {selectedMartyr && (
            <div className="p-4 bg-white rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
                الشهيد المختار
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">الاسم: </span>
                  <span className="text-red-900 font-semibold">{selectedMartyr.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">رقم الهوية: </span>
                  <span className="text-red-900 font-mono font-semibold">{selectedMartyr.nationalId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">تاريخ الاستشهاد: </span>
                  <span className="text-red-900 font-semibold">{new Date(selectedMartyr.martyrdomDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">اسم الوكيل: </span>
                  <span className="text-red-900 font-semibold">{selectedMartyr.agentName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">رقم هاتف الوكيل: </span>
                  <span className="text-red-900 font-mono font-semibold">{selectedMartyr.agentPhone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">صلة القرابة: </span>
                  <span className="text-red-900 font-semibold">{selectedMartyr.relationshipToMartyr}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم هوية الشهيد/المتوفي *
              </label>
              <input
                type="text"
                name="martyrNationalId"
                value={formData.martyrNationalId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="يتم تعبئته تلقائياً عند اختيار الشهيد"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشهيد/المتوفي *
              </label>
              <input
                type="text"
                name="martyrName"
                value={formData.martyrName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="يتم تعبئته تلقائياً عند اختيار الشهيد"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الاستشهاد/الوفاة *
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
      </div>

      {/* بيانات الأخوة والوصي */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
          <Users className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الأخوة والوصي
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الأخوة الذكور *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="maleSiblingsCount"
                value={formData.maleSiblingsCount}
                onChange={handleChange}
                min="0"
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الأخوة الإناث *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="femaleSiblingsCount"
                value={formData.femaleSiblingsCount}
                onChange={handleChange}
                min="0"
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الوصي على الأيتام *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="أدخل اسم الوصي"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صلة قرابة الوصي باليتيم *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Heart className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="guardianRelationship"
                value={formData.guardianRelationship}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">اختر صلة القرابة</option>
                {guardianRelationships.map(relationship => (
                  <option key={relationship} value={relationship}>{relationship}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات الاتصال */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
          <Phone className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الاتصال
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="أدخل العنوان التفصيلي"
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="أدخل رقم الجوال"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* الملاحظات */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          ملاحظات
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            placeholder="أدخل أي ملاحظات إضافية حول اليتيم..."
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
          className="px-6 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 transition-colors"
        >
          {orphan ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};