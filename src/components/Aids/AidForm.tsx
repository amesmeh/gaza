import React, { useState, useEffect } from 'react';
import { Aid, Guardian } from '../../types';
import { Search, User, AlertCircle, CheckCircle, Calendar, HandHeart } from 'lucide-react';

interface AidFormProps {
  aid?: Aid;
  guardians: Guardian[];
  onSubmit: (data: Omit<Aid, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  disableAreaSelect?: boolean;
  defaultAreaId?: number;
}

export const AidForm: React.FC<AidFormProps> = ({ 
  aid, 
  guardians, 
  onSubmit, 
  onCancel,
  disableAreaSelect = false,
  defaultAreaId
}) => {
  const [formData, setFormData] = useState({
    guardianNationalId: '',
    aidType: '',
    aidDate: '',
    notes: ''
  });

  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);

  // فلترة أولياء الأمور حسب المنطقة إذا كان المستخدم مندوب منطقة
  const filteredGuardiansByArea = defaultAreaId 
    ? guardians.filter(guardian => guardian.areaId === defaultAreaId)
    : guardians;

  useEffect(() => {
    if (aid) {
      setFormData({
        guardianNationalId: aid.guardianNationalId,
        aidType: aid.aidType,
        aidDate: aid.aidDate,
        notes: aid.notes || ''
      });
      
      const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
      setSelectedGuardian(guardian || null);
      if (guardian) {
        setGuardianSearchTerm(guardian.nationalId);
      }
    } else {
      // تعيين التاريخ الحالي كافتراضي للمساعدات الجديدة
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, aidDate: today }));
    }
  }, [aid, guardians]);

  // البحث في أولياء الأمور بالاسم أو رقم الهوية
  const filteredGuardians = filteredGuardiansByArea.filter(guardian => {
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
      const foundGuardian = filteredGuardiansByArea.find(g => 
        g.nationalId.includes(searchValue) || 
        g.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      if (foundGuardian) {
        setSelectedGuardian(foundGuardian);
        setFormData(prev => ({ ...prev, guardianNationalId: foundGuardian.nationalId }));
      }
    }
  };

  const handleGuardianSelect = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData(prev => ({ ...prev, guardianNationalId: guardian.nationalId }));
    setGuardianSearchTerm(guardian.nationalId);
    setShowGuardianDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guardianNationalId) {
      alert('يرجى اختيار ولي الأمر');
      return;
    }

    if (!formData.aidType) {
      alert('يرجى إدخال نوع المساعدة');
      return;
    }

    if (!formData.aidDate) {
      alert('يرجى إدخال تاريخ المساعدة');
      return;
    }

    const guardian = guardians.find(g => g.nationalId === formData.guardianNationalId);

    const aidData = {
      ...formData,
      guardianName: guardian?.name,
      guardianPhone: guardian?.phone,
      areaId: guardian?.areaId,
      areaName: guardian?.area?.name
    };

    onSubmit(aidData);
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
      {/* بيانات ولي الأمر مع البحث الذكي */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
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
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                ولي الأمر المختار
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
                  <span className="font-medium text-gray-700">رقم الهاتف: </span>
                  <span className="text-blue-900 font-mono font-semibold">{selectedGuardian.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المنطقة: </span>
                  <span className="text-blue-900 font-semibold">{selectedGuardian.area?.name || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">عدد أفراد العائلة: </span>
                  <span className="text-blue-900 font-semibold">{selectedGuardian.familyMembersCount}</span>
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
        </div>
      </div>

      {/* بيانات المساعدة */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
          <HandHeart className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات المساعدة
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع المساعدة *
            </label>
            <input
              type="text"
              name="aidType"
              value={formData.aidType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="أدخل نوع المساعدة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ المساعدة *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="aidDate"
                value={formData.aidDate}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="أدخل أي ملاحظات إضافية حول المساعدة..."
            />
          </div>
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
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
        >
          {aid ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};