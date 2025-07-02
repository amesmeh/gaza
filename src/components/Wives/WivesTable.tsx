import React, { useState } from 'react';
import { Edit, Trash2, Eye, X, User } from 'lucide-react';
import { Wife } from '../../types';
import { Table } from '../Common/Table';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { Guardian } from '../../types';

interface WivesTableProps {
  wives: Wife[];
  guardians?: Guardian[];
  onView: (wife: Wife) => void;
  onEdit: (wife: Wife) => void;
  onDelete: (wife: Wife) => void;
  onBulkDelete?: (wifeIds: number[]) => void;
  onInlineEdit?: (wife: Wife, field: string, value: any) => void;
}

export const WivesTable: React.FC<WivesTableProps> = ({ 
  wives, 
  guardians, 
  onView, 
  onEdit, 
  onDelete,
  onBulkDelete,
  onInlineEdit 
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: wives, itemsPerPage: 25 });

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
      setSelectedRows(new Set(paginatedData.map(w => w.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('يرجى اختيار عناصر للحذف');
      return;
    }
    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} زوجة؟ هذا الإجراء لا يمكن التراجع عنه.`;
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

  const columns = [
    {
      key: 'select',
      label: '',
      width: 'w-12',
      render: (value: any, row: Wife) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={() => handleSelectRow(row.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      )
    },
    {
      key: 'name',
      label: 'اسم الزوجة',
      width: 'w-1/5',
      render: (value: string) => (
        <span className="font-semibold text-gray-900 text-sm truncate">{value}</span>
      )
    },
    {
      key: 'nationalId',
      label: 'رقم هوية الزوجة',
      width: 'w-1/5',
      render: (value: string) => (
        <span className="text-sm text-gray-700 font-mono">{value}</span>
      )
    },
    {
      key: 'husbandName',
      label: 'اسم الزوج',
      width: 'w-1/5',
      render: (value: string) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-700 truncate">{value}</span>
        </div>
      )
    },
    {
      key: 'husbandNationalId',
      label: 'رقم هوية الزوج',
      width: 'w-1/5',
      render: (value: string) => (
        <span className="text-sm text-gray-700 font-mono">{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      width: 'w-1/6',
      render: (value: any, row: Wife) => (
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* شريط الحذف المتعدد */}
      {selectedRows.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-red-800 font-medium text-sm">
                  تم اختيار {selectedRows.size} زوجة
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
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>حذف المحدد ({selectedRows.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* جدول البيانات */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-1/5">
                  اسم الزوجة
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-1/5">
                  رقم هوية الزوجة
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-1/5">
                  اسم الزوج
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-1/5">
                  رقم هوية الزوج
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200 w-1/6">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData.map((wife, index) => (
                <tr key={index} className="transition-colors border-b border-gray-200">
                  <td className="px-4 py-3 text-center border border-gray-200 w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(wife.id)}
                      onChange={() => handleSelectRow(wife.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200 w-1/5">
                    <span className="font-semibold text-gray-900 text-sm truncate">{wife.name}</span>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200 w-1/5">
                    <span className="text-sm text-gray-700 font-mono">{wife.nationalId}</span>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200 w-1/5">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-700 truncate">{wife.husbandName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200 w-1/5">
                    <span className="text-sm text-gray-700 font-mono">{wife.husbandNationalId}</span>
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-200 w-1/6">
                    <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(wife);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={wives.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};