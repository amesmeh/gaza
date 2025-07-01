import React, { useState } from 'react';
import { Edit, Trash2, Phone, MapPin, Users, Eye, X } from 'lucide-react';
import { Guardian, Area } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface GuardiansTableProps {
  guardians: Guardian[];
  areas: Area[];
  onView: (guardian: Guardian) => void;
  onEdit: (guardian: Guardian) => void;
  onDelete: (guardian: Guardian) => void;
  onBulkDelete?: (guardianIds: number[]) => void;
  onInlineEdit?: (guardian: Guardian, field: string, value: any) => void;
}

export const GuardiansTable: React.FC<GuardiansTableProps> = ({ 
  guardians, 
  areas,
  onView, 
  onEdit, 
  onDelete,
  onBulkDelete,
  onInlineEdit 
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const { currentPage, setCurrentPage, totalPages, paginatedData } = usePagination({ 
    data: guardians, 
    itemsPerPage: 25 
  });

  const handleSelectRow = (guardianId: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(guardianId)) {
      newSelectedRows.delete(guardianId);
    } else {
      newSelectedRows.add(guardianId);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(guardian => guardian.id)));
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.size > 0) {
      onBulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const selectAll = selectedRows.size === paginatedData.length && paginatedData.length > 0;

  const getAreaName = (areaId: number) => {
    const area = areas.find(area => area.id === areaId);
    return area ? area.name : 'غير محدد';
  };

  const renderEditableCell = (guardian: Guardian, field: string, value: any, type: string = 'text') => {
    if (!onInlineEdit) {
      return value;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
      onInlineEdit(guardian, field, newValue);
    };

    return (
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className="w-full bg-transparent border-none outline-none text-inherit font-inherit"
        style={{ minWidth: '60px' }}
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* شريط الحذف المتعدد */}
      {selectedRows.size > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-red-800 font-semibold text-base">
                  تم اختيار {selectedRows.size} عنصر
                </span>
                <button
                  onClick={clearSelection}
                  className="p-1.5 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200"
                  title="إلغاء التحديد"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>حذف المحدد ({selectedRows.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="w-12 px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="w-48 px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  الاسم
                </th>
                <th className="w-40 px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  رقم الهوية
                </th>
                <th className="w-40 px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  رقم الهاتف
                </th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  أفراد الأسرة
                </th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  المنطقة
                </th>
                <th className="w-24 px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((guardian) => (
                <tr key={guardian.id} className={`transition-all duration-200 ${selectedRows.has(guardian.id) ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-50'}`}>
                  {/* عمود التحديد */}
                  <td className="w-12 px-3 py-3 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(guardian.id)}
                      onChange={() => handleSelectRow(guardian.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {/* عمود الاسم مع التفاصيل */}
                  <td className="w-48 px-4 py-3 text-center border-r border-gray-200">
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 mb-1 text-sm truncate">
                        {renderEditableCell(guardian, 'name', guardian.name)}
                      </div>
                      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          guardian.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {guardian.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-700 font-semibold">{guardian.maritalStatus}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 font-medium truncate">{guardian.currentJob || 'غير محدد'}</span>
                        <span className="text-gray-400">•</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          guardian.residenceStatus === 'displaced' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {guardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* عمود رقم الهوية */}
                  <td className="w-40 px-4 py-3 text-center border-r border-gray-200">
                    <div className="text-base font-mono font-bold text-gray-900" dir="ltr">
                      {renderEditableCell(guardian, 'nationalId', guardian.nationalId)}
                    </div>
                  </td>

                  {/* عمود رقم الهاتف */}
                  <td className="w-40 px-4 py-3 text-center border-r border-gray-200">
                    <div className="text-base font-mono font-bold text-gray-900" dir="ltr">
                      {renderEditableCell(guardian, 'phone', guardian.phone)}
                    </div>
                  </td>

                  {/* عمود أفراد الأسرة */}
                  <td className="w-32 px-4 py-3 text-center border-r border-gray-200">
                    <div>
                      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-bold text-lg text-gray-900">
                          {renderEditableCell(guardian, 'familyMembersCount', guardian.familyMembersCount, 'number')}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse text-xs text-gray-600">
                        <span className="font-semibold">أطفال: <span className="font-bold text-blue-600">{guardian.childrenCount}</span></span>
                        <span className="font-semibold">زوجات: <span className="font-bold text-pink-600">{guardian.wivesCount}</span></span>
                      </div>
                    </div>
                  </td>

                  {/* عمود المنطقة */}
                  <td className="w-32 px-4 py-3 text-center border-r border-gray-200">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {getAreaName(guardian.areaId)}
                      </span>
                    </div>
                  </td>

                  {/* عمود الإجراءات */}
                  <td className="w-24 px-3 py-3 text-center">
                    <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(guardian);
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="عرض"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(guardian);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(guardian);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
          
          {guardians.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-base font-semibold">لا توجد بيانات لعرضها</div>
              <div className="text-gray-400 text-sm mt-1">قم بإضافة أولياء أمور جدد للبدء</div>
            </div>
          )}
        </div>
      </div>

      {/* ترقيم الصفحات */}
      {guardians.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};