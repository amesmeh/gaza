import React, { useState, useEffect } from 'react';
import { Child, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { ChildForm } from './ChildForm';
import { ChildDetails } from './ChildDetails';
import { ChildrenTable } from './ChildrenTable';
import { ChildrenAdvancedFilter } from './ChildrenAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportChildrenToExcel, createChildrenTemplate, importChildrenFromExcel, exportChildrenErrorsToExcel, downloadExcelFile } from '../../utils/childrenExcelUtils';
import { smartSearch } from '../../utils/smartSearch';
import { childrenAPI, guardiansAPI } from '../../services/api';

export const ChildrenPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  
  const [filters, setFilters] = useState({
    selectedArea: '',
    selectedGuardian: '',
    selectedMaritalStatus: '',
    selectedResidenceStatus: '',
    wivesCountRange: { min: '', max: '' },
    familyMembersRange: { min: '', max: '' },
    birthDateRange: { from: '', to: '' },
    ageRange: { min: '', max: '' }
  });

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [childrenData, guardiansData] = await Promise.all([
          childrenAPI.getAll(),
          guardiansAPI.getAll()
        ]);
        setChildren(childrenData);
        setGuardians(guardiansData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        // إظهار رسالة خطأ للمستخدم
        alert('حدث خطأ في تحميل البيانات. يرجى إعادة تحميل الصفحة.');
      }
    };

    fetchData();
  }, []);

  // تطبيق البحث البسيط
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredChildren(children);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchResults = children.filter(child => {
        return (
          smartSearch(child.name, searchTerm) ||
          smartSearch(child.nationalId, searchTerm) ||
          (child.guardianName && smartSearch(child.guardianName, searchTerm)) ||
          (child.guardianNationalId && smartSearch(child.guardianNationalId, searchTerm)) ||
          (child.areaName && smartSearch(child.areaName, searchTerm))
        );
      });
      setFilteredChildren(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, children]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredChildren(children);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...children];
      
      // فلترة حسب المنطقة
      if (filters.selectedArea) {
        filtered = filtered.filter(child => child.areaId?.toString() === filters.selectedArea);
      }
      
      // فلترة حسب ولي الأمر
      if (filters.selectedGuardian) {
        filtered = filtered.filter(child => child.guardianId.toString() === filters.selectedGuardian);
      }
      
      // فلترة حسب نطاق تاريخ الميلاد
      if (filters.birthDateRange.from) {
        filtered = filtered.filter(child => new Date(child.birthDate) >= new Date(filters.birthDateRange.from));
      }
      if (filters.birthDateRange.to) {
        filtered = filtered.filter(child => new Date(child.birthDate) <= new Date(filters.birthDateRange.to));
      }
      
      // فلترة حسب نطاق العمر
      if (filters.ageRange.min) {
        filtered = filtered.filter(child => child.age >= parseInt(filters.ageRange.min));
      }
      if (filters.ageRange.max) {
        filtered = filtered.filter(child => child.age <= parseInt(filters.ageRange.max));
      }
      
      setFilteredChildren(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, children, searchTerm]);

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedGuardian || 
           filters.selectedMaritalStatus || 
           filters.selectedResidenceStatus ||
           filters.wivesCountRange.min || 
           filters.wivesCountRange.max ||
           filters.familyMembersRange.min || 
           filters.familyMembersRange.max ||
           filters.birthDateRange.from || 
           filters.birthDateRange.to ||
           filters.ageRange.min || 
           filters.ageRange.max;
  };

  const handleAddChild = async (data: Omit<Child, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      // حساب العمر
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const childData = {
        ...data,
        age,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const newChild = await childrenAPI.create(childData);
      setChildren(prev => [...prev, newChild]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding child:', error);
      alert('حدث خطأ أثناء إضافة الابن');
    }
  };

  const handleEditChild = async (data: Omit<Child, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedChild?._id) return;
    
    try {
      // الحصول على بيانات ولي الأمر لتحديث المنطقة
      const guardian = guardians.find(g => g._id === data.guardianId);
      
      // حساب العمر
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const childData = {
        ...data,
        age,
        guardianName: guardian?.name || '',
        guardianNationalId: guardian?.nationalId || '',
        areaId: guardian?.areaId || '',
        areaName: guardian?.areaName || ''
      };

      const updatedChild = await childrenAPI.update(selectedChild._id, childData);
      setChildren(prev => prev.map(child => child._id === selectedChild._id ? updatedChild : child));
      setIsEditModalOpen(false);
      setSelectedChild(null);
    } catch (error) {
      console.error('Error updating child:', error);
      alert('حدث خطأ أثناء تحديث الابن');
    }
  };

  const handleViewChild = (child: Child) => {
    setSelectedChild(child);
    setIsViewModalOpen(true);
  };

  const handleEditChildClick = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };

  const handleDeleteChild = async (child: Child) => {
    if (!child._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف الابن ${child.name}؟`)) {
      try {
        await childrenAPI.delete(child._id);
        setChildren(prev => prev.filter(c => c._id !== child._id));
      } catch (error) {
        console.error('Error deleting child:', error);
        alert('حدث خطأ أثناء حذف الابن');
      }
    }
  };

  const handleBulkDelete = async (childIds: string[]) => {
    if (window.confirm(`هل أنت متأكد من حذف ${childIds.length} ابن؟`)) {
      try {
        await childrenAPI.deleteMany(childIds);
        setChildren(prev => prev.filter(child => !childIds.includes(child._id || '')));
      } catch (error) {
        console.error('Error bulk deleting children:', error);
        alert('حدث خطأ أثناء حذف الأبناء');
      }
    }
  };

  const handleInlineEdit = async (child: Child, field: string, value: any) => {
    if (!child._id) return;
    
    try {
      const updatedChild = await childrenAPI.update(child._id, { [field]: value });
      setChildren(prev => prev.map(c => c._id === child._id ? updatedChild : c));
    } catch (error) {
      console.error('Error updating child:', error);
      alert('حدث خطأ أثناء تحديث الابن');
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      selectedArea: '',
      selectedGuardian: '',
      selectedMaritalStatus: '',
      selectedResidenceStatus: '',
      wivesCountRange: { min: '', max: '' },
      familyMembersRange: { min: '', max: '' },
      birthDateRange: { from: '', to: '' },
      ageRange: { min: '', max: '' }
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

  // استيراد بيانات الأبناء من ملف Excel
  const handleImportChildren = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validChildren, errors } = await importChildrenFromExcel(file, guardians);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportChildrenErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-الأبناء');
      }
      
      if (validChildren.length > 0) {
        const newChildren = await Promise.all(
          validChildren.map(async (childData) => {
            const guardian = guardians.find(g => g._id === childData.guardianId);
            const childToCreate = {
              ...childData,
              age: calculateAge(childData.birthDate as string),
              guardianName: guardian?.name || '',
              guardianNationalId: guardian?.nationalId || '',
              areaId: guardian?.areaId || '',
              areaName: guardian?.areaName || ''
            };
            return await childrenAPI.create(childToCreate);
          })
        );
        
        setChildren(prev => [...newChildren, ...prev]);
        alert(`تم استيراد ${newChildren.length} ابن بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing children:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات الأبناء إلى ملف Excel
  const handleExportChildren = () => {
    try {
      const workbook = exportChildrenToExcel(filteredChildren.length > 0 ? filteredChildren : children);
      downloadExcelFile(workbook, 'بيانات-الأبناء');
    } catch (error) {
      console.error('Error exporting children:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للأبناء
  const handleDownloadTemplate = () => {
    try {
      const workbook = createChildrenTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-الأبناء');
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
    <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* العنوان وأزرار الإجراءات */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة الأبناء</h1>
            <p className="text-gray-600 text-sm">إدارة بيانات الأبناء وعائلاتهم</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* أزرار الإضافة والتصدير */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة ابن</span>
              </button>
              <button
                onClick={handleExportChildren}
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
                onChange={handleImportChildren}
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
              onClick={async () => {
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الأبناء؟ لا يمكن التراجع عن هذه العملية.')) {
                  try {
                    const allChildIds = children.map(child => child._id || '').filter(id => id);
                    if (allChildIds.length > 0) {
                      await childrenAPI.deleteMany(allChildIds);
                      setChildren([]);
                      alert('تم حذف جميع الأبناء بنجاح');
                    }
                  } catch (error) {
                    console.error('Error deleting all children:', error);
                    alert('حدث خطأ أثناء حذف جميع الأبناء');
                  }
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <span className="text-lg font-bold">×</span>
              <span>حذف الكل</span>
            </button>

            {/* زر إعادة تعيين البيانات */}
            <button
              onClick={() => {
                if (window.confirm('هل تريد إعادة تعيين بيانات الأبناء؟')) {
                  fetchData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <span className="text-lg font-bold">↻</span>
              <span>إعادة تحميل البيانات</span>
            </button>
          </div>
        </div>
      </div>

      {/* البحث البسيط */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <SimpleSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="البحث في الأبناء (الاسم، رقم الهوية، اسم ولي الأمر...)"
        />
      </div>

      {/* فلاتر البحث المتقدمة */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <ChildrenAdvancedFilter
          filters={filters}
          areas={[]}
          guardians={guardians}
          onFiltersChange={handleFiltersChange}
          onSearch={() => {}}
          onReset={resetFilters}
          isSearching={isSearching}
        />
      </div>

      {/* جدول الأبناء */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <ChildrenTable
          children={filteredChildren}
          guardians={guardians}
          onView={handleViewChild}
          onEdit={handleEditChildClick}
          onDelete={handleDeleteChild}
          onBulkDelete={handleBulkDelete}
          onInlineEdit={handleInlineEdit}
        />
      </div>

      {/* نافذة إضافة ابن جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة ابن جديد"
        size="lg"
      >
        <ChildForm
          guardians={guardians}
          onSubmit={handleAddChild}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل ابن */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات الابن: ${selectedChild?.name || ''}`}
        size="lg"
      >
        {selectedChild && (
          <ChildForm
            child={selectedChild}
            guardians={guardians}
            onSubmit={handleEditChild}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل الابن */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل الابن: ${selectedChild?.name || ''}`}
        size="lg"
      >
        {selectedChild && (
          <ChildDetails
            child={selectedChild}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};