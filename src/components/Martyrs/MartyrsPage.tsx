import React, { useState, useEffect } from 'react';
import { Martyr } from '../../types';
import { Modal } from '../Common/Modal';
import { MartyrForm } from './MartyrForm';
import { MartyrDetails } from './MartyrDetails';
import { MartyrsTable } from './MartyrsTable';
import { MartyrsAdvancedFilter } from './MartyrsAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockMartyrs } from '../../data/mockData';
import { exportMartyrsToExcel, createMartyrsTemplate, importMartyrsFromExcel, exportMartyrsErrorsToExcel, downloadExcelFile } from '../../utils/martyrsExcelUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const MartyrsPage: React.FC = () => {
  const [martyrs, setMartyrs] = useLocalStorage<Martyr[]>('martyrs', mockMartyrs);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMartyrs, setFilteredMartyrs] = useState<Martyr[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMartyr, setSelectedMartyr] = useState<Martyr | null>(null);
  
  const [filters, setFilters] = useState({
    selectedRelationship: '',
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
      setFilteredMartyrs(martyrs);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = martyrs.filter(martyr => {
        const term = searchTerm.toLowerCase();
        return (
          martyr.name.toLowerCase().includes(term) ||
          martyr.nationalId.includes(term) ||
          martyr.agentName.toLowerCase().includes(term) ||
          martyr.agentNationalId.includes(term) ||
          martyr.agentPhone.includes(term) ||
          martyr.relationshipToMartyr.toLowerCase().includes(term)
        );
      });
      
      setFilteredMartyrs(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, martyrs]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredMartyrs(martyrs);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...martyrs];
      
      // فلترة حسب صلة القرابة
      if (filters.selectedRelationship) {
        filtered = filtered.filter(martyr => martyr.relationshipToMartyr === filters.selectedRelationship);
      }
      
      // فلترة حسب نطاق تاريخ الاستشهاد
      if (filters.dateRange.from) {
        filtered = filtered.filter(martyr => new Date(martyr.martyrdomDate) >= new Date(filters.dateRange.from));
      }
      if (filters.dateRange.to) {
        filtered = filtered.filter(martyr => new Date(martyr.martyrdomDate) <= new Date(filters.dateRange.to));
      }
      
      setFilteredMartyrs(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, martyrs, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedRelationship || 
           filters.dateRange.from ||
           filters.dateRange.to;
  };

  const handleAddMartyr = (data: Omit<Martyr, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMartyr: Martyr = {
      ...data,
      id: Math.max(0, ...martyrs.map(m => m.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setMartyrs([newMartyr, ...martyrs]);
    setIsAddModalOpen(false);
  };

  const handleEditMartyr = (data: Omit<Martyr, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedMartyr) return;
    
    const updatedMartyr: Martyr = {
      ...data,
      id: selectedMartyr.id,
      createdAt: selectedMartyr.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setMartyrs(martyrs.map(martyr => 
      martyr.id === selectedMartyr.id ? updatedMartyr : martyr
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewMartyr = (martyr: Martyr) => {
    setSelectedMartyr(martyr);
    setIsViewModalOpen(true);
  };

  const handleEditMartyrClick = (martyr: Martyr) => {
    setSelectedMartyr(martyr);
    setIsEditModalOpen(true);
  };

  const handleDeleteMartyr = (martyr: Martyr) => {
    if (window.confirm(`هل أنت متأكد من حذف الشهيد ${martyr.name}؟`)) {
      setMartyrs(martyrs.filter(m => m.id !== martyr.id));
    }
  };

  const handleBulkDelete = (martyrIds: number[]) => {
    setMartyrs(martyrs.filter(martyr => !martyrIds.includes(martyr.id)));
  };

  const handleInlineEdit = (martyr: Martyr, field: string, value: any) => {
    const updatedMartyrs = martyrs.map(m => {
      if (m.id === martyr.id) {
        return { ...m, [field]: value, updatedAt: new Date().toISOString() };
      }
      return m;
    });
    
    setMartyrs(updatedMartyrs);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedRelationship: '',
      dateRange: { from: '', to: '' }
    });
  };

  // استيراد بيانات الشهداء من ملف Excel
  const handleImportMartyrs = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validMartyrs, errors } = await importMartyrsFromExcel(file);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportMartyrsErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-الشهداء');
      }
      
      if (validMartyrs.length > 0) {
        const newMartyrs = validMartyrs.map((martyrData, index) => ({
          ...martyrData,
          id: Math.max(0, ...martyrs.map(m => m.id)) + index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Martyr[];
        
        setMartyrs([...newMartyrs, ...martyrs]);
        alert(`تم استيراد ${newMartyrs.length} شهيد بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing martyrs:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات الشهداء إلى ملف Excel
  const handleExportMartyrs = () => {
    try {
      const workbook = exportMartyrsToExcel(filteredMartyrs.length > 0 ? filteredMartyrs : martyrs);
      downloadExcelFile(workbook, 'بيانات-الشهداء');
    } catch (error) {
      console.error('Error exporting martyrs:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للشهداء
  const handleDownloadTemplate = () => {
    try {
      const workbook = createMartyrsTemplate();
      downloadExcelFile(workbook, 'قالب-الشهداء');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
  };

  // صلات القرابة المتاحة
  const relationships = [
    'والد', 'والدة', 'زوج', 'زوجة', 'ابن', 'ابنة', 'أخ', 'أخت',
    'عم', 'عمة', 'خال', 'خالة', 'جد', 'جدة', 'حفيد', 'حفيدة',
    'صديق', 'قريب', 'أخرى'
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
        <h1 className="text-2xl font-bold text-gray-900">إدارة الشهداء</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة شهيد</span>
            </button>
            <button
              onClick={handleExportMartyrs}
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
              onChange={handleImportMartyrs}
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
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الشهداء؟ لا يمكن التراجع عن هذه العملية.')) {
                setMartyrs([]);
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
        placeholder="البحث في الشهداء (الاسم، رقم الهوية، اسم الوكيل...)"
        resultsCount={filteredMartyrs.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <MartyrsAdvancedFilter
        filters={filters}
        relationships={relationships}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredMartyrs.length}
        isSearching={isSearching}
      />

      {/* جدول الشهداء */}
      <MartyrsTable
        martyrs={filteredMartyrs}
        onView={handleViewMartyr}
        onEdit={handleEditMartyrClick}
        onDelete={handleDeleteMartyr}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة شهيد جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة شهيد جديد"
        size="lg"
      >
        <MartyrForm
          onSubmit={handleAddMartyr}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل شهيد */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات الشهيد: ${selectedMartyr?.name || ''}`}
        size="lg"
      >
        {selectedMartyr && (
          <MartyrForm
            martyr={selectedMartyr}
            onSubmit={handleEditMartyr}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل الشهيد */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل الشهيد: ${selectedMartyr?.name || ''}`}
        size="lg"
      >
        {selectedMartyr && (
          <MartyrDetails
            martyr={selectedMartyr}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};