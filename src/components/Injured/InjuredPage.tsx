import React, { useState, useEffect } from 'react';
import { Injured, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { InjuredForm } from './InjuredForm';
import { InjuredDetails } from './InjuredDetails';
import { InjuredTable } from './InjuredTable';
import { InjuredAdvancedFilter } from './InjuredAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockInjured, mockGuardians } from '../../data/mockData';
import { exportInjuredToExcel, createInjuredTemplate, importInjuredFromExcel, exportInjuredErrorsToExcel, downloadExcelFile } from '../../utils/injuredExcelUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const InjuredPage: React.FC = () => {
  const [injured, setInjured] = useLocalStorage<Injured[]>('injured', mockInjured);
  const [guardians, setGuardians] = useLocalStorage<Guardian[]>('guardians', mockGuardians);
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
          injuredPerson.phone.includes(term) ||
          injuredPerson.injuryType.toLowerCase().includes(term) ||
          (injuredPerson.notes && injuredPerson.notes.toLowerCase().includes(term))
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

  const handleAddInjured = (data: Omit<Injured, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInjured: Injured = {
      ...data,
      id: Math.max(0, ...injured.map(i => i.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setInjured([newInjured, ...injured]);
    setIsAddModalOpen(false);
  };

  const handleEditInjured = (data: Omit<Injured, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedInjured) return;
    
    const updatedInjured: Injured = {
      ...data,
      id: selectedInjured.id,
      createdAt: selectedInjured.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setInjured(injured.map(injuredPerson => 
      injuredPerson.id === selectedInjured.id ? updatedInjured : injuredPerson
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewInjured = (injuredPerson: Injured) => {
    setSelectedInjured(injuredPerson);
    setIsViewModalOpen(true);
  };

  const handleEditInjuredClick = (injuredPerson: Injured) => {
    setSelectedInjured(injuredPerson);
    setIsEditModalOpen(true);
  };

  const handleDeleteInjured = (injuredPerson: Injured) => {
    if (window.confirm(`هل أنت متأكد من حذف الجريح ${injuredPerson.name}؟`)) {
      setInjured(injured.filter(i => i.id !== injuredPerson.id));
    }
  };

  const handleBulkDelete = (injuredIds: number[]) => {
    setInjured(injured.filter(injuredPerson => !injuredIds.includes(injuredPerson.id)));
  };

  const handleInlineEdit = (injuredPerson: Injured, field: string, value: any) => {
    const updatedInjured = injured.map(i => {
      if (i.id === injuredPerson.id) {
        return { ...i, [field]: value, updatedAt: new Date().toISOString() };
      }
      return i;
    });
    
    setInjured(updatedInjured);
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
        const newInjured = validInjured.map((injuredData, index) => ({
          ...injuredData,
          id: Math.max(0, ...injured.map(i => i.id)) + index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Injured[];
        
        setInjured([...newInjured, ...injured]);
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