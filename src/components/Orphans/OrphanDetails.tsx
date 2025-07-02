import React from 'react';
import { Orphan } from '../../types';
import { User, Phone, Car as IdCard, Calendar, UserRoundX, MapPin, GraduationCap, Heart, Users, Fuel as Mosque } from 'lucide-react';

interface OrphanDetailsProps {
  orphan: Orphan;
  onClose: () => void;
}

export const OrphanDetails: React.FC<OrphanDetailsProps> = ({ orphan, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHealthStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'جيدة': 'bg-green-100 text-green-800',
      'متوسطة': 'bg-yellow-100 text-yellow-800',
      'ضعيفة': 'bg-orange-100 text-orange-800',
      'سيئة': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEducationalStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'روضة': 'bg-pink-100 text-pink-800',
      'ابتدائي': 'bg-blue-100 text-blue-800',
      'إعدادي': 'bg-purple-100 text-purple-800',
      'ثانوي': 'bg-indigo-100 text-indigo-800',
      'جامعي': 'bg-green-100 text-green-800',
      'غير متعلم': 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* القسم الأول: بيانات اليتيم الأساسية */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
        <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
          <UserRoundX className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات اليتيم الأساسية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-amber-100 rounded-lg">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-700 mb-1">اسم اليتيم</p>
                <p className="text-xl font-bold text-amber-900">{orphan.name}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    orphan.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {orphan.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-amber-100 rounded-lg">
                <IdCard className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-700 mb-1">رقم هوية اليتيم</p>
                <p className="text-xl font-bold text-amber-900 font-mono" dir="ltr">{orphan.nationalId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات العمر والميلاد */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-amber-100 rounded-full">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-amber-700 mb-2">تاريخ الميلاد</p>
            <p className="text-2xl font-bold text-amber-900 mb-3">{formatDate(orphan.birthDate)}</p>
            <div className="text-sm text-gray-600">
              {new Date(orphan.birthDate).toLocaleDateString('ar-EG', { weekday: 'long' })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-amber-100 rounded-full">
                <UserRoundX className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-amber-700 mb-2">العمر الحالي</p>
            <p className="text-4xl font-bold text-amber-900 mb-3">{orphan.age}</p>
            <div className="text-sm text-gray-600">سنة</div>
          </div>
        </div>
      </div>

      {/* القسم الثاني: الحالة الصحية والتعليمية */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
          <GraduationCap className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          الحالة الصحية والتعليمية
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-blue-100 rounded-full">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700 mb-2">الحالة الصحية</p>
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getHealthStatusColor(orphan.healthStatus)}`}>
                {orphan.healthStatus}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-blue-100 rounded-full">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700 mb-2">المرحلة الدراسية</p>
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getEducationalStageColor(orphan.educationalStage)}`}>
                {orphan.educationalStage}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثالث: بيانات الشهيد */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center">
          <Mosque className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الشهيد/المتوفي
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-red-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-red-100 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 mb-1">اسم الشهيد/المتوفي</p>
                <p className="text-xl font-bold text-red-900">{orphan.martyrName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-red-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-red-100 rounded-lg">
                <IdCard className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 mb-1">رقم هوية الشهيد/المتوفي</p>
                <p className="text-xl font-bold text-red-900 font-mono" dir="ltr">{orphan.martyrNationalId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* تاريخ الاستشهاد */}
        <div className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-red-100 rounded-full">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-red-700 mb-2">تاريخ الاستشهاد/الوفاة</p>
            <p className="text-2xl font-bold text-red-900 mb-3">{formatDate(orphan.martyrdomDate)}</p>
            <div className="text-sm text-gray-600">
              {new Date(orphan.martyrdomDate).toLocaleDateString('ar-EG', { weekday: 'long' })}
            </div>
          </div>
        </div>
      </div>

      {/* القسم الرابع: بيانات الأخوة والوصي */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center">
          <Users className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الأخوة والوصي
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* عدد الأخوة الذكور */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-700 mb-2">عدد الأخوة الذكور</p>
            <p className="text-4xl font-bold text-blue-900">{orphan.maleSiblingsCount}</p>
          </div>

          {/* عدد الأخوة الإناث */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-pink-100 rounded-full">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-pink-700 mb-2">عدد الأخوة الإناث</p>
            <p className="text-4xl font-bold text-pink-900">{orphan.femaleSiblingsCount}</p>
          </div>

          {/* إجمالي الأخوة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-green-100 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-green-700 mb-2">إجمالي الأخوة</p>
            <p className="text-4xl font-bold text-green-900">{orphan.maleSiblingsCount + orphan.femaleSiblingsCount}</p>
          </div>
        </div>

        {/* بيانات الوصي */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 mb-1">اسم الوصي على الأيتام</p>
                <p className="text-xl font-bold text-green-900">{orphan.guardianName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 mb-1">صلة قرابة الوصي باليتيم</p>
                <p className="text-xl font-bold text-green-900">{orphan.guardianRelationship}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الخامس: بيانات الاتصال */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
        <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center">
          <Phone className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الاتصال
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-700 mb-1">العنوان</p>
                <p className="text-xl font-bold text-purple-900">{orphan.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-700 mb-1">رقم الجوال</p>
                <p className="text-xl font-bold text-purple-900 font-mono" dir="ltr">{orphan.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم السادس: ملاحظات */}
      {orphan.notes && (
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            ملاحظات
          </h3>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-lg text-gray-900 leading-relaxed">{orphan.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* زر الإغلاق */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};