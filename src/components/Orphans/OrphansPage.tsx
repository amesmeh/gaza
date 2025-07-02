import React, { useState, useEffect } from 'react';
import { Orphan, Martyr } from '../../types';
import { Modal } from '../Common/Modal';
import { OrphanForm } from './OrphanForm';
import { OrphanDetails } from './OrphanDetails';
import { OrphanTable } from './OrphanTable';
import { OrphanAdvancedFilter } from './OrphanAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportOrphansToExcel, createOrphansTemplate, importOrphansFromExcel, exportOrphansErrorsToExcel, downloadExcelFile } from '../../utils/orphansExcelUtils';
import { orphansAPI, martyrsAPI } from '../../services/api';

export const OrphansPage: React.FC = () => {
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const [martyrs, setMartyrs] = useState<Martyr[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredOrphans, setFilteredOrphans] = useState<Orphan[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrphan, setSelectedOrphan] = useState<Orphan | null>(null);
  
  const [filters, setFilters] = useState({
    selectedGender: '',
    selectedHealthStatus: '',
    selectedEducationalStage: '',
    ageRange: { min: '', max: '' },
    birthDateRange: { from: '', to: '' },
    siblingsRange: { min: '', max: '' },
    searchTerm: ''
  });

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [orphansData, martyrsData] = await Promise.all([
          orphansAPI.getAll(),
          martyrsAPI.getAll()
        ]);
        setOrphans(orphansData);
        setMartyrs(martyrsData);
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
      setFilteredOrphans(orphans);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = orphans.filter(orphan => {
        const term = searchTerm.toLowerCase();
        return (
          orphan.name.toLowerCase().includes(term) ||
          orphan.nationalId.includes(term) ||
          (orphan.guardianName && orphan.guardianName.toLowerCase().includes(term)) ||
          (orphan.guardianNationalId && orphan.guardianNationalId.includes(term)) ||
          (orphan.areaName && orphan.areaName.toLowerCase().includes(term))
        );
      });
      
      setFilteredOrphans(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, orphans]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredOrphans(orphans);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...orphans];
      
      // فلترة حسب نطاق العمر
      if (filters.ageRange.min) {
        filtered = filtered.filter(orphan => orphan.age >= parseInt(filters.ageRange.min));
      }
      if (filters.ageRange.max) {
        filtered = filtered.filter(orphan => orphan.age <= parseInt(filters.ageRange.max));
      }
      
      // فلترة حسب نطاق تاريخ الميلاد
      if (filters.birthDateRange.from) {
        filtered = filtered.filter(orphan => new Date(orphan.birthDate) >= new Date(filters.birthDateRange.from));
      }
      if (filters.birthDateRange.to) {
        filtered = filtered.filter(orphan => new Date(orphan.birthDate) <= new Date(filters.birthDateRange.to));
      }
      
      // فلترة حسب البحث العام
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(orphan => 
          orphan.name.toLowerCase().includes(term) ||
          orphan.nationalId.includes(term) ||
          (orphan.guardianName && orphan.guardianName.toLowerCase().includes(term)) ||
          (orphan.areaName && orphan.areaName.toLowerCase().includes(term))
        );
      }
      
      setFilteredOrphans(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, orphans, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedGender || 
           filters.selectedHealthStatus || 
           filters.selectedEducationalStage ||
           filters.ageRange.min || 
           filters.ageRange.max ||
           filters.birthDateRange.from || 
           filters.birthDateRange.to ||
           filters.siblingsRange.min || 
           filters.siblingsRange.max ||
           filters.searchTerm;
  };

  const handleAddOrphan = async (data: Omit<Orphan, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = martyrs.find(m => m._id === data.guardianId);
      
      const orphanData = {
        ...data,
        guardianName: guardian?.guardianName || '',
        guardianNationalId: guardian?.guardianNationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const newOrphan = await orphansAPI.create(orphanData);
      setOrphans(prev => [...prev, newOrphan]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding orphan:', error);
      alert('حدث خطأ أثناء إضافة اليتيم');
    }
  };

  const handleEditOrphan = async (data: Omit<Orphan, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedOrphan?._id) return;
    
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = martyrs.find(m => m._id === data.guardianId);
      
      const orphanData = {
        ...data,
        guardianName: guardian?.guardianName || '',
        guardianNationalId: guardian?.guardianNationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const updatedOrphan = await orphansAPI.update(selectedOrphan._id, orphanData);
      setOrphans(prev => prev.map(orphan => orphan._id === selectedOrphan._id ? updatedOrphan : orphan));
      setIsEditModalOpen(false);
      setSelectedOrphan(null);
    } catch (error) {
      console.error('Error updating orphan:', error);
      alert('حدث خطأ أثناء تحديث اليتيم');
    }
  };

  const handleViewOrphan = (orphan: Orphan) => {
    setSelectedOrphan(orphan);
    setIsViewModalOpen(true);
  };

  const handleEditOrphanClick = (orphan: Orphan) => {
    setSelectedOrphan(orphan);
    setIsEditModalOpen(true);
  };

  const handleDeleteOrphan = async (orphan: Orphan) => {
    if (!orphan._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف اليتيم ${orphan.name}؟`)) {
      try {
        await orphansAPI.delete(orphan._id);
        setOrphans(prev => prev.filter(o => o._id !== orphan._id));
      } catch (error) {
        console.error('Error deleting orphan:', error);
        alert('حدث خطأ أثناء حذف اليتيم');
      }
    }
  };

  const handleBulkDelete = async (orphanIds: string[]) => {
    if (window.confirm(`هل أنت متأكد من حذف ${orphanIds.length} يتيم؟`)) {
      try {
        // حذف واحد تلو الآخر لأن API لا يدعم حذف متعدد
        for (const id of orphanIds) {
          await orphansAPI.delete(id);
        }
        setOrphans(prev => prev.filter(orphan => !orphanIds.includes(orphan._id || '')));
      } catch (error) {
        console.error('Error bulk deleting orphans:', error);
        alert('حدث خطأ أثناء حذف الأيتام');
      }
    }
  };

  const handleInlineEdit = async (orphan: Orphan, field: string, value: any) => {
    if (!orphan._id) return;
    
    try {
      const updatedOrphan = await orphansAPI.update(orphan._id, { [field]: value });
      setOrphans(prev => prev.map(o => o._id === orphan._id ? updatedOrphan : o));
    } catch (error) {
      console.error('Error updating orphan:', error);
      alert('حدث خطأ أثناء تحديث اليتيم');
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedGender: '',
      selectedHealthStatus: '',
      selectedEducationalStage: '',
      ageRange: { min: '', max: '' },
      birthDateRange: { from: '', to: '' },
      siblingsRange: { min: '', max: '' },
      searchTerm: ''
    });
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // استيراد بيانات الأيتام من ملف Excel
  const handleImportOrphans = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validOrphans, errors } = await importOrphansFromExcel(file, martyrs);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportOrphansErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-الأيتام');
      }
      
      if (validOrphans.length > 0) {
        const newOrphans = await Promise.all(
          validOrphans.map(async (orphanData) => {
            const guardian = martyrs.find(m => m._id === orphanData.guardianId);
            const orphanToCreate = {
              ...orphanData,
              guardianName: guardian?.guardianName || '',
              guardianNationalId: guardian?.guardianNationalId || '',
              areaId: guardian?.areaId || '',
              areaName: guardian?.areaName || ''
            };
            return await orphansAPI.create(orphanToCreate);
          })
        );
        
        setOrphans(prev => [...newOrphans, ...prev]);
        alert(`تم استيراد ${newOrphans.length} يتيم بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing orphans:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات الأيتام إلى ملف Excel
  const handleExportOrphans = () => {
    try {
      const workbook = exportOrphansToExcel(filteredOrphans.length > 0 ? filteredOrphans : orphans);
      downloadExcelFile(workbook, 'بيانات-الأيتام');
    } catch (error) {
      console.error('Error exporting orphans:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للأيتام
  const handleDownloadTemplate = () => {
    try {
      const workbook = createOrphansTemplate(martyrs);
      downloadExcelFile(workbook, 'قالب-الأيتام');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
  };

  // الحالات الصحية المتاحة
  const healthStatuses = [
    'جيدة',
    'متوسطة',
    'ضعيفة',
    'سيئة'
  ];

  // المراحل الدراسية المتاحة
  const educationalStages = [
    'روضة',
    'ابتدائي',
    'إعدادي',
    'ثانوي',
    'جامعي',
    'غير متعلم'
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
        <h1 className="text-2xl font-bold text-gray-900">إدارة الأيتام</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة يتيم</span>
            </button>
            <button
              onClick={handleExportOrphans}
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
              onChange={handleImportOrphans}
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
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الأيتام؟ لا يمكن التراجع عن هذه العملية.')) {
                setOrphans([]);
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
        placeholder="البحث في الأيتام (الاسم، رقم الهوية، اسم الشهيد، اسم الوصي...)"
        resultsCount={filteredOrphans.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <OrphanAdvancedFilter
        filters={filters}
        healthStatuses={healthStatuses}
        educationalStages={educationalStages}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredOrphans.length}
        isSearching={isSearching}
      />

      {/* جدول الأيتام */}
      <OrphanTable
        orphans={filteredOrphans}
        onView={handleViewOrphan}
        onEdit={handleEditOrphanClick}
        onDelete={handleDeleteOrphan}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة يتيم جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة يتيم جديد"
        size="xl"
      >
        <OrphanForm
          martyrs={martyrs}
          onSubmit={handleAddOrphan}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل يتيم */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات اليتيم: ${selectedOrphan?.name || ''}`}
        size="xl"
      >
        {selectedOrphan && (
          <OrphanForm
            orphan={selectedOrphan}
            martyrs={martyrs}
            onSubmit={handleEditOrphan}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل اليتيم */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل اليتيم: ${selectedOrphan?.name || ''}`}
        size="xl"
      >
        {selectedOrphan && (
          <OrphanDetails
            orphan={selectedOrphan}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};