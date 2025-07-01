import React from 'react';
import { Area } from '../../types';
import { User, Phone, Car as IdCard, Calendar, Users, MapPin, X } from 'lucide-react';

interface AreaDetailsProps {
  area: Area;
  onClose: () => void;
}

export const AreaDetails: React.FC<AreaDetailsProps> = ({ area, onClose }) => {
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">تفاصيل المنطقة</h2>
            <p className="text-gray-600">معلومات شاملة عن المنطقة ومندوبها</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            المعلومات الأساسية
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-1">اسم المنطقة</p>
                  <p className="text-xl font-bold text-blue-900">{area.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-lg shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-700 mb-1">اسم المندوب</p>
                  <p className="text-xl font-bold text-emerald-900">{area.representativeName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            معلومات الاتصال
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg shadow-sm">
                  <IdCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-700 mb-1">رقم هوية المندوب</p>
                  <p className="text-xl font-bold text-purple-900 font-mono" dir="ltr">{area.representativeId}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg shadow-sm">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-700 mb-1">رقم الهاتف</p>
                  <p className="text-xl font-bold text-orange-900 font-mono" dir="ltr">{area.representativePhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
            الإحصائيات
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-lg shadow-sm">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-700 mb-1">عدد أولياء الأمور</p>
                  <p className="text-3xl font-bold text-indigo-900">{area.guardiansCount || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-500 rounded-lg shadow-sm">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">تاريخ الإنشاء</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Date(area.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};