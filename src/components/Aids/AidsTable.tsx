import React from 'react';
import { Edit, Trash2, Eye, HandHeart, User, Calendar, Phone, MapPin } from 'lucide-react';
import { Aid, Guardian } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface AidsTableProps {
  aids: Aid[];
  guardians?: Guardian[];
  onView: (aid: Aid) => void;
  onEdit: (aid: Aid) => void;
  onDelete: (aid: Aid) => void;
}

export const AidsTable: React.FC<AidsTableProps> = ({ 
  aids, 
  guardians = [],
  onView, 
  onEdit, 
  onDelete
}) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: aids, itemsPerPage: 25 });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const getAidTypeColor = (aidType: string) => {
    if (aidType.includes('غذائية')) return 'bg-green-100 text-green-800';
    if (aidType.includes('طبية')) return 'bg-red-100 text-red-800';
    if (aidType.includes('نقدية')) return 'bg-blue-100 text-blue-800';
    if (aidType.includes('تعليمية')) return 'bg-purple-100 text-purple-800';
    if (aidType.includes('إيوائية')) return 'bg-orange-100 text-orange-800';
    if (aidType.includes('ملابس')) return 'bg-pink-100 text-pink-800';
    if (aidType.includes('منزلية')) return 'bg-indigo-100 text-indigo-800';
    if (aidType.includes('وقود')) return 'bg-yellow-100 text-yellow-800';
    if (aidType.includes('مواصلات')) return 'bg-cyan-100 text-cyan-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getAreaName = (aid: Aid) => {
    if (aid.areaName && aid.areaName !== 'غير محدد') return aid.areaName;
    const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
    return guardian?.areaName || 'غير محدد';
  };

  return (
    <div className="space-y-4">
      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  رقم الهوية
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  الاسم
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  المنطقة
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  نوع المساعدة
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  تاريخ المساعدة
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  رقم الجوال
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((aid) => (
                <tr key={aid.id} className="hover:bg-gray-50 transition-colors border border-gray-200">
                  {/* رقم الهوية */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <div className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono" style={{fontVariantNumeric: 'normal', direction: 'ltr', fontFamily: 'Arial, Tahoma, sans-serif'}}>
                      {aid.guardianNationalId}
                    </div>
                  </td>

                  {/* الاسم */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <span className="font-medium text-gray-900">
                      {aid.guardianName || 'غير محدد'}
                    </span>
                  </td>

                  {/* المنطقة */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <span className="text-sm font-medium text-gray-900 bg-indigo-50 px-3 py-1 rounded-lg">
                      {getAreaName(aid)}
                    </span>
                  </td>

                  {/* نوع المساعدة */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAidTypeColor(aid.aidType)}`}> 
                      {aid.aidType}
                    </span>
                  </td>

                  {/* تاريخ المساعدة */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <span className="text-sm font-medium text-gray-900 bg-green-50 px-3 py-1 rounded-lg">
                      {formatDate(aid.aidDate)}
                    </span>
                  </td>

                  {/* رقم الجوال */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <div className="text-lg font-bold text-gray-900 bg-orange-50 px-3 py-1 rounded-lg font-mono" style={{fontVariantNumeric: 'normal', direction: 'ltr', fontFamily: 'Arial, Tahoma, sans-serif'}}>
                      {aid.guardianPhone || 'غير محدد'}
                    </div>
                  </td>

                  {/* الإجراءات */}
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(aid);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                        title="عرض"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(aid);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(aid);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {aids.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <HandHeart className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد بيانات مساعدات للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة مساعدة جديدة للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={aids.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};