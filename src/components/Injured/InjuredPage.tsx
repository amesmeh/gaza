import React, { useState, useEffect } from 'react';
import { Injured, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { InjuredForm } from './InjuredForm';
import { InjuredDetails } from './InjuredDetails';
import { InjuredTable } from './InjuredTable';
import { InjuredAdvancedFilter } from './InjuredAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportInjuredToExcel, createInjuredTemplate, importInjuredFromExcel, exportInjuredErrorsToExcel, downloadExcelFile } from '../../utils/injuredExcelUtils';
import { injuredAPI, guardiansAPI } from '../../services/api';

export const InjuredPage: React.FC = () => {
  const [injured, setInjured] = useState<Injured[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredInjured, setFilteredInjured] = useState<Injured[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInjured, setSelectedInjured] = useState<Injured | null>(null);
  
  const [filters, setFilters] = useState({
    selectedInjuryType: '',
    dateRange: { from: '', to: '' }
  });

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [injuredData, guardiansData] = await Promise.all([
          injuredAPI.getAll(),
          guardiansAPI.getAll()
        ]);
        setInjured(injuredData);
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
      setFilteredInjured(injured);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = injured.filter(injuredPerson => {
        const term = searchTerm.toLowerCase();
        return (
          injuredPerson.name.toLowerCase().includes(term) ||
          injuredPerson.nationalId.includes(term) ||
          (injuredPerson.guardianName && injuredPerson.guardianName.toLowerCase().includes(term)) ||
          (injuredPerson.guardianNationalId && injuredPerson.guardianNationalId.includes(term)) ||
          (injuredPerson.areaName && injuredPerson.areaName.toLowerCase().includes(term)) ||
          (injuredPerson.injuryType && injuredPerson.injuryType.toLowerCase().includes(term))
        );
      });
      
      setFilteredInjured(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, injured]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredInjured(injured);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...injured];
      
      // فلترة حسب نوع الإصابة
      if (filters.selectedInjuryType) {
        filtered = filtered.filter(injuredPerson => injuredPerson.injuryType === filters.selectedInjuryType);
      }
      
      // فلترة حسب نطاق تاريخ الإصابة
      if (filters.dateRange.from) {
        filtered = filtered.filter(injuredPerson => new Date(injuredPerson.injuryDate) >= new Date(filters.dateRange.from));
      }
      if (filters.dateRange.to) {
        filtered = filtered.filter(injuredPerson => new Date(injuredPerson.injuryDate) <= new Date(filters.dateRange.to));
      }
      
      setFilteredInjured(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, injured, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedInjuryType || 
           filters.dateRange.from ||
           filters.dateRange.to;
  };

  const handleAddInjured = async (data: Omit<Injured, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      const injuredData = {
        ...data,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const newInjured = await injuredAPI.create(injuredData);
      setInjured(prev => [...prev, newInjured]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding injured:', error);
      alert('حدث خطأ أثناء إضافة الجريح');
    }
  };

  const handleEditInjured = async (data: Omit<Injured, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedInjured?._id) return;
    
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      const injuredData = {
        ...data,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const updatedInjured = await injuredAPI.update(selectedInjured._id, injuredData);
      setInjured(prev => prev.map(injuredPerson => injuredPerson._id === selectedInjured._id ? updatedInjured : injuredPerson));
      setIsEditModalOpen(false);
      setSelectedInjured(null);
    } catch (error) {
      console.error('Error updating injured:', error);
      alert('حدث خطأ أثناء تحديث الجريح');
    }
  };

  const handleViewInjured = (injuredPerson: Injured) => {
    setSelectedInjured(injuredPerson);
    setIsViewModalOpen(true);
  };

  const handleEditInjuredClick = (injuredPerson: Injured) => {
    setSelectedInjured(injuredPerson);
    setIsEditModalOpen(true);
  };

  const handleDeleteInjured = async (injuredPerson: Injured) => {
    if (!injuredPerson._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف الجريح ${injuredPerson.name}؟`)) {
      try {
        await injuredAPI.delete(injuredPerson._id);
        setInjured(prev => prev.filter(i => i._id !== injuredPerson._id));
      } catch (error) {
        console.error('Error deleting injured:', error);
        alert('حدث خطأ أثناء حذف الجريح');
      }
    }
  };

  const handleBulkDelete = async (injuredIds: string[]) => {
    if (window.confirm(`هل أنت متأكد من حذف ${injuredIds.length} جريح؟`)) {
      try {
        await injuredAPI.deleteMany(injuredIds);
        setInjured(prev => prev.filter(injuredPerson => !injuredIds.includes(injuredPerson._id || '')));
      } catch (error) {
        console.error('Error bulk deleting injured:', error);
        alert('حدث خطأ أثناء حذف الجرحى');
      }
    }
  };

  const handleInlineEdit = async (injuredPerson: Injured, field: string, value: any) => {
    if (!injuredPerson._id) return;
    
    try {
      const updatedInjured = await injuredAPI.update(injuredPerson._id, { [field]: value });
      setInjured(prev => prev.map(i => i._id === injuredPerson._id ? updatedInjured : i));
    } catch (error) {
      console.error('Error updating injured:', error);
      alert('حدث خطأ أثناء تحديث الجريح');
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedInjuryType: '',
      dateRange: { from: '', to: '' }
    });
  };

  // استيراد بيانات الجرحى من ملف Excel
  const handleImportInjured = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validInjured, errors } = await importInjuredFromExcel(file, guardians);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportInjuredErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-الجرحى');
      }
      
      if (validInjured.length > 0) {
        const newInjured = await Promise.all(
          validInjured.map(async (injuredData) => {
            const guardian = guardians.find(g => g._id === injuredData.guardianId);
            const injuredToCreate = {
              ...injuredData,
              guardianName: guardian?.name || '',
              guardianNationalId: guardian?.nationalId || '',
              areaId: guardian?.areaId || '',
              areaName: guardian?.areaName || ''
            };
            return await injuredAPI.create(injuredToCreate);
          })
        );
        
        setInjured(prev => [...newInjured, ...prev]);
        alert(`تم استيراد ${newInjured.length} جريح بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing injured:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات الجرحى إلى ملف Excel
  const handleExportInjured = () => {
    try {
      const workbook = exportInjuredToExcel(filteredInjured.length > 0 ? filteredInjured : injured);
      downloadExcelFile(workbook, 'بيانات-الجرحى');
    } catch (error) {
      console.error('Error exporting injured:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للجرحى
  const handleDownloadTemplate = () => {
    try {
      const workbook = createInjuredTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-الجرحى');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
  };

  // أنواع الإصابات المتاحة
  const injuryTypes = [
    'إصابة خطيرة',
    'إصابة متوسطة',
    'إصابة بسيطة',
    'إصابة بالرأس',
    'إصابة بالأطراف',
    'إصابة بالصدر',
    'إصابة بالبطن',
    'إصابة بالعمود الفقري',
    'إصابة بالعين',
    'حروق',
    'بتر',
    'إصابة أخرى'
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
        <h1 className="text-2xl font-bold text-gray-900">إدارة الجرحى</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة جريح</span>
            </button>
            <button
              onClick={handleExportInjured}
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
              onChange={handleImportInjured}
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
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الجرحى؟ لا يمكن التراجع عن هذه العملية.')) {
                setInjured([]);
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
        placeholder="البحث في الجرحى (الاسم، رقم الهوية، رقم الجوال...)"
        resultsCount={filteredInjured.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <InjuredAdvancedFilter
        filters={filters}
        injuryTypes={injuryTypes}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredInjured.length}
        isSearching={isSearching}
      />

      {/* جدول الجرحى */}
      <InjuredTable
        injured={filteredInjured}
        onView={handleViewInjured}
        onEdit={handleEditInjuredClick}
        onDelete={handleDeleteInjured}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة جريح جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة جريح جديد"
        size="lg"
      >
        <InjuredForm
          guardians={guardians}
          onSubmit={handleAddInjured}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل جريح */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات الجريح: ${selectedInjured?.name || ''}`}
        size="lg"
      >
        {selectedInjured && (
          <InjuredForm
            injured={selectedInjured}
            guardians={guardians}
            onSubmit={handleEditInjured}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل الجريح */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل الجريح: ${selectedInjured?.name || ''}`}
        size="lg"
      >
        {selectedInjured && (
          <InjuredDetails
            injured={selectedInjured}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};