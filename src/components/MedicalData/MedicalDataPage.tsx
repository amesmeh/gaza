import React, { useState, useEffect } from 'react';
import { MedicalData, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { MedicalDataForm } from './MedicalDataForm';
import { MedicalDataDetails } from './MedicalDataDetails';
import { MedicalDataTable } from './MedicalDataTable';
import { MedicalDataAdvancedFilter } from './MedicalDataAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportMedicalDataToExcel, createMedicalDataTemplate, importMedicalDataFromExcel, exportMedicalDataErrorsToExcel, downloadExcelFile } from '../../utils/medicalDataExcelUtils';
import { medicalDataAPI, guardiansAPI } from '../../services/api';

export const MedicalDataPage: React.FC = () => {
  const [medicalData, setMedicalData] = useState<MedicalData[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMedicalData, setFilteredMedicalData] = useState<MedicalData[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMedicalData, setSelectedMedicalData] = useState<MedicalData | null>(null);
  
  const [filters, setFilters] = useState({
    selectedDiseaseType: '',
    searchTerm: ''
  });

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [medicalDataData, guardiansData] = await Promise.all([
          medicalDataAPI.getAll(),
          guardiansAPI.getAll()
        ]);
        setMedicalData(medicalDataData);
        setGuardians(guardiansData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // تطبيق البحث البسيط
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicalData(medicalData);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = medicalData.filter(data => {
        const term = searchTerm.toLowerCase();
        return (
          (data.guardianName && data.guardianName.toLowerCase().includes(term)) ||
          data.guardianNationalId.includes(term) ||
          (data.areaName && data.areaName.toLowerCase().includes(term)) ||
          (data.medicalCondition && data.medicalCondition.toLowerCase().includes(term)) ||
          (data.emergencyContact && data.emergencyContact.includes(term))
        );
      });
      
      setFilteredMedicalData(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, medicalData]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredMedicalData(medicalData);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...medicalData];
      
      // فلترة حسب نوع المرض
      if (filters.selectedDiseaseType) {
        filtered = filtered.filter(data => data.medicalCondition === filters.selectedDiseaseType);
      }
      
      // فلترة حسب البحث العام
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(data => 
          (data.guardianName && data.guardianName.toLowerCase().includes(term)) ||
          data.guardianNationalId.includes(term) ||
          (data.areaName && data.areaName.toLowerCase().includes(term)) ||
          (data.medicalCondition && data.medicalCondition.toLowerCase().includes(term))
        );
      }
      
      setFilteredMedicalData(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, medicalData, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedDiseaseType || 
           filters.searchTerm;
  };

  const handleAddMedicalData = async (data: Omit<MedicalData, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      const medicalDataToCreate = {
        ...data,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const newMedicalData = await medicalDataAPI.create(medicalDataToCreate);
      setMedicalData(prev => [...prev, newMedicalData]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding medical data:', error);
      alert('حدث خطأ أثناء إضافة البيانات الطبية');
    }
  };

  const handleEditMedicalData = async (data: Omit<MedicalData, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedMedicalData?._id) return;
    
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      const medicalDataToUpdate = {
        ...data,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const updatedMedicalData = await medicalDataAPI.update(selectedMedicalData._id, medicalDataToUpdate);
      setMedicalData(prev => prev.map(item => item._id === selectedMedicalData._id ? updatedMedicalData : item));
      setIsEditModalOpen(false);
      setSelectedMedicalData(null);
    } catch (error) {
      console.error('Error updating medical data:', error);
      alert('حدث خطأ أثناء تحديث البيانات الطبية');
    }
  };

  const handleViewMedicalData = (data: MedicalData) => {
    setSelectedMedicalData(data);
    setIsViewModalOpen(true);
  };

  const handleEditMedicalDataClick = (data: MedicalData) => {
    setSelectedMedicalData(data);
    setIsEditModalOpen(true);
  };

  const handleDeleteMedicalData = async (data: MedicalData) => {
    if (!data._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف البيانات الطبية لـ ${data.guardianName}؟`)) {
      try {
        await medicalDataAPI.delete(data._id);
        setMedicalData(prev => prev.filter(item => item._id !== data._id));
      } catch (error) {
        console.error('Error deleting medical data:', error);
        alert('حدث خطأ أثناء حذف البيانات الطبية');
      }
    }
  };

  const handleBulkDelete = async (medicalDataIds: string[]) => {
    if (window.confirm(`هل أنت متأكد من حذف ${medicalDataIds.length} سجل طبي؟`)) {
      try {
        // حذف واحد تلو الآخر لأن API لا يدعم حذف متعدد
        for (const id of medicalDataIds) {
          await medicalDataAPI.delete(id);
        }
        setMedicalData(prev => prev.filter(item => !medicalDataIds.includes(item._id || '')));
      } catch (error) {
        console.error('Error bulk deleting medical data:', error);
        alert('حدث خطأ أثناء حذف البيانات الطبية');
      }
    }
  };

  const handleInlineEdit = async (data: MedicalData, field: string, value: any) => {
    if (!data._id) return;
    
    try {
      const updatedMedicalData = await medicalDataAPI.update(data._id, { [field]: value });
      setMedicalData(prev => prev.map(item => item._id === data._id ? updatedMedicalData : item));
    } catch (error) {
      console.error('Error updating medical data:', error);
      alert('حدث خطأ أثناء تحديث البيانات الطبية');
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedDiseaseType: '',
      searchTerm: ''
    });
  };

  // استيراد البيانات المرضية من ملف Excel
  const handleImportMedicalData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validMedicalData, errors } = await importMedicalDataFromExcel(file, guardians);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportMedicalDataErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-البيانات-الطبية');
      }
      
      if (validMedicalData.length > 0) {
        const newMedicalData = await Promise.all(
          validMedicalData.map(async (medicalDataItem) => {
            const guardian = guardians.find(g => g._id === medicalDataItem.guardianId);
            const medicalDataToCreate = {
              ...medicalDataItem,
              guardianName: guardian?.name || '',
              guardianNationalId: guardian?.nationalId || '',
              areaId: guardian?.areaId || '',
              areaName: guardian?.areaName || ''
            };
            return await medicalDataAPI.create(medicalDataToCreate);
          })
        );
        
        setMedicalData(prev => [...newMedicalData, ...prev]);
        alert(`تم استيراد ${newMedicalData.length} سجل طبي بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing medical data:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير البيانات المرضية إلى ملف Excel
  const handleExportMedicalData = () => {
    try {
      const workbook = exportMedicalDataToExcel(filteredMedicalData.length > 0 ? filteredMedicalData : medicalData);
      downloadExcelFile(workbook, 'البيانات-الطبية');
    } catch (error) {
      console.error('Error exporting medical data:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للبيانات الطبية
  const handleDownloadTemplate = () => {
    try {
      const workbook = createMedicalDataTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-البيانات-الطبية');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
  };

  // أنواع الأمراض المتاحة
  const diseaseTypes = [
    'مرض مزمن',
    'مرض قلب',
    'مرض الربو',
    'مرض الصرع',
    'مرض السكري',
    'مرض الكلى',
    'مرض الضغط',
    'مرض الغدة الدرقية',
    'مرض الكبد',
    'مرض السرطان',
    'مرض الجهاز الهضمي',
    'مرض الجهاز التنفسي',
    'مرض العظام',
    'مرض العيون',
    'مرض الأعصاب',
    'مرض نفسي',
    'مرض جلدي',
    'مرض آخر'
  ];

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة البيانات المرضية</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة حالة</span>
            </button>
            <button
              onClick={handleExportMedicalData}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span className="font-medium">تصدير Excel</span>
            </button>
          </div>

          {/* زر الاستيراد */}
          <div className="relative">
            <input
              type="file"
              id="importFile"
              accept=".xlsx, .xls"
              onChange={handleImportMedicalData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="importFile"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span className="font-medium">استيراد Excel</span>
            </label>
          </div>

          {/* زر تحميل القالب */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">تحميل القالب</span>
          </button>

          {/* زر حذف الكل */}
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع البيانات المرضية؟ لا يمكن التراجع عن هذه العملية.')) {
                setMedicalData([]);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="text-lg font-bold">×</span>
            <span className="font-medium">حذف الكل</span>
          </button>
        </div>
      </div>

      {/* البحث البسيط */}
      <SimpleSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في البيانات المرضية (اسم المريض، رقم الهوية، نوع المرض...)"
        resultsCount={filteredMedicalData.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <MedicalDataAdvancedFilter
        filters={filters}
        diseaseTypes={diseaseTypes}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredMedicalData.length}
        isSearching={isSearching}
      />

      {/* جدول البيانات المرضية */}
      <MedicalDataTable
        medicalData={filteredMedicalData}
        onView={handleViewMedicalData}
        onEdit={handleEditMedicalDataClick}
        onDelete={handleDeleteMedicalData}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة بيانات مرضية جديدة */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة بيانات مرضية جديدة"
        size="lg"
      >
        <MedicalDataForm
          guardians={guardians}
          onSubmit={handleAddMedicalData}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل بيانات مرضية */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات المريض: ${selectedMedicalData?.guardianName || ''}`}
        size="lg"
      >
        {selectedMedicalData && (
          <MedicalDataForm
            medicalData={selectedMedicalData}
            guardians={guardians}
            onSubmit={handleEditMedicalData}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل البيانات المرضية */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل المريض: ${selectedMedicalData?.guardianName || ''}`}
        size="lg"
      >
        {selectedMedicalData && (
          <MedicalDataDetails
            medicalData={selectedMedicalData}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};