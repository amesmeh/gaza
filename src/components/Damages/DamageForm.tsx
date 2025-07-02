import React, { useState, useEffect } from 'react';
import { Damage, Guardian } from '../../types';
import { User, Phone, Car as IdCard, Building, FileText, Search, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

interface DamageFormProps {
  damage?: Damage;
  guardians: Guardian[];
  onSubmit: (data: Omit<Damage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const DamageForm: React.FC<DamageFormProps> = ({ 
  damage, 
  guardians, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    guardianNationalId: '',
    guardianName: '',
    guardianPhone: '',
    areaId: 0,
    areaName: '',
    damageType: 'كلي' as 'كلي' | 'جزئي',
    notes: ''
  });

  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  useEffect(() => {
    if (damage) {
      setFormData({
        guardianNationalId: damage.guardianNationalId,
        guardianName: damage.guardianName || '',
        guardianPhone: damage.guardianPhone || '',
        areaId: damage.areaId || 0,
        areaName: damage.areaName || '',
        damageType: damage.damageType,
        notes: damage.notes || ''
      });
      
      const guardian = guardians.find(g => g.nationalId === damage.guardianNationalId);
      setSelectedGuardian(guardian || null);
      if (guardian) {
        setGuardianSearchTerm(guardian.nationalId);
      }
    }
  }, [damage, guardians]);

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
          guardianPhone: foundGuardian.phone,
          areaId: foundGuardian.areaId,
          areaName: foundGuardian.area?.name || ''
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
      guardianPhone: guardian.phone,
      areaId: guardian.areaId,
      areaName: guardian.area?.name || ''
    }));
    setGuardianSearchTerm(guardian.nationalId);
    setShowGuardianDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guardianNationalId.trim()) {
      alert('يرجى إدخال رقم هوية ولي الأمر');
      return;
    }

    if (!formData.damageType) {
      alert('يرجى اختيار نوع الضرر');
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
                  <span className="font-medium text-gray-700">الهاتف: </span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الجوال
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="يتم تعبئته تلقائياً"
                  dir="ltr"
                  readOnly={!!selectedGuardian}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنطقة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="areaName"
                  value={formData.areaName}
                  onChange={handleChange}
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  placeholder="يتم تعبئته تلقائياً"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بيانات الضرر */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
          <Building className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الضرر
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الضرر *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="damageType"
                value={formData.damageType}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="كلي">كلي</option>
                <option value="جزئي">جزئي</option>
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
            placeholder="أدخل أي ملاحظات إضافية حول الضرر..."
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
          {damage ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};