import React from 'react';
import { Child } from '../../types';
import { User, Calendar, Baby, MapPin, Home, Car as IdCard } from 'lucide-react';

interface ChildDetailsProps {
  child: Child;
  onClose: () => void;
}

export const ChildDetails: React.FC<ChildDetailsProps> = ({ child, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeCategory = (age: number) => {
    if (age < 5) return { label: 'ابن صغير', color: 'bg-green-100 text-green-800' };
    if (age < 12) return { label: 'ابن', color: 'bg-blue-100 text-blue-800' };
    if (age < 18) return { label: 'مراهق', color: 'bg-orange-100 text-orange-800' };
    return { label: 'شاب', color: 'bg-purple-100 text-purple-800' };
  };

  const ageCategory = getAgeCategory(child.age);

  return (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center border-b pb-3">بيانات الطفل</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">الاسم</div>
          <div className="text-base text-gray-900 font-medium">{child.name}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">رقم الهوية</div>
          <div className="text-base text-gray-900 font-mono">{child.nationalId}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">الجنس</div>
          <div className="text-base text-gray-900">{child.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">تاريخ الميلاد</div>
          <div className="text-base text-gray-900">{formatDate(child.birthDate)}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">العمر</div>
          <div className="text-base text-gray-900">{child.age} سنة</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">اسم ولي الأمر</div>
          <div className="text-base text-gray-900">{child.guardianName || '-'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">رقم هوية ولي الأمر</div>
          <div className="text-base text-gray-900 font-mono">{child.guardianNationalId}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">اسم الأم</div>
          <div className="text-base text-gray-900">{child.motherName || '-'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">رقم هوية الأم</div>
          <div className="text-base text-gray-900 font-mono">{child.motherNationalId || '-'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">حالة الإقامة</div>
          <div className="text-base text-gray-900">{child.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">الحي</div>
          <div className="text-base text-gray-900">{child.area?.name || '-'}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-gray-600 text-xs">العنوان</div>
          <div className="text-base text-gray-900">{child.displacementAddress || '-'}</div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button onClick={onClose} className="px-5 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition">إغلاق</button>
      </div>
    </div>
  );
};