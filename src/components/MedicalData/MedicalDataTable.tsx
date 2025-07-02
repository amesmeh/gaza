import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronDown, ChevronUp, X, User, Phone, Car as IdCard, Building, FileText } from 'lucide-react';
import { MedicalData } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface MedicalDataTableProps {
  medicalData: MedicalData[];
  onView: (medicalData: MedicalData) => void;
  onEdit: (medicalData: MedicalData) => void;
  onDelete: (medicalData: MedicalData) => void;
  onBulkDelete?: (medicalDataIds: number[]) => void;
  onInlineEdit?: (medicalData: MedicalData, field: string, value: any) => void;
}

export const MedicalDataTable: React.FC<MedicalDataTableProps> = ({ 
  medicalData, 
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
    patientName: true,
    patientNationalId: true,
    guardianName: true,
    diseaseType: true,
    phone: true,
    actions: true
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: medicalData, itemsPerPage: 25 });

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleInlineEdit = (medicalDataItem: MedicalData, field: string, value: any) => {
    if (onInlineEdit) {
      onInlineEdit(medicalDataItem, field, value);
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

    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} سجل مرضي؟ هذا الإجراء لا يمكن التراجع عنه.`;
    
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

  const renderEditableCell = (medicalDataItem: MedicalData, field: string, value: any, type: 'text' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingCell?.id === medicalDataItem.id && editingCell?.field === field;
    
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={value}
            onChange={(e) => handleInlineEdit(medicalDataItem, field, e.target.value)}
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
          onChange={(e) => handleInlineEdit(medicalDataItem, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleInlineEdit(medicalDataItem, field, (e.target as HTMLInputElement).value);
            }
          }}
          autoFocus
          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({id: medicalDataItem.id, field})}
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

  const getDiseaseTypeColor = (diseaseType: string) => {
    const colors: { [key: string]: string } = {
      'مرض مزمن': 'bg-red-100 text-red-800',
      'مرض قلب': 'bg-pink-100 text-pink-800',
      'مرض الربو': 'bg-blue-100 text-blue-800',
      'مرض الصرع': 'bg-purple-100 text-purple-800',
      'مرض السكري': 'bg-orange-100 text-orange-800',
      'مرض الكلى': 'bg-indigo-100 text-indigo-800',
      'مرض الضغط': 'bg-yellow-100 text-yellow-800',
      'مرض الغدة الدرقية': 'bg-green-100 text-green-800',
      'مرض الكبد': 'bg-cyan-100 text-cyan-800',
      'مرض السرطان': 'bg-rose-100 text-rose-800',
      'مرض الجهاز الهضمي': 'bg-amber-100 text-amber-800',
      'مرض الجهاز التنفسي': 'bg-lime-100 text-lime-800',
      'مرض العظام': 'bg-teal-100 text-teal-800',
      'مرض العيون': 'bg-sky-100 text-sky-800',
      'مرض الأعصاب': 'bg-violet-100 text-violet-800',
      'مرض نفسي': 'bg-fuchsia-100 text-fuchsia-800',
      'مرض جلدي': 'bg-emerald-100 text-emerald-800',
      'مرض آخر': 'bg-gray-100 text-gray-800'
    };
    return colors[diseaseType] || 'bg-gray-100 text-gray-800';
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
                  تم اختيار {selectedRows.size} سجل مرضي
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
              {key === 'patientName' && 'اسم المريض'}
              {key === 'patientNationalId' && 'رقم هوية المريض'}
              {key === 'guardianName' && 'اسم ولي الأمر'}
              {key === 'diseaseType' && 'نوع المرض'}
              {key === 'phone' && 'رقم الجوال'}
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
                {visibleColumns.patientName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم المريض
                  </th>
                )}
                {visibleColumns.patientNationalId && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم هوية المريض
                  </th>
                )}
                {visibleColumns.guardianName && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم ولي الأمر
                  </th>
                )}
                {visibleColumns.diseaseType && (
                  <th className="w-36 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع المرض
                  </th>
                )}
                {visibleColumns.phone && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الجوال
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
              {paginatedData.map((medicalDataItem) => (
                <React.Fragment key={medicalDataItem.id}>
                  <tr className={`transition-colors ${selectedRows.has(medicalDataItem.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                    {/* عمود التحديد */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(medicalDataItem.id)}
                        onChange={() => handleSelectRow(medicalDataItem.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* عمود التوسيع */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(medicalDataItem.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(medicalDataItem.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </td>

                    {/* عمود اسم المريض */}
                    {visibleColumns.patientName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {renderEditableCell(medicalDataItem, 'patientName', medicalDataItem.patientName)}
                            </div>
                            <div className="text-sm text-gray-500">مريض</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم هوية المريض */}
                    {visibleColumns.patientNationalId && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                          {renderEditableCell(medicalDataItem, 'patientNationalId', medicalDataItem.patientNationalId)}
                        </div>
                      </td>
                    )}

                    {/* عمود اسم ولي الأمر */}
                    {visibleColumns.guardianName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {medicalDataItem.guardianName || 'غير محدد'}
                            </div>
                            <div className="text-sm text-gray-500 font-mono" dir="ltr">
                              {medicalDataItem.guardianNationalId}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود نوع المرض */}
                    {visibleColumns.diseaseType && (
                      <td className="w-36 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDiseaseTypeColor(medicalDataItem.diseaseType)}`}>
                            {renderEditableCell(medicalDataItem, 'diseaseType', medicalDataItem.diseaseType)}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الجوال */}
                    {visibleColumns.phone && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                            {renderEditableCell(medicalDataItem, 'phone', medicalDataItem.phone)}
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
                              onView(medicalDataItem);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(medicalDataItem);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(medicalDataItem);
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
                  {expandedRows.has(medicalDataItem.id) && (
                    <tr className="bg-purple-50">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">اسم المريض: </span>
                            <span className="font-semibold">{medicalDataItem.patientName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم هوية المريض: </span>
                            <span className="font-mono font-semibold">{medicalDataItem.patientNationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">اسم ولي الأمر: </span>
                            <span className="font-semibold">{medicalDataItem.guardianName || 'غير محدد'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم هوية ولي الأمر: </span>
                            <span className="font-mono font-semibold">{medicalDataItem.guardianNationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">نوع المرض: </span>
                            <span className="font-semibold">{medicalDataItem.diseaseType}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الجوال: </span>
                            <span className="font-mono">{medicalDataItem.phone}</span>
                          </div>
                          {medicalDataItem.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">الملاحظات: </span>
                              <span>{medicalDataItem.notes}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">تاريخ التسجيل: </span>
                            <span>{formatDate(medicalDataItem.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">آخر تحديث: </span>
                            <span>{formatDate(medicalDataItem.updatedAt)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {medicalData.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد بيانات مرضية للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة بيانات مرضية جديدة للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={medicalData.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};