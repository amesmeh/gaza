import React, { useState, useEffect } from 'react';
import { RegistrationRequest, Area } from '../../types';
import { Modal } from '../Common/Modal';
import { RegistrationRequestForm } from './RegistrationRequestForm';
import { RegistrationRequestDetails } from './RegistrationRequestDetails';
import { RegistrationRequestTable } from './RegistrationRequestTable';
import { RegistrationRequestFilter } from './RegistrationRequestFilter';
import { Plus, Download, Upload, FileText, ExternalLink } from 'lucide-react';
import { registrationRequestsAPI, areasAPI, guardiansAPI, childrenAPI } from '../../services/api';

export const RegistrationRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
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

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [requestsData, areasData] = await Promise.all([
          registrationRequestsAPI.getAll(),
          areasAPI.getAll()
        ]);
        setRequests(requestsData);
        setAreas(areasData);
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
        filtered = filtered.filter(request => request.areaId?.toString() === filters.selectedArea);
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

  const handleAddRequest = async (data: Omit<RegistrationRequest, '_id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      // تحضير البيانات التفصيلية
      const requestDetails = {
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        currentJob: data.currentJob,
        residenceStatus: data.residenceStatus,
        originalGovernorate: data.originalGovernorate,
        originalCity: data.originalCity,
        displacementAddress: data.displacementAddress,
        wives: data.wives || [],
        children: data.children || [],
        notes: data.notes
      };

      const requestData = {
        name: data.name,
        nationalId: data.nationalId,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        currentJob: data.currentJob,
        residenceStatus: data.residenceStatus,
        originalGovernorate: data.originalGovernorate,
        originalCity: data.originalCity,
        displacementAddress: data.displacementAddress,
        areaId: data.areaId,
        areaName: data.areaName,
        wives: data.wives || [],
        children: data.children || [],
        notes: data.notes,
        requestType: 'تسجيل عائلة جديدة',
        requestDetails: JSON.stringify(requestDetails),
        status: 'pending'
      };

      const newRequest = await registrationRequestsAPI.create(requestData);
      setRequests(prev => [...prev, newRequest]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding request:', error);
      alert('حدث خطأ أثناء إضافة الطلب');
    }
  };

  const handleViewRequest = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleDeleteRequest = async (request: RegistrationRequest) => {
    if (!request._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف طلب ${request.name}؟`)) {
      try {
        await registrationRequestsAPI.delete(request._id);
        setRequests(prev => prev.filter(r => r._id !== request._id));
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('حدث خطأ أثناء حذف الطلب');
      }
    }
  };

  const handleBulkDelete = async (requestIds: string[]) => {
    if (window.confirm(`هل أنت متأكد من حذف ${requestIds.length} طلب؟`)) {
      try {
        // حذف واحد تلو الآخر لأن API لا يدعم حذف متعدد
        for (const id of requestIds) {
          await registrationRequestsAPI.delete(id);
        }
        setRequests(prev => prev.filter(request => !requestIds.includes(request._id || '')));
      } catch (error) {
        console.error('Error bulk deleting requests:', error);
        alert('حدث خطأ أثناء حذف الطلبات');
      }
    }
  };

  const handleApproveRequest = async (request: RegistrationRequest) => {
    if (!request._id) return;
    
    if (window.confirm(`هل أنت متأكد من الموافقة على طلب ${request.name}؟`)) {
      try {
        // تحديث حالة الطلب إلى موافق عليه
        const updatedRequest = await registrationRequestsAPI.update(request._id, {
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'المدير'
        });
        
        setRequests(prev => prev.map(r => r._id === request._id ? updatedRequest : r));
        
        // إذا كان الطلب مفتوح في نافذة التفاصيل، قم بتحديثه
        if (selectedRequest && selectedRequest._id === request._id) {
          setSelectedRequest(updatedRequest);
        }
        
        // ترحيل البيانات إلى جدول أولياء الأمور
        try {
          const guardianData = {
            name: request.name,
            nationalId: request.nationalId,
            phone: request.phone,
            gender: request.gender || 'male',
            maritalStatus: request.maritalStatus || 'متزوج',
            childrenCount: request.children?.length || 0,
            wivesCount: request.wives?.length || 1,
            familyMembersCount: (request.children?.length || 0) + (request.wives?.length || 1) + 1,
            currentJob: request.currentJob || '',
            residenceStatus: request.residenceStatus || 'resident',
            originalGovernorate: request.originalGovernorate || '',
            originalCity: request.originalCity || '',
            displacementAddress: request.displacementAddress || '',
            areaId: request.areaId || ''
          };

          const newGuardian = await guardiansAPI.create(guardianData);
          
          // إضافة الأبناء إذا كانوا موجودين
          let addedChildrenCount = 0;
          if (request.children && request.children.length > 0) {
            try {
              for (const childData of request.children) {
                // حساب العمر من تاريخ الميلاد
                const birthDate = new Date(childData.birthDate);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                
                const childToAdd = {
                  name: childData.name,
                  nationalId: childData.nationalId,
                  birthDate: childData.birthDate,
                  age: actualAge,
                  guardianId: newGuardian._id || '',
                  guardianName: newGuardian.name,
                  guardianNationalId: newGuardian.nationalId,
                  areaId: newGuardian.areaId,
                  areaName: newGuardian.areaName
                };
                
                await childrenAPI.create(childToAdd);
                addedChildrenCount++;
              }
            } catch (childrenError) {
              console.error('Error adding children:', childrenError);
              alert('تم إضافة ولي الأمر بنجاح ولكن حدث خطأ في إضافة الأبناء. يرجى إضافتهم يدوياً.');
            }
          }
          
          alert(`تمت الموافقة على الطلب وترحيل البيانات بنجاح!\nتم إضافة ولي الأمر: ${newGuardian.name}\nتم إضافة ${addedChildrenCount} من الأبناء\nعدد الزوجات: ${guardianData.wivesCount}`);
        } catch (migrationError) {
          console.error('Error migrating data to guardians:', migrationError);
          alert('تمت الموافقة على الطلب ولكن حدث خطأ في ترحيل البيانات إلى جدول أولياء الأمور. يرجى التحقق من البيانات يدوياً.');
        }
      } catch (error) {
        console.error('Error approving request:', error);
        alert('حدث خطأ أثناء الموافقة على الطلب');
      }
    }
  };

  const handleRejectRequest = async (request: RegistrationRequest, reason: string) => {
    if (!request._id) return;
    
    try {
      const updatedRequest = await registrationRequestsAPI.update(request._id, {
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'المدير',
        rejectionReason: reason
      });
      
      setRequests(prev => prev.map(r => r._id === request._id ? updatedRequest : r));
      
      // إذا كان الطلب مفتوح في نافذة التفاصيل، قم بتحديثه
      if (selectedRequest && selectedRequest._id === request._id) {
        setSelectedRequest(updatedRequest);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('حدث خطأ أثناء رفض الطلب');
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