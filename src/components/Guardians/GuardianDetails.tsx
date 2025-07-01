import React, { useMemo } from 'react';
import { Guardian, Wife, Child } from '../../types';
import { User, Phone, Car as IdCard, Calendar, Users, MapPin, Home, Briefcase, Heart, Baby, Edit, Trash2, Plus, Eye, X } from 'lucide-react';

interface GuardianDetailsProps {
  guardian: Guardian;
  wives?: Wife[];
  children?: Child[];
  onClose: () => void;
  onEditWife?: (wife: Wife) => void;
  onDeleteWife?: (wife: Wife) => void;
  onAddWife?: () => void;
  onEditChild?: (child: Child) => void;
  onDeleteChild?: (child: Child) => void;
  onAddChild?: () => void;
  onViewChild?: (child: Child) => void;
}

export const GuardianDetails: React.FC<GuardianDetailsProps> = ({ 
  guardian, 
  wives = [], 
  children = [], 
  onClose,
  onEditWife,
  onDeleteWife,
  onAddWife,
  onEditChild,
  onDeleteChild,
  onAddChild,
  onViewChild
}) => {
  // فلترة الزوجات والأبناء الخاصين بولي الأمر
  const guardianWives = useMemo(() => 
    wives.filter(wife => wife.husbandId === guardian.id), 
    [wives, guardian.id]
  );

  const guardianChildren = useMemo(() => 
    children.filter(child => child.guardianId === guardian.id), 
    [children, guardian.id]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeColor = (age: number) => {
    if (age < 5) return 'bg-green-100 text-green-800';
    if (age < 12) return 'bg-blue-100 text-blue-800';
    if (age < 18) return 'bg-orange-100 text-orange-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="space-y-6">
      {/* بطاقة المعلومات الأساسية */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{guardian.name}</h2>
                <p className="text-blue-100 text-sm">ولي أمر - {guardian.nationalId}</p>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-90">حالة الإقامة</div>
              <div className="font-semibold">{guardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
              <div className="mb-2 text-blue-700 text-xs font-medium">الاسم الكامل</div>
              <div className="text-lg text-gray-900 font-semibold">{guardian.name}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
              <div className="mb-2 text-green-700 text-xs font-medium">رقم الهوية</div>
              <div className="text-lg text-gray-900 font-mono font-semibold">{guardian.nationalId}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-lg p-4">
              <div className="mb-2 text-purple-700 text-xs font-medium">رقم الجوال</div>
              <div className="text-lg text-gray-900 font-mono font-semibold">{guardian.phone}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-4">
              <div className="mb-2 text-orange-700 text-xs font-medium">الجنس</div>
              <div className="text-lg text-gray-900 font-semibold">{guardian.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-lg p-4">
              <div className="mb-2 text-teal-700 text-xs font-medium">الحالة الاجتماعية</div>
              <div className="text-lg text-gray-900 font-semibold">{guardian.maritalStatus}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-4">
              <div className="mb-2 text-pink-700 text-xs font-medium">الوظيفة الحالية</div>
              <div className="text-lg text-gray-900 font-semibold">{guardian.currentJob || 'غير محدد'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة الإحصائيات العائلية */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            الإحصائيات العائلية
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{guardian.childrenCount}</span>
              </div>
              <div className="text-sm text-gray-600">عدد الأبناء</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{guardian.wivesCount}</span>
              </div>
              <div className="text-sm text-gray-600">عدد الزوجات</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{guardian.familyMembersCount}</span>
              </div>
              <div className="text-sm text-gray-600">إجمالي أفراد العائلة</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-600">المنطقة</div>
              <div className="text-sm font-medium text-gray-900">{guardian.area?.name || 'غير محدد'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة العنوان */}
      {guardian.displacementAddress && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              العنوان
            </h3>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-4">
              <div className="text-gray-900 font-medium">{guardian.displacementAddress}</div>
            </div>
          </div>
        </div>
      )}

      {/* الزوجات */}
      {guardianWives.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-rose-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              الزوجات ({guardianWives.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
                    <th className="text-right py-3 px-4 font-semibold text-pink-800 text-sm">اسم الزوجة</th>
                    <th className="text-right py-3 px-4 font-semibold text-pink-800 text-sm">رقم هوية الزوجة</th>
                  </tr>
                </thead>
                <tbody>
                  {guardianWives.map((wife, index) => (
                    <tr 
                      key={wife.id} 
                      className={`border-b border-gray-100 hover:bg-pink-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">{wife.name}</td>
                      <td className="py-3 px-4 text-gray-700 font-mono text-sm">{wife.nationalId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* الأبناء */}
      {guardianChildren.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              الأبناء ({guardianChildren.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                    <th className="text-right py-3 px-4 font-semibold text-green-800 text-sm">اسم الابن</th>
                    <th className="text-right py-3 px-4 font-semibold text-green-800 text-sm">رقم هوية الابن</th>
                    <th className="text-right py-3 px-4 font-semibold text-green-800 text-sm">تاريخ ميلاد الابن</th>
                  </tr>
                </thead>
                <tbody>
                  {guardianChildren.map((child, index) => (
                    <tr 
                      key={child.id} 
                      className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">{child.name}</td>
                      <td className="py-3 px-4 text-gray-700 font-mono text-sm">{child.nationalId}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">
                        {child.birthDate ? formatDate(child.birthDate) : 'غير محدد'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};