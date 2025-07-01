import React from 'react';
import { Edit, Trash2, User, Eye } from 'lucide-react';
import { Area } from '../../types';
import { Table } from '../Common/Table';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface AreasTableProps {
  areas: Area[];
  onView: (area: Area) => void;
  onEdit: (area: Area) => void;
  onDelete: (area: Area) => void;
}

export const AreasTable: React.FC<AreasTableProps> = ({ areas, onView, onEdit, onDelete }) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: areas, itemsPerPage: 25 });

  const columns = [
    {
      key: 'name',
      label: 'اسم المنطقة',
      width: 'w-1/4',
      render: (value: string) => (
        <div className="font-semibold text-gray-900 text-sm truncate">{value}</div>
      )
    },
    {
      key: 'representativeName',
      label: 'اسم المندوب',
      width: 'w-1/5',
      render: (value: string) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      )
    },
    {
      key: 'representativeId',
      label: 'رقم هوية المندوب',
      width: 'w-1/6',
      render: (value: string) => (
        <span className="text-sm text-gray-700 font-mono">{value}</span>
      )
    },
    {
      key: 'representativePhone',
      label: 'رقم الهاتف',
      width: 'w-1/6',
      render: (value: string) => (
        <span className="text-sm text-gray-700 font-mono" dir="ltr">{value}</span>
      )
    },
    {
      key: 'guardiansCount',
      label: 'عدد أولياء الأمور',
      width: 'w-1/6',
      render: (value: number = 0) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      width: 'w-1/6',
      render: (value: any, row: Area) => (
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="عرض"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table columns={columns} data={paginatedData} />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={areas.length}
        itemsPerPage={25}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};