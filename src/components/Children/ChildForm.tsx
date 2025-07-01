import React, { useState, useEffect } from 'react';
import { Child, Guardian } from '../../types';
import { Search, User, AlertCircle, CheckCircle } from 'lucide-react';

interface ChildFormProps {
  child?: Child;
  guardians: Guardian[];
  onSubmit: (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'age'>) => void;
  onCancel: () => void;
}

export const ChildForm: React.FC<ChildFormProps> = ({ 
  child, 
  guardians, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    birthDate: '',
    guardianId: 0
  });

  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<Guardian[]>([]);

  // فلترة أولياء الأمور الذين لديهم أبناء
  const guardiansWithChildren = guardians.filter(g => g.childrenCount > 0);

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name,
        nationalId: child.nationalId,
        birthDate: child.birthDate,
        guardianId: child.guardianId
      });
      
      const guardian = guardians.find(g => g.id === child.guardianId);
      setSelectedGuardian(guardian || null);
      if (guardian) {
        setGuardianSearchTerm(guardian.nationalId);
      }
    }
  }, [child, guardians]);

  // تحديث بيانات ولي الأمر عند اختيار ولي أمر جديد
  useEffect(() => {
    if (formData.guardianId) {
      const guardian = guardians.find(g => g.id === formData.guardianId);
      setSelectedGuardian(guardian || null);
    }
  }, [formData.guardianId, guardians]);

  // النظام الذكي لاقتراح أولياء الأمور بناءً على اسم الابن
  const getSmartSuggestions = (childName: string): Guardian[] => {
    if (!childName.trim()) return [];

    const childNameParts = childName.toLowerCase().trim().split(/\s+/);
    const suggestions: { guardian: Guardian; score: number }[] = [];

    guardiansWithChildren.forEach(guardian => {
      const guardianNameParts = guardian.name.toLowerCase().split(/\s+/);
      let score = 0;

      // البحث عن التطابق في الأسماء
      childNameParts.forEach(childPart => {
        guardianNameParts.forEach(guardianPart => {
          if (childPart === guardianPart) {
            score += 10; // تطابق كامل
          } else if (childPart.includes(guardianPart) || guardianPart.includes(childPart)) {
            score += 5; // تطابق جزئي
          }
        });
      });

      // إضافة نقاط إضافية للأنماط الشائعة
      // مثل: محمد عاطف سعيد مسمح -> عاطف سعيد محمد مسمح
      if (childNameParts.length >= 2 && guardianNameParts.length >= 2) {
        // تحقق من وجود اسم الأب في بداية اسم الابن
        if (guardianNameParts.some(part => childNameParts[1] === part)) {
          score += 15;
        }
        
        // تحقق من وجود اسم العائلة
        const lastChildName = childNameParts[childNameParts.length - 1];
        const lastGuardianName = guardianNameParts[guardianNameParts.length - 1];
        if (lastChildName === lastGuardianName) {
          score += 20;
        }
      }

      if (score > 0) {
        suggestions.push({ guardian, score });
      }
    });

    // ترتيب حسب النقاط
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // أفضل 5 اقتراحات
      .map(s => s.guardian);
  };

  // تحديث الاقتراحات الذكية عند تغيير اسم الابن
  useEffect(() => {
    if (formData.name) {
      const suggestions = getSmartSuggestions(formData.name);
      setSmartSuggestions(suggestions);
    } else {
      setSmartSuggestions([]);
    }
  }, [formData.name, guardiansWithChildren]);

  // البحث في أولياء الأمور بالاسم أو رقم الهوية
  const filteredGuardians = guardiansWithChildren.filter(guardian => {
    if (!guardianSearchTerm.trim()) return true;
    
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
      const foundGuardian = guardiansWithChildren.find(g => 
        g.nationalId.includes(searchValue) || 
        g.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (foundGuardian) {
        setSelectedGuardian(foundGuardian);
        setFormData(prev => ({ ...prev, guardianId: foundGuardian.id }));
      }
    }
  };

  const handleGuardianSelect = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData(prev => ({ ...prev, guardianId: guardian.id }));
    setGuardianSearchTerm(guardian.nationalId);
    setShowGuardianDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guardianId) {
      alert('يرجى اختيار ولي الأمر');
      return;
    }

    if (!formData.birthDate) {
      alert('يرجى إدخال تاريخ الميلاد');
      return;
    }

    const guardian = guardians.find(g => g.id === formData.guardianId);

    const childData = {
      ...formData,
      guardianName: guardian?.name,
      guardianNationalId: guardian?.nationalId,
      areaId: guardian?.areaId,
      areaName: guardian?.area?.name
    };

    onSubmit(childData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guardianId' ? parseInt(value) || 0 : value
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
      {/* بيانات الابن الأساسية */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">بيانات الابن الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الابن *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل اسم الابن الكامل"
            />
            
            {/* الاقتراحات الذكية */}
            {smartSuggestions.length > 0 && formData.name && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">اقتراحات ذكية لولي الأمر:</span>
                </div>
                <div className="space-y-1">
                  {smartSuggestions.slice(0, 3).map(guardian => (
                    <button
                      key={guardian.id}
                      type="button"
                      onClick={() => handleGuardianSelect(guardian)}
                      className="w-full text-left p-2 text-sm bg-white border border-green-200 rounded hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-green-900">{guardian.name}</div>
                      <div className="text-green-700 font-mono">{guardian.nationalId}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم هوية الابن *
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل رقم هوية الابن"
              dir="ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الميلاد *
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.birthDate && (
              <p className="text-sm text-blue-600 mt-1">
                العمر المحسوب: <span className="font-semibold">{currentAge} سنة</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* بيانات ولي الأمر مع البحث الذكي */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">بيانات ولي الأمر</h3>
        
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
            {showGuardianDropdown && (
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
                            {guardian.childrenCount} أبناء - {guardian.area?.name || 'غير محدد'}
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
                  <span className="font-medium text-gray-700">عدد الأبناء: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.childrenCount}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المنطقة: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.area?.name || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الهاتف: </span>
                  <span className="text-green-900 font-mono font-semibold">{selectedGuardian.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الجنس: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الحالة الاجتماعية: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.maritalStatus}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">حالة الإقامة: </span>
                  <span className={`font-semibold ${
                    selectedGuardian.residenceStatus === 'displaced' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {selectedGuardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المهنة: </span>
                  <span className="text-green-900 font-semibold">{selectedGuardian.currentJob || 'غير محدد'}</span>
                </div>
              </div>
            </div>
          )}

          {/* تحذير إذا لم يتم العثور على أولياء أمور */}
          {guardiansWithChildren.length === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  لا يوجد أولياء أمور لديهم أبناء في النظام
                </span>
              </div>
            </div>
          )}
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
          {child ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};