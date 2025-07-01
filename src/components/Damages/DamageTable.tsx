import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronDown, ChevronUp, X, User, Phone, Car as IdCard, Building, MapPin, FileText } from 'lucide-react';
import { Damage } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface DamageTableProps {
  damages: Damage[];
  onView: (damage: Damage) => void;
  onEdit: (damage: Damage) => void;
  onDelete: (damage: Damage) => void;
  onBulkDelete?: (damageIds: number[]) => void;
  onInlineEdit?: (damage: Damage, field: string, value: any) => void;
}

export const DamageTable: React.FC<DamageTableProps> = ({ 
  damages, 
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
    guardianName: true,
    guardianNationalId: true,
    guardianPhone: true,
    areaName: true,
    damageType: true,
    actions: true
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: damages, itemsPerPage: 25 });

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleInlineEdit = (damage: Damage, field: string, value: any) => {
    if (onInlineEdit) {
      onInlineEdit(damage, field, value);
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
      setSelectedRows(new Set(paginatedData.map(d => d.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('يرجى اختيار عناصر للحذف');
      return;
    }

    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} سجل ضرر؟ هذا الإجراء لا يمكن التراجع عنه.`;
    
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

  const renderEditableCell = (damage: Damage, field: string, value: any, type: 'text' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingCell?.id === damage.id && editingCell?.field === field;
    
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={value}
            onChange={(e) => handleInlineEdit(damage, field, e.target.value)}
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
          onChange={(e) => handleInlineEdit(damage, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleInlineEdit(damage, field, (e.target as HTMLInputElement).value);
            }
          }}
          autoFocus
          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({id: damage.id, field})}
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

  const getDamageTypeColor = (damageType: string) => {
    return damageType === 'كلي' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="space-y-4">
      {/* شريط الحذف المتعدد */}
      {selectedRows.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-red-800 font-medium">
                  تم اختيار {selectedRows.size} سجل ضرر
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
              {key === 'guardianName' && 'اسم ولي الأمر'}
              {key === 'guardianNationalId' && 'رقم الهوية'}
              {key === 'guardianPhone' && 'رقم الجوال'}
              {key === 'areaName' && 'المنطقة'}
              {key === 'damageType' && 'نوع الضرر'}
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
                {visibleColumns.guardianName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم ولي الأمر
                  </th>
                )}
                {visibleColumns.guardianNationalId && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهوية
                  </th>
                )}
                {visibleColumns.guardianPhone && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الجوال
                  </th>
                )}
                {visibleColumns.areaName && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنطقة
                  </th>
                )}
                {visibleColumns.damageType && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع الضرر
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
              {paginatedData.map((damage) => (
                <React.Fragment key={damage.id}>
                  <tr className={`transition-colors ${selectedRows.has(damage.id) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                    {/* عمود التحديد */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(damage.id)}
                        onChange={() => handleSelectRow(damage.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* عمود التوسيع */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(damage.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(damage.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </td>

                    {/* عمود اسم ولي الأمر */}
                    {visibleColumns.guardianName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {renderEditableCell(damage, 'guardianName', damage.guardianName || 'غير محدد')}
                            </div>
                            <div className="text-sm text-gray-500">ولي أمر</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الهوية */}
                    {visibleColumns.guardianNationalId && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                          {renderEditableCell(damage, 'guardianNationalId', damage.guardianNationalId)}
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الجوال */}
                    {visibleColumns.guardianPhone && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                            {renderEditableCell(damage, 'guardianPhone', damage.guardianPhone || 'غير محدد')}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود المنطقة */}
                    {visibleColumns.areaName && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {damage.areaName || 'غير محدد'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود نوع الضرر */}
                    {visibleColumns.damageType && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDamageTypeColor(damage.damageType)}`}>
                            {renderEditableCell(damage, 'damageType', damage.damageType, 'select', ['كلي', 'جزئي'])}
                          </span>
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
                              onView(damage);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(damage);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(damage);
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
                  {expandedRows.has(damage.id) && (
                    <tr className="bg-red-50">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">اسم ولي الأمر: </span>
                            <span className="font-semibold">{damage.guardianName || 'غير محدد'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الهوية: </span>
                            <span className="font-mono font-semibold">{damage.guardianNationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الجوال: </span>
                            <span className="font-mono">{damage.guardianPhone || 'غير محدد'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">المنطقة: </span>
                            <span>{damage.areaName || 'غير محدد'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">نوع الضرر: </span>
                            <span className="font-semibold">{damage.damageType}</span>
                          </div>
                          {damage.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">الملاحظات: </span>
                              <span>{damage.notes}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">تاريخ التسجيل: </span>
                            <span>{formatDate(damage.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">آخر تحديث: </span>
                            <span>{formatDate(damage.updatedAt)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {damages.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد بيانات أضرار للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة سجل ضرر جديد للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={damages.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};