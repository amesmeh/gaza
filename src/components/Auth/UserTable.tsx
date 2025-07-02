import React, { useState } from 'react';
import { Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { User, Area } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface UserTableProps {
  users: User[];
  areas: Area[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  currentUserId: number;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  areas, 
  onEdit, 
  onDelete,
  currentUserId
}) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: users, itemsPerPage: 10 });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'representative': return 'bg-blue-100 text-blue-800';
      case 'observer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير عام';
      case 'representative': return 'مندوب منطقة';
      case 'observer': return 'مراقب عام';
      default: return 'غير معروف';
    }
  };

  const getAreaName = (areaId?: number) => {
    if (!areaId) return 'غير محدد';
    const area = areas.find(a => a.id === areaId);
    return area ? area.name : 'غير محدد';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المنطقة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <UserIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.id === currentUserId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                            أنت
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                    <Shield className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.role === 'representative' ? getAreaName(user.areaId) : 'جميع المناطق'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                        user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="حذف"
                      disabled={user.id === currentUserId}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <UserIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">لا توجد بيانات مستخدمين للعرض</p>
              <p className="text-gray-400 text-sm mt-2">قم بإضافة مستخدم جديد للبدء</p>
            </div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={users.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};