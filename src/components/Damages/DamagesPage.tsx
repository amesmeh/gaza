import React, { useState, useEffect } from 'react';
import { Damage, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { DamageForm } from './DamageForm';
import { DamageDetails } from './DamageDetails';
import { DamageTable } from './DamageTable';
import { DamageAdvancedFilter } from './DamageAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockDamages, mockGuardians, mockAreas } from '../../data/mockData';
import { exportDamagesToExcel, createDamagesTemplate, importDamagesFromExcel, exportDamagesErrorsToExcel, downloadExcelFile } from '../../utils/damagesExcelUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const DamagesPage: React.FC = () => {
  const [damages, setDamages] = useLocalStorage<Damage[]>('damages', mockDamages);
  const [guardians, setGuardians] = useLocalStorage<Guardian[]>('guardians', mockGuardians);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredDamages, setFilteredDamages] = useState<Damage[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState<Damage | null>(null);
  
  const [filters, setFilters] = useState({
    selectedArea: '',
    selectedDamageType: '',
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

  // تطبيق البحث البسيط
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDamages(damages);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = damages.filter(damage => {
        const term = searchTerm.toLowerCase();
        return (
          (damage.guardianName && damage.guardianName.toLowerCase().includes(term)) ||
          damage.guardianNationalId.includes(term) ||
          (damage.guardianPhone && damage.guardianPhone.includes(term)) ||
          (damage.areaName && damage.areaName.toLowerCase().includes(term)) ||
          damage.damageType.includes(term) ||
          (damage.notes && damage.notes.toLowerCase().includes(term))
        );
      });
      
      setFilteredDamages(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, damages]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredDamages(damages);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...damages];
      
      // فلترة حسب المنطقة
      if (filters.selectedArea) {
        filtered = filtered.filter(damage => damage.areaId?.toString() === filters.selectedArea);
      }
      
      // فلترة حسب نوع الضرر
      if (filters.selectedDamageType) {
        filtered = filtered.filter(damage => damage.damageType === filters.selectedDamageType);
      }
      
      // فلترة حسب البحث العام
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(damage => 
          (damage.guardianName && damage.guardianName.toLowerCase().includes(term)) ||
          damage.guardianNationalId.includes(term) ||
          (damage.guardianPhone && damage.guardianPhone.includes(term)) ||
          (damage.notes && damage.notes.toLowerCase().includes(term))
        );
      }
      
      setFilteredDamages(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, damages, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedDamageType || 
           filters.searchTerm;
  };

  const handleAddDamage = (data: Omit<Damage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDamage: Damage = {
      ...data,
      id: Math.max(0, ...damages.map(d => d.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDamages([newDamage, ...damages]);
    setIsAddModalOpen(false);
  };

  const handleEditDamage = (data: Omit<Damage, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedDamage) return;
    
    const updatedDamage: Damage = {
      ...data,
      id: selectedDamage.id,
      createdAt: selectedDamage.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setDamages(damages.map(damage => 
      damage.id === selectedDamage.id ? updatedDamage : damage
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewDamage = (damage: Damage) => {
    setSelectedDamage(damage);
    setIsViewModalOpen(true);
  };

  const handleEditDamageClick = (damage: Damage) => {
    setSelectedDamage(damage);
    setIsEditModalOpen(true);
  };

  const handleDeleteDamage = (damage: Damage) => {
    if (window.confirm(`هل أنت متأكد من حذف سجل الضرر لـ ${damage.guardianName || damage.guardianNationalId}؟`)) {
      setDamages(damages.filter(d => d.id !== damage.id));
    }
  };

  const handleBulkDelete = (damageIds: number[]) => {
    setDamages(damages.filter(damage => !damageIds.includes(damage.id)));
  };

  const handleInlineEdit = (damage: Damage, field: string, value: any) => {
    const updatedDamages = damages.map(d => {
      if (d.id === damage.id) {
        return { ...d, [field]: value, updatedAt: new Date().toISOString() };
      }
      return d;
    });
    
    setDamages(updatedDamages);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedArea: '',
      selectedDamageType: '',
      searchTerm: ''
    });
  };

  // استيراد بيانات أصحاب الأضرار من ملف Excel
  const handleImportDamages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validDamages, errors } = await importDamagesFromExcel(file, guardians);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportDamagesErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-أصحاب-الأضرار');
      }
      
      if (validDamages.length > 0) {
        const newDamages = validDamages.map((damageData, index) => ({
          ...damageData,
          id: Math.max(0, ...damages.map(d => d.id)) + index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Damage[];
        
        setDamages([...newDamages, ...damages]);
        alert(`تم استيراد ${newDamages.length} سجل ضرر بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing damages:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات أصحاب الأضرار إلى ملف Excel
  const handleExportDamages = () => {
    try {
      const workbook = exportDamagesToExcel(filteredDamages.length > 0 ? filteredDamages : damages);
      downloadExcelFile(workbook, 'بيانات-أصحاب-الأضرار');
    } catch (error) {
      console.error('Error exporting damages:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel لأصحاب الأضرار
  const handleDownloadTemplate = () => {
    try {
      const workbook = createDamagesTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-أصحاب-الأضرار');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الأضرار</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة ضرر</span>
            </button>
            <button
              onClick={handleExportDamages}
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
              onChange={handleImportDamages}
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
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الأضرار؟ لا يمكن التراجع عن هذه العملية.')) {
                setDamages([]);
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
        placeholder="البحث في أصحاب الأضرار (الاسم، رقم الهوية، رقم الجوال...)"
        resultsCount={filteredDamages.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <DamageAdvancedFilter
        filters={filters}
        areas={mockAreas}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredDamages.length}
        isSearching={isSearching}
      />

      {/* جدول أصحاب الأضرار */}
      <DamageTable
        damages={filteredDamages}
        onView={handleViewDamage}
        onEdit={handleEditDamageClick}
        onDelete={handleDeleteDamage}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة سجل ضرر جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة سجل ضرر جديد"
        size="lg"
      >
        <DamageForm
          guardians={guardians}
          onSubmit={handleAddDamage}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل سجل ضرر */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل سجل ضرر: ${selectedDamage?.guardianName || selectedDamage?.guardianNationalId || ''}`}
        size="lg"
      >
        {selectedDamage && (
          <DamageForm
            damage={selectedDamage}
            guardians={guardians}
            onSubmit={handleEditDamage}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل سجل ضرر */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل سجل ضرر: ${selectedDamage?.guardianName || selectedDamage?.guardianNationalId || ''}`}
        size="lg"
      >
        {selectedDamage && (
          <DamageDetails
            damage={selectedDamage}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};