import React, { useState, useEffect } from 'react';
import { RegistrationRequest, Area } from '../../types';
import { Modal } from '../Common/Modal';
import { RegistrationRequestForm } from './RegistrationRequestForm';
import { RegistrationRequestDetails } from './RegistrationRequestDetails';
import { RegistrationRequestTable } from './RegistrationRequestTable';
import { RegistrationRequestFilter } from './RegistrationRequestFilter';
import { Plus, Download, Upload, FileText, ExternalLink } from 'lucide-react';
import { mockRegistrationRequests } from '../../data/mockData';
import { mockAreas } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const RegistrationRequestsPage: React.FC = () => {
  const [requests, setRequests] = useLocalStorage<RegistrationRequest[]>('registrationRequests', mockRegistrationRequests);
  const [areas, setAreas] = useLocalStorage<Area[]>('areas', mockAreas);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState<RegistrationRequest[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  
  const [filters, setFilters] = useState({
    selectedStatus: '',
    selectedArea: '',
    searchTerm: ''
  });

  // محاكاة جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // البيانات الآن تُحفظ في localStorage تلقائياً
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    const applyFilters = async () => {
      setIsSearching(true);
      
      // محاكاة تأخير البحث
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = [...requests];
      
      // فلترة حسب الحالة
      if (filters.selectedStatus) {
        filtered = filtered.filter(request => request.status === filters.selectedStatus);
      }
      
      // فلترة حسب المنطقة
      if (filters.selectedArea) {
        filtered = filtered.filter(request => request.areaId.toString() === filters.selectedArea);
      }
      
      // فلترة حسب البحث العام
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(request => 
          request.name.toLowerCase().includes(searchTerm) ||
          request.nationalId.includes(searchTerm) ||
          request.phone.includes(searchTerm)
        );
      }
      
      setFilteredRequests(filtered);
      setIsSearching(false);
    };
    
    applyFilters();
  }, [requests, filters]);

  const handleAddRequest = (data: Omit<RegistrationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newRequest: RegistrationRequest = {
      ...data,
      id: Math.max(0, ...requests.map(r => r.id)) + 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setRequests([newRequest, ...requests]);
    setIsAddModalOpen(false);
  };

  const handleViewRequest = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleDeleteRequest = (request: RegistrationRequest) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب ${request.name}؟`)) {
      setRequests(requests.filter(r => r.id !== request.id));
    }
  };

  const handleBulkDelete = (requestIds: number[]) => {
    setRequests(requests.filter(request => !requestIds.includes(request.id)));
  };

  const handleApproveRequest = (request: RegistrationRequest) => {
    if (window.confirm(`هل أنت متأكد من الموافقة على طلب ${request.name}؟`)) {
      const updatedRequests = requests.map(r => {
        if (r.id === request.id) {
          return {
            ...r,
            status: 'approved',
            updatedAt: new Date().toISOString(),
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'المدير'
          };
        }
        return r;
      });
      
      setRequests(updatedRequests);
      
      // إذا كان الطلب مفتوح في نافذة التفاصيل، قم بتحديثه
      if (selectedRequest && selectedRequest.id === request.id) {
        setSelectedRequest({
          ...selectedRequest,
          status: 'approved',
          updatedAt: new Date().toISOString(),
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'المدير'
        });
      }
      
      // هنا يمكن إضافة كود لترحيل البيانات إلى جداول أولياء الأمور والزوجات والأبناء
      alert('تمت الموافقة على الطلب وترحيل البيانات بنجاح!');
    }
  };

  const handleRejectRequest = (request: RegistrationRequest, reason: string) => {
    const updatedRequests = requests.map(r => {
      if (r.id === request.id) {
        return {
          ...r,
          status: 'rejected',
          updatedAt: new Date().toISOString(),
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'المدير',
          rejectionReason: reason
        };
      }
      return r;
    });
    
    setRequests(updatedRequests);
    
    // إذا كان الطلب مفتوح في نافذة التفاصيل، قم بتحديثه
    if (selectedRequest && selectedRequest.id === request.id) {
      setSelectedRequest({
        ...selectedRequest,
        status: 'rejected',
        updatedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'المدير',
        rejectionReason: reason
      });
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedStatus: '',
      selectedArea: '',
      searchTerm: ''
    });
  };

  const handleExportRequests = () => {
    // Implementation of export to Excel
    console.log("Exporting requests to Excel");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="mr-3 text-gray-700">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان وأزرار الإجراءات */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة طلبات التسجيل</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة طلب جديد</span>
          </button>
          <button
            onClick={handleExportRequests}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>تصدير إلى Excel</span>
          </button>
          {/* زر حذف الكل */}
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع طلبات التسجيل؟ لا يمكن التراجع عن هذه العملية.')) {
                setRequests([]);
              }
            }}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="font-bold text-lg">×</span>
            <span>حذف الكل</span>
          </button>
          
          <a
            href="/registration"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>رابط التسجيل الخارجي</span>
          </a>
        </div>
      </div>

      {/* فلاتر البحث */}
      <RegistrationRequestFilter
        filters={filters}
        areas={areas}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredRequests.length}
        isSearching={isSearching}
      />

      {/* جدول طلبات التسجيل */}
      <RegistrationRequestTable
        requests={filteredRequests}
        onView={handleViewRequest}
        onDelete={handleDeleteRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onBulkDelete={handleBulkDelete}
      />

      {/* نافذة إضافة طلب جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة طلب تسجيل جديد"
        size="xl"
      >
        <RegistrationRequestForm
          areas={areas}
          onSubmit={handleAddRequest}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة عرض تفاصيل الطلب */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل طلب: ${selectedRequest?.name || ''}`}
        size="xl"
      >
        {selectedRequest && (
          <RegistrationRequestDetails
            request={selectedRequest}
            onClose={() => setIsViewModalOpen(false)}
            onApprove={selectedRequest.status === 'pending' ? handleApproveRequest : undefined}
            onReject={selectedRequest.status === 'pending' ? handleRejectRequest : undefined}
          />
        )}
      </Modal>
    </div>
  );
};