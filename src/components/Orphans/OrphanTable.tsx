import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronDown, ChevronUp, X, User, Phone, Car as IdCard, Calendar, UserRoundX, MapPin, GraduationCap, Heart, Users, Fuel as Mosque } from 'lucide-react';
import { Orphan } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface OrphanTableProps {
  orphans: Orphan[];
  onView: (orphan: Orphan) => void;
  onEdit: (orphan: Orphan) => void;
  onDelete: (orphan: Orphan) => void;
  onBulkDelete?: (orphanIds: number[]) => void;
  onInlineEdit?: (orphan: Orphan, field: string, value: any) => void;
}

export const OrphanTable: React.FC<OrphanTableProps> = ({ 
  orphans, 
  onView, 
  onEdit, 
  onDelete,
  onBulkDelete,
  onInlineEdit 
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<{id: number, field: string} | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    nationalId: true,
    gender: true,
    age: true,
    healthStatus: true,
    educationalStage: true,
    martyrName: true,
    guardianName: true,
    actions: true
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: orphans, itemsPerPage: 25 });

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleInlineEdit = (orphan: Orphan, field: string, value: any) => {
    if (onInlineEdit) {
      onInlineEdit(orphan, field, value);
    }
    setEditingCell(null);
  };

  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === paginatedData.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(paginatedData.map(o => o.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('يرجى اختيار عناصر للحذف');
      return;
    }

    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} يتيم؟ هذا الإجراء لا يمكن التراجع عنه.`;
    
    if (window.confirm(confirmMessage)) {
      if (onBulkDelete) {
        onBulkDelete(Array.from(selectedRows));
      }
      setSelectedRows(new Set());
      setSelectAll(false);
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const renderEditableCell = (orphan: Orphan, field: string, value: any, type: 'text' | 'date' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingCell?.id === orphan.id && editingCell?.field === field;
    
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={value}
            onChange={(e) => handleInlineEdit(orphan, field, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      
      return (
        <input
          type={type}
          value={value}
          onChange={(e) => handleInlineEdit(orphan, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleInlineEdit(orphan, field, (e.target as HTMLInputElement).value);
            }
          }}
          autoFocus
          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({id: orphan.id, field})}
        className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
        title="انقر للتعديل"
      >
        {value}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
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

  // الحالات الصحية المتاحة
  const healthStatuses = [
    'جيدة',
    'متوسطة',
    'ضعيفة',
    'سيئة'
  ];

  // المراحل الدراسية المتاحة
  const educationalStages = [
    'روضة',
    'ابتدائي',
    'إعدادي',
    'ثانوي',
    'جامعي',
    'غير متعلم'
  ];

  return (
    <div className="space-y-4">
      {/* شريط الحذف المتعدد */}
      {selectedRows.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-red-800 font-medium">
                  تم اختيار {selectedRows.size} يتيم
                </span>
                <button
                  onClick={clearSelection}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  title="إلغاء التحديد"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>حذف المحدد ({selectedRows.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* التحكم في عرض الأعمدة */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">التحكم في عرض الأعمدة</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <label key={key} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisibleColumns(prev => ({
                  ...prev,
                  [key]: e.target.checked
                }))}
                className="ml-2 rtl:mr-2 rtl:ml-0"
              />
              {key === 'name' && 'اسم اليتيم'}
              {key === 'nationalId' && 'رقم الهوية'}
              {key === 'gender' && 'الجنس'}
              {key === 'age' && 'العمر'}
              {key === 'healthStatus' && 'الحالة الصحية'}
              {key === 'educationalStage' && 'المرحلة الدراسية'}
              {key === 'martyrName' && 'اسم الشهيد'}
              {key === 'guardianName' && 'اسم الوصي'}
              {key === 'actions' && 'الإجراءات'}
            </label>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="w-12 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  توسيع
                </th>
                {visibleColumns.name && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم اليتيم
                  </th>
                )}
                {visibleColumns.nationalId && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهوية
                  </th>
                )}
                {visibleColumns.gender && (
                  <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الجنس
                  </th>
                )}
                {visibleColumns.age && (
                  <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العمر
                  </th>
                )}
                {visibleColumns.healthStatus && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة الصحية
                  </th>
                )}
                {visibleColumns.educationalStage && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المرحلة الدراسية
                  </th>
                )}
                {visibleColumns.martyrName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الشهيد
                  </th>
                )}
                {visibleColumns.guardianName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الوصي
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="w-24 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((orphan) => (
                <React.Fragment key={orphan.id}>
                  <tr className={`transition-colors ${selectedRows.has(orphan.id) ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                    {/* عمود التحديد */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(orphan.id)}
                        onChange={() => handleSelectRow(orphan.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* عمود التوسيع */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(orphan.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(orphan.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </td>

                    {/* عمود اسم اليتيم */}
                    {visibleColumns.name && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <UserRoundX className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {renderEditableCell(orphan, 'name', orphan.name)}
                            </div>
                            <div className="text-sm text-gray-500">يتيم</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الهوية */}
                    {visibleColumns.nationalId && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                          {renderEditableCell(orphan, 'nationalId', orphan.nationalId)}
                        </div>
                      </td>
                    )}

                    {/* عمود الجنس */}
                    {visibleColumns.gender && (
                      <td className="w-20 px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          orphan.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {orphan.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </span>
                      </td>
                    )}

                    {/* عمود العمر */}
                    {visibleColumns.age && (
                      <td className="w-20 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {orphan.age} سنة
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود الحالة الصحية */}
                    {visibleColumns.healthStatus && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthStatusColor(orphan.healthStatus)}`}>
                          {renderEditableCell(orphan, 'healthStatus', orphan.healthStatus, 'select', healthStatuses)}
                        </span>
                      </td>
                    )}

                    {/* عمود المرحلة الدراسية */}
                    {visibleColumns.educationalStage && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEducationalStageColor(orphan.educationalStage)}`}>
                          {renderEditableCell(orphan, 'educationalStage', orphan.educationalStage, 'select', educationalStages)}
                        </span>
                      </td>
                    )}

                    {/* عمود اسم الشهيد */}
                    {visibleColumns.martyrName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Mosque className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {orphan.martyrName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(orphan.martyrdomDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود اسم الوصي */}
                    {visibleColumns.guardianName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {renderEditableCell(orphan, 'guardianName', orphan.guardianName)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {orphan.guardianRelationship}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود الإجراءات */}
                    {visibleColumns.actions && (
                      <td className="w-24 px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(orphan);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(orphan);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(orphan);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {/* الصف الموسع */}
                  {expandedRows.has(orphan.id) && (
                    <tr className="bg-amber-50">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">اسم اليتيم: </span>
                            <span className="font-semibold">{orphan.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الهوية: </span>
                            <span className="font-mono font-semibold">{orphan.nationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">الجنس: </span>
                            <span className="font-semibold">{orphan.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">تاريخ الميلاد: </span>
                            <span>{formatDate(orphan.birthDate)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">العمر: </span>
                            <span className="font-semibold">{orphan.age} سنة</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">الحالة الصحية: </span>
                            <span className="font-semibold">{orphan.healthStatus}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">المرحلة الدراسية: </span>
                            <span className="font-semibold">{orphan.educationalStage}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">اسم الشهيد/المتوفي: </span>
                            <span className="font-semibold">{orphan.martyrName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم هوية الشهيد: </span>
                            <span className="font-mono">{orphan.martyrNationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">تاريخ الاستشهاد: </span>
                            <span>{formatDate(orphan.martyrdomDate)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">عدد الأخوة الذكور: </span>
                            <span className="font-semibold">{orphan.maleSiblingsCount}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">عدد الأخوة الإناث: </span>
                            <span className="font-semibold">{orphan.femaleSiblingsCount}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">اسم الوصي: </span>
                            <span className="font-semibold">{orphan.guardianName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">صلة قرابة الوصي: </span>
                            <span className="font-semibold">{orphan.guardianRelationship}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">العنوان: </span>
                            <span>{orphan.address}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الجوال: </span>
                            <span className="font-mono">{orphan.phone}</span>
                          </div>
                          {orphan.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">ملاحظات: </span>
                              <span>{orphan.notes}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">تاريخ التسجيل: </span>
                            <span>{formatDate(orphan.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">آخر تحديث: </span>
                            <span>{formatDate(orphan.updatedAt)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {orphans.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <UserRoundX className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد بيانات أيتام للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة يتيم جديد للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={orphans.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};