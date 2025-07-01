import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronDown, ChevronUp, X, User, Phone, Car as IdCard, Calendar, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RegistrationRequest } from '../../types';
import { Pagination } from '../Common/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface RegistrationRequestTableProps {
  requests: RegistrationRequest[];
  onView: (request: RegistrationRequest) => void;
  onDelete: (request: RegistrationRequest) => void;
  onApprove: (request: RegistrationRequest) => void;
  onReject: (request: RegistrationRequest, reason: string) => void;
  onBulkDelete?: (requestIds: number[]) => void;
}

export const RegistrationRequestTable: React.FC<RegistrationRequestTableProps> = ({ 
  requests, 
  onView, 
  onDelete,
  onApprove,
  onReject,
  onBulkDelete
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<{id: number, reason: string} | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    nationalId: true,
    phone: true,
    status: true,
    createdAt: true,
    actions: true
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage
  } = usePagination({ data: requests, itemsPerPage: 25 });

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
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
      setSelectedRows(new Set(paginatedData.map(r => r.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('يرجى اختيار عناصر للحذف');
      return;
    }

    const confirmMessage = `هل أنت متأكد من حذف ${selectedRows.size} طلب؟ هذا الإجراء لا يمكن التراجع عنه.`;
    
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

  const handleReject = (request: RegistrationRequest) => {
    if (rejectionReason && rejectionReason.id === request.id && rejectionReason.reason.trim()) {
      onReject(request, rejectionReason.reason);
      setRejectionReason(null);
    } else {
      setRejectionReason({ id: request.id, reason: '' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'تمت الموافقة';
      case 'rejected': return 'مرفوض';
      default: return 'غير معروف';
    }
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
                  تم اختيار {selectedRows.size} طلب
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
              {key === 'name' && 'الاسم'}
              {key === 'nationalId' && 'رقم الهوية'}
              {key === 'phone' && 'رقم الهاتف'}
              {key === 'status' && 'الحالة'}
              {key === 'createdAt' && 'تاريخ التقديم'}
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
                    الاسم
                  </th>
                )}
                {visibleColumns.nationalId && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهوية
                  </th>
                )}
                {visibleColumns.phone && (
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهاتف
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                )}
                {visibleColumns.createdAt && (
                  <th className="w-28 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التقديم
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="w-40 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((request) => (
                <React.Fragment key={request.id}>
                  <tr className={`transition-colors ${selectedRows.has(request.id) ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>
                    {/* عمود التحديد */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(request.id)}
                        onChange={() => handleSelectRow(request.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* عمود التوسيع */}
                    <td className="w-12 px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(request.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(request.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                    </td>

                    {/* عمود الاسم */}
                    {visibleColumns.name && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <User className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-base">
                              {request.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.gender === 'male' ? 'ذكر' : 'أنثى'} • {request.maritalStatus}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الهوية */}
                    {visibleColumns.nationalId && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                          {request.nationalId}
                        </div>
                      </td>
                    )}

                    {/* عمود رقم الهاتف */}
                    {visibleColumns.phone && (
                      <td className="w-32 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base font-mono font-semibold text-gray-900" dir="ltr">
                            {request.phone}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود الحالة */}
                    {visibleColumns.status && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span>{getStatusText(request.status)}</span>
                        </span>
                      </td>
                    )}

                    {/* عمود تاريخ التقديم */}
                    {visibleColumns.createdAt && (
                      <td className="w-28 px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* عمود الإجراءات */}
                    {visibleColumns.actions && (
                      <td className="w-40 px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(request);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApprove(request);
                                }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="موافقة"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(request);
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="رفض"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(request);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* حقل سبب الرفض */}
                        {rejectionReason && rejectionReason.id === request.id && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={rejectionReason.reason}
                              onChange={(e) => setRejectionReason({ id: request.id, reason: e.target.value })}
                              placeholder="أدخل سبب الرفض"
                              className="w-full px-2 py-1 text-sm border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <div className="flex justify-end mt-1 space-x-1 rtl:space-x-reverse">
                              <button
                                onClick={() => setRejectionReason(null)}
                                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                                disabled={!rejectionReason.reason.trim()}
                              >
                                تأكيد
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                  
                  {/* الصف الموسع */}
                  {expandedRows.has(request.id) && (
                    <tr className="bg-teal-50">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">الاسم: </span>
                            <span className="font-semibold">{request.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الهوية: </span>
                            <span className="font-mono font-semibold">{request.nationalId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">رقم الهاتف: </span>
                            <span className="font-mono">{request.phone}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">الجنس: </span>
                            <span>{request.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">الحالة الاجتماعية: </span>
                            <span>{request.maritalStatus}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">المنطقة: </span>
                            <span>{request.areaName || 'غير محدد'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">حالة الإقامة: </span>
                            <span>{request.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">عدد الزوجات: </span>
                            <span>{request.wives?.length || 0}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">عدد الأبناء: </span>
                            <span>{request.children?.length || 0}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">حالة الطلب: </span>
                            <span className={`font-semibold ${
                              request.status === 'pending' ? 'text-yellow-600' : 
                              request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">تاريخ التقديم: </span>
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                          {request.reviewedAt && (
                            <div>
                              <span className="font-medium text-gray-700">تاريخ المراجعة: </span>
                              <span>{formatDate(request.reviewedAt)}</span>
                            </div>
                          )}
                          {request.rejectionReason && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">سبب الرفض: </span>
                              <span className="text-red-600">{request.rejectionReason}</span>
                            </div>
                          )}
                          {request.notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <span className="font-medium text-gray-700">ملاحظات: </span>
                              <span>{request.notes}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {requests.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد طلبات تسجيل للعرض</p>
                <p className="text-gray-400 text-sm mt-2">قم بإضافة طلب جديد للبدء</p>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={requests.length}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};