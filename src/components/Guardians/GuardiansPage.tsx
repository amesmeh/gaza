import React, { useState, useEffect } from 'react';
import { Guardian, Area, Wife, Child } from '../../types';
import { Modal } from '../Common/Modal';
import { GuardianForm } from './GuardianForm';
import { GuardianDetails } from './GuardianDetails';
import { GuardiansTable } from './GuardiansTable';
import { AdvancedSearchFilter } from './AdvancedSearchFilter';
import { SimpleSearch } from './SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockGuardians, mockAreas, mockWives, mockChildren } from '../../data/mockData';
import { exportGuardiansToExcel, createGuardiansTemplate, importGuardiansFromExcel, exportErrorsToExcel, downloadExcelFile } from '../../utils/excelUtils';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { smartSearch } from '../../utils/smartSearch';

export const GuardiansPage: React.FC = () => {
  const [guardians, setGuardians] = useLocalStorage<Guardian[]>('guardians', mockGuardians);
  const [areas, setAreas] = useLocalStorage<Area[]>('areas', mockAreas);
  const [wives, setWives] = useLocalStorage<Wife[]>('wives', mockWives);
  const [children, setChildren] = useLocalStorage<Child[]>('children', mockChildren);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedArea: '',
    selectedGender: '',
    selectedStatus: '',
    selectedMaritalStatus: '',
    wivesCountRange: { min: '', max: '' },
    familyMembersRange: { min: '', max: '' }
  });

  const { user } = useAuth();

  // محاكاة جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // فلترة البيانات حسب صلاحيات المستخدم
        let guardiansData = [...guardians];
        
        // إذا كان المستخدم مندوب منطقة، قم بفلترة البيانات حسب المنطقة
        if (user?.role === 'representative' && user?.areaId) {
          guardiansData = guardiansData.filter(guardian => guardian.areaId === user.areaId);
        }
        
        // البيانات الآن تُحفظ في localStorage تلقائياً
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, guardians]);

  // فلترة البيانات مع البحث الذكي
  useEffect(() => {
    if (!guardians.length) {
      setFilteredGuardians(guardians);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...guardians];
      
      // البحث الذكي في النص (من حقل البحث البسيط)
      if (searchTerm.trim()) {
        filtered = filtered.filter(guardian => 
          smartSearch(guardian.name, searchTerm) ||
          smartSearch(guardian.nationalId, searchTerm) ||
          smartSearch(guardian.phone, searchTerm) ||
          (guardian.currentJob && smartSearch(guardian.currentJob, searchTerm))
        );
      }
      
      // فلترة حسب الحي
      if (filters.selectedArea) {
        filtered = filtered.filter(guardian => guardian.areaId.toString() === filters.selectedArea);
      }
      
      // فلترة حسب الجنس
      if (filters.selectedGender) {
        filtered = filtered.filter(guardian => guardian.gender === filters.selectedGender);
      }
      
      // فلترة حسب حالة الإقامة
      if (filters.selectedStatus) {
        filtered = filtered.filter(guardian => guardian.residenceStatus === filters.selectedStatus);
      }
      
      // فلترة حسب الحالة الاجتماعية
      if (filters.selectedMaritalStatus) {
        filtered = filtered.filter(guardian => guardian.maritalStatus === filters.selectedMaritalStatus);
      }
      
      // فلترة حسب نطاق عدد الزوجات
      if (filters.wivesCountRange.min) {
        filtered = filtered.filter(guardian => guardian.wivesCount >= parseInt(filters.wivesCountRange.min));
      }
      if (filters.wivesCountRange.max) {
        filtered = filtered.filter(guardian => guardian.wivesCount <= parseInt(filters.wivesCountRange.max));
      }
      
      // فلترة حسب نطاق عدد أفراد العائلة
      if (filters.familyMembersRange.min) {
        filtered = filtered.filter(guardian => guardian.familyMembersCount >= parseInt(filters.familyMembersRange.min));
      }
      if (filters.familyMembersRange.max) {
        filtered = filtered.filter(guardian => guardian.familyMembersCount <= parseInt(filters.familyMembersRange.max));
      }
      
      setFilteredGuardians(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, guardians, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedGender || 
           filters.selectedStatus || 
           filters.selectedMaritalStatus ||
           filters.wivesCountRange.min || 
           filters.wivesCountRange.max ||
           filters.familyMembersRange.min || 
           filters.familyMembersRange.max ||
           filters.searchTerm;
  };

  const handleAddGuardian = (data: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أن ولي الأمر الجديد ينتمي إلى منطقته
    if (user?.role === 'representative' && user?.areaId) {
      data.areaId = user.areaId;
    }
    
    const newGuardian: Guardian = {
      ...data,
      id: Math.max(0, ...guardians.map(g => g.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setGuardians([newGuardian, ...guardians]);
    setIsAddModalOpen(false);
  };

  const handleEditGuardian = (data: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedGuardian) return;
    
    // إذا كان المستخدم مندوب منطقة، تأكد من أن ولي الأمر المعدل ينتمي إلى منطقته
    if (user?.role === 'representative' && user?.areaId) {
      data.areaId = user.areaId;
    }
    
    const updatedGuardian: Guardian = {
      ...data,
      id: selectedGuardian.id,
      createdAt: selectedGuardian.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setGuardians(guardians.map(guardian => 
      guardian.id === selectedGuardian.id ? updatedGuardian : guardian
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewGuardian = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setIsViewModalOpen(true);
  };

  const handleEditGuardianClick = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setIsEditModalOpen(true);
  };

  const handleDeleteGuardian = (guardian: Guardian) => {
    if (window.confirm(`هل أنت متأكد أنك تريد حذف ولي الأمر "${guardian.name}"؟`)) {
      setGuardians(guardians.filter(g => g.id !== guardian.id));
    }
  };

  const handleBulkDelete = (guardianIds: number[]) => {
    if (window.confirm(`هل أنت متأكد أنك تريد حذف ${guardianIds.length} من أولياء الأمور؟`)) {
      setGuardians(guardians.filter(g => !guardianIds.includes(g.id)));
    }
  };

  const handleInlineEdit = (guardian: Guardian, field: string, value: any) => {
    setGuardians(guardians.map(g => 
      g.id === guardian.id ? { ...g, [field]: value, updatedAt: new Date().toISOString() } : g
    ));
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedArea: '',
      selectedGender: '',
      selectedStatus: '',
      selectedMaritalStatus: '',
      wivesCountRange: { min: '', max: '' },
      familyMembersRange: { min: '', max: '' }
    });
    setSearchTerm('');
  };

  const handleImportGuardians = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validGuardians, errors } = await importGuardiansFromExcel(file, areas);
      
      // إذا كان المستخدم مندوب منطقة، تأكد من أن أولياء الأمور المستوردين ينتمون إلى منطقته
      let filteredGuardians = validGuardians;
      if (user?.role === 'representative' && user?.areaId) {
        filteredGuardians = validGuardians.filter(guardian => guardian.areaId === user.areaId);
        
        if (filteredGuardians.length < validGuardians.length) {
          const skippedCount = validGuardians.length - filteredGuardians.length;
          alert(`تم تجاهل ${skippedCount} من أولياء الأمور لأنهم لا ينتمون إلى منطقتك.`);
        }
      }
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-أولياء-الأمور');
      }
      
      if (filteredGuardians.length > 0) {
        const newGuardians = filteredGuardians.map((guardianData, index) => ({
          ...guardianData,
          id: Math.max(0, ...guardians.map(g => g.id)) + index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Guardian[];
        
        setGuardians([...newGuardians, ...guardians]);
        alert(`تم استيراد ${newGuardians.length} ولي أمر بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing guardians:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات أولياء الأمور إلى ملف Excel
  const handleExportGuardians = () => {
    try {
      const workbook = exportGuardiansToExcel(filteredGuardians.length > 0 ? filteredGuardians : guardians);
      downloadExcelFile(workbook, 'بيانات-أولياء-الأمور');
    } catch (error) {
      console.error('Error exporting guardians:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel لأولياء الأمور
  const handleDownloadTemplate = () => {
    try {
      const workbook = createGuardiansTemplate(areas);
      downloadExcelFile(workbook, 'قالب-أولياء-الأمور');
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

  // تصفية المناطق المتاحة للعرض في الفلتر
  const availableAreas = user?.role === 'representative' && user?.areaId
    ? areas.filter(area => area.id === user.areaId)
    : areas;

  // إذا كانت نافذة العرض مفتوحة، اعرض التفاصيل
  if (isViewModalOpen && selectedGuardian) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* شريط التنقل */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  العودة للقائمة
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">تفاصيل ولي الأمر</h1>
                  <p className="text-gray-600 text-sm">عرض كامل بيانات ولي الأمر وعائلته</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEditGuardianClick(selectedGuardian)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteGuardian(selectedGuardian)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  حذف
                </button>
              </div>
            </div>
          </div>

          {/* محتوى التفاصيل */}
          <GuardianDetails
            guardian={{
              ...selectedGuardian,
              area: areas.find(area => area.id === selectedGuardian.areaId)
            }}
            wives={wives.filter(wife => wife.husbandId === selectedGuardian.id)}
            children={children.filter(child => child.guardianId === selectedGuardian.id)}
            onClose={() => setIsViewModalOpen(false)}
            onEditWife={(wife) => alert(`تعديل الزوجة ${wife.name}`)}
            onDeleteWife={(wife) => alert(`حذف الزوجة ${wife.name}`)}
            onAddWife={() => alert('إضافة زوجة جديدة')}
            onEditChild={(child) => alert(`تعديل الابن ${child.name}`)}
            onDeleteChild={(child) => alert(`حذف الابن ${child.name}`)}
            onAddChild={() => alert('إضافة ابن جديد')}
            onViewChild={(child) => alert(`عرض الابن ${child.name}`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* العنوان وأزرار الإجراءات */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة أولياء الأمور</h1>
            <p className="text-gray-600 text-sm">إدارة بيانات أولياء الأمور وعائلاتهم</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* أزرار الإضافة والتصدير */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة ولي أمر</span>
              </button>
              <button
                onClick={handleExportGuardians}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                <span>تصدير Excel</span>
              </button>
            </div>

            {/* زر الاستيراد */}
            <div className="relative">
              <input
                type="file"
                id="importFile"
                accept=".xlsx, .xls"
                onChange={handleImportGuardians}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="importFile"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>استيراد Excel</span>
              </label>
            </div>

            {/* زر تحميل القالب */}
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <FileText className="h-4 w-4" />
              <span>تحميل القالب</span>
            </button>

            {/* زر حذف الكل */}
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع أولياء الأمور؟ لا يمكن التراجع عن هذه العملية.')) {
                  setGuardians([]);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <span className="text-lg font-bold">×</span>
              <span>حذف الكل</span>
            </button>
          </div>
        </div>
      </div>

      {/* البحث البسيط */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <SimpleSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="البحث في أولياء الأمور (الاسم، رقم الهوية، رقم الهاتف...)"
        />
      </div>

      {/* فلاتر البحث المتقدمة */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <AdvancedSearchFilter
          filters={filters}
          areas={availableAreas}
          onFiltersChange={handleFiltersChange}
          onSearch={() => {}}
          onReset={resetFilters}
          isSearching={isSearching}
          disableAreaFilter={user?.role === 'representative'}
        />
      </div>

      {/* جدول أولياء الأمور */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <GuardiansTable
          guardians={filteredGuardians}
          areas={areas}
          onView={handleViewGuardian}
          onEdit={handleEditGuardianClick}
          onDelete={handleDeleteGuardian}
          onBulkDelete={handleBulkDelete}
          onInlineEdit={handleInlineEdit}
        />
      </div>

      {/* نافذة إضافة ولي أمر جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة ولي أمر جديد"
        size="lg"
      >
        <GuardianForm
          areas={availableAreas}
          onSubmit={handleAddGuardian}
          onCancel={() => setIsAddModalOpen(false)}
          disableAreaSelect={user?.role === 'representative'}
          defaultAreaId={user?.role === 'representative' ? user.areaId : undefined}
        />
      </Modal>

      {/* نافذة تعديل ولي أمر */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات ولي الأمر: ${selectedGuardian?.name || ''}`}
        size="lg"
      >
        {selectedGuardian && (
          <GuardianForm
            guardian={selectedGuardian}
            areas={availableAreas}
            onSubmit={handleEditGuardian}
            onCancel={() => setIsEditModalOpen(false)}
            disableAreaSelect={user?.role === 'representative'}
            defaultAreaId={user?.role === 'representative' ? user.areaId : undefined}
          />
        )}
      </Modal>
    </div>
  );
};