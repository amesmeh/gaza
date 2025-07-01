import React from 'react';
import { Injured } from '../../types';
import { User, Phone, Car as IdCard, Calendar, FileText, Stethoscope } from 'lucide-react';

interface InjuredDetailsProps {
  injured: Injured;
  onClose: () => void;
}

export const InjuredDetails: React.FC<InjuredDetailsProps> = ({ injured, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInjuryTypeColor = (injuryType: string) => {
    const colors: { [key: string]: string } = {
      'إصابة خطيرة': 'bg-red-100 text-red-800',
      'إصابة متوسطة': 'bg-orange-100 text-orange-800',
      'إصابة بسيطة': 'bg-green-100 text-green-800',
      'إصابة بالرأس': 'bg-purple-100 text-purple-800',
      'إصابة بالأطراف': 'bg-blue-100 text-blue-800',
      'إصابة بالصدر': 'bg-indigo-100 text-indigo-800',
      'إصابة بالبطن': 'bg-yellow-100 text-yellow-800',
      'إصابة بالعمود الفقري': 'bg-pink-100 text-pink-800',
      'إصابة بالعين': 'bg-cyan-100 text-cyan-800',
      'حروق': 'bg-amber-100 text-amber-800',
      'بتر': 'bg-rose-100 text-rose-800'
    };
    return colors[injuryType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* القسم الأول: بيانات الجريح */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
          <User className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الجريح
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700 mb-1">اسم الجريح</p>
                <p className="text-xl font-bold text-blue-900">{injured.name}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Stethoscope className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0" />
                    جريح
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IdCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-700 mb-1">رقم هوية الجريح</p>
                <p className="text-xl font-bold text-purple-900 font-mono" dir="ltr">{injured.nationalId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* رقم الجوال */}
        <div className="mt-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-700 mb-1">رقم الجوال</p>
                <p className="text-xl font-bold text-orange-900 font-mono" dir="ltr">{injured.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثاني: بيانات الإصابة */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center">
          <Stethoscope className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          بيانات الإصابة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* تاريخ الإصابة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-red-100 rounded-full">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-red-700 mb-2">تاريخ الإصابة</p>
            <p className="text-2xl font-bold text-red-900 mb-3">{formatDate(injured.injuryDate)}</p>
            <div className="text-sm text-gray-600">
              {new Date(injured.injuryDate).toLocaleDateString('ar-EG', { weekday: 'long' })}
            </div>
          </div>

          {/* نوع الإصابة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-red-100 rounded-full">
                <Stethoscope className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-red-700 mb-2">نوع الإصابة</p>
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getInjuryTypeColor(injured.injuryType)}`}>
                {injured.injuryType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثالث: الملاحظات */}
      {injured.notes && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
          <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            الملاحظات
          </h3>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-amber-100 rounded-lg">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-amber-900 leading-relaxed">{injured.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* القسم الرابع: معلومات التسجيل */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          معلومات التسجيل
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(injured.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">آخر تحديث</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(injured.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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