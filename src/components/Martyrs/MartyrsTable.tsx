import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronDown, ChevronUp, X, User, Phone, Car as IdCard, Calendar, Heart } from 'lucide-react';
import { Martyr } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface MartyrsTableProps {
  martyrs: Martyr[];
  onView: (martyr: Martyr) => void;
  onEdit: (martyr: Martyr) => void;
  onDelete: (martyr: Martyr) => void;
  onBulkDelete?: (martyrIds: number[]) => void;
  onInlineEdit?: (martyr: Martyr, field: string, value: any) => void;
}

export const MartyrsTable: React.FC<MartyrsTableProps> = ({ 
  martyrs, 
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
    martyrdomDate: true,
    agentName: true,
    agentPhone: true,
    relationshipToMartyr: true,
    actions: true
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: martyrs, itemsPerPage: 25 });

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleInlineEdit = (martyr: Martyr, field: string, value: any) => {
    if (onInlineEdit) {
      onInlineEdit(martyr, field, value);
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
      setSelectedRows(new Set(paginatedData.map(m => m.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('يرجى اختيار عناصر للحذف');
      return;
    }

    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} شهيد؟ هذا الإجراء لا يمكن التراجع عنه.`;
    
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

  const renderEditableCell = (martyr: Martyr, field: string, value: any, type: 'text' | 'date' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingCell?.id === martyr.id && editingCell?.field === field;
    
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={value}
            onChange={(e) => handleInlineEdit(martyr, field, e.target.value)}
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
          onChange={(e) => handleInlineEdit(martyr, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleInlineEdit(martyr, field, (e.target as HTMLInputElement).value);
            }
          }}
          autoFocus
          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({id: martyr.id, field})}
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

  const getRelationshipColor = (relationship: string) => {
    const colors: { [key: string]: string } = {
      'والد': 'bg-blue-100 text-blue-800',
      'والدة': 'bg-pink-100 text-pink-800',
      'زوج': 'bg-green-100 text-green-800',
      'زوجة': 'bg-purple-100 text-purple-800',
      'ابن': 'bg-orange-100 text-orange-800',
      'ابنة': 'bg-yellow-100 text-yellow-800',
      'أخ': 'bg-indigo-100 text-indigo-800',
      'أخت': 'bg-cyan-100 text-cyan-800'
    };
    return colors[relationship] || 'bg-gray-100 text-gray-800';
  };

  const relationships = [
    'والد', 'والدة', 'زوج', 'زوجة', 'ابن', 'ابنة', 'أخ', 'أخت',
    'عم', 'عمة', 'خال', 'خالة', 'جد', 'جدة', 'حفيد', 'حفيدة',
    'صديق', 'قريب', 'أخرى'
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
                  تم اختيار {selectedRows.size} شهيد
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
              {key === 'name' && 'اسم الشهيد'}
              {key === 'nationalId' && 'رقم الهوية'}
              {key === 'martyrdomDate' && 'تاريخ الاستشهاد'}
              {key === 'agentName' && 'اسم الوكيل'}
              {key === 'agentPhone' && 'جوال الوكيل'}
              {key === 'relationshipToMartyr' && 'صلة القرابة'}
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
                    اسم الشهيد
                  </th>
                )}
                {visibleColumns.nationalId && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهوية
                  </th>
                )}
                {visibleColumns.martyrdomDate && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الاستشهاد
                  </th>
                )}
                {visibleColumns.agentName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الوكيل
                  </th>
                )}
                {visibleColumns.agentPhone && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    جوال الوكيل
                  </th>
                )}
                {visibleColumns.relationshipToMartyr && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    صلة القرابة
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
              {paginatedData.map((martyr) => (
                <React.Fragment key={martyr.id}>
                  <tr className={`transition-colors ${selectedRows.has(martyr.id) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                    {/* عمود التحديد */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(martyr.id)}
                        onChange={() => handleSelectRow(martyr.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* عمود التوسيع */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(martyr.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(martyr.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </td>

                    {/* عمود اسم الشهيد */}
                    {visibleColumns.name && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Heart className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {renderEditableCell(martyr, 'name', martyr.name)}
                            </div>
                            <div className="text-sm text-gray-500">شهيد</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الهوية */}
                    {visibleColumns.nationalId && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                          {renderEditableCell(martyr, 'nationalId', martyr.nationalId)}
                        </div>
                      </td>
                    )}

                    {/* عمود تاريخ الاستشهاد */}
                    {visibleColumns.martyrdomDate && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {renderEditableCell(martyr, 'martyrdomDate', martyr.martyrdomDate, 'date')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(martyr.martyrdomDate)}
                        </div>
                      </td>
                    )}

                    {/* عمود اسم الوكيل */}
                    {visibleColumns.agentName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {renderEditableCell(martyr, 'agentName', martyr.agentName)}
                            </div>
                            <div className="text-sm text-gray-500">وكيل</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود جوال الوكيل */}
                    {visibleColumns.agentPhone && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                            {renderEditableCell(martyr, 'agentPhone', martyr.agentPhone)}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود صلة القرابة */}
                    {visibleColumns.relationshipToMartyr && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipColor(martyr.relationshipToMartyr)}`}>
                          {renderEditableCell(martyr, 'relationshipToMartyr', martyr.relationshipToMartyr, 'select', relationships)}
                        </span>
                      </td>
                    )}

                    {/* عمود الإجراءات */}
                    {visibleColumns.actions && (
                      <td className="w-24 px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(martyr);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(martyr);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(martyr);
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
                  {expandedRows.has(martyr.id) && (
                    <tr className="bg-red-50">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">اسم الشهيد: </span>
                            <span className="font-semibold">{martyr.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم هوية الشهيد: </span>
                            <span className="font-mono font-semibold">{martyr.nationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">تاريخ الاستشهاد: </span>
                            <span>{formatDate(martyr.martyrdomDate)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">اسم الوكيل: </span>
                            <span className="font-semibold">{martyr.agentName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم هوية الوكيل: </span>
                            <span className="font-mono font-semibold">{martyr.agentNationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">جوال الوكيل: </span>
                            <span className="font-mono">{martyr.agentPhone}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">صلة القرابة: </span>
                            <span className="font-semibold">{martyr.relationshipToMartyr}</span>
                          </div>
                          {martyr.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">الملاحظات: </span>
                              <span>{martyr.notes}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">تاريخ التسجيل: </span>
                            <span>{formatDate(martyr.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">آخر تحديث: </span>
                            <span>{formatDate(martyr.updatedAt)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {martyrs.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <Heart className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد بيانات شهداء للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة شهيد جديد للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={martyrs.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};