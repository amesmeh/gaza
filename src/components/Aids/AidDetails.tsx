import React, { useMemo } from "react";
import { X, User, Phone, MapPin, Calendar, Package, ArrowLeft } from "lucide-react";
import { Aid, Guardian } from "../../types";

interface AidDetailsProps {
  aid: Aid;
  guardians: Guardian[];
  onClose: () => void;
  allAids?: Aid[]; // إضافة جميع المساعدات
}

const AidDetails: React.FC<AidDetailsProps> = ({ aid, guardians, onClose, allAids = [] }) => {
  const guardian = useMemo(() => {
    return guardians.find(g => g.nationalId === aid.guardianNationalId);
  }, [aid.guardianNationalId, guardians]);

  // جلب المساعدات الحقيقية للمستلم
  const realAids = useMemo(() => {
    return allAids.filter(a => a.guardianNationalId === aid.guardianNationalId);
  }, [aid.guardianNationalId, allAids]);

  const totalAids = realAids.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* شريط التنقل */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="رجوع"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">تفاصيل المساعدة</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* البيانات الأساسية للمستلم */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <User className="h-5 w-5" />
                <span>البيانات الأساسية للمستلم</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>اسم ولي الأمر:</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {guardian?.name || aid.guardianName || "غير محدد"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>رقم الهوية:</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">
                    {aid.guardianNationalId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>رقم الجوال:</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {guardian?.phone || aid.phone || "غير محدد"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>المنطقة:</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {guardian?.areaName || "غير محدد"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>عدد مرات الاستفادة:</span>
                  </div>
                  <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    {totalAids} مرات
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* جدول المساعدات */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2 rtl:space-x-reverse">
                <Package className="h-5 w-5" />
                <span>المساعدات المستلمة</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                      نوع المساعدة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                      تاريخ المساعدة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {realAids.length > 0 ? (
                    realAids.map((aidItem, index) => (
                      <tr key={aidItem.id} className={aidItem.id === aid.id ? "bg-blue-50" : "hover:bg-gray-50"}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border border-gray-200">
                          {aidItem.aidType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 border border-gray-200">
                          {aidItem.aidDate}
                        </td>
                        <td className="px-6 py-4 text-sm border border-gray-200">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            aidItem.id === aid.id 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {aidItem.id === aid.id ? "مساعدة حالية" : "مساعدة سابقة"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 border border-gray-200">
                        لا توجد مساعدات أخرى مسجلة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AidDetails;