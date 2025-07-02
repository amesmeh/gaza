<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { Child, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { ChildForm } from './ChildForm';
import { ChildDetails } from './ChildDetails';
import { ChildrenTable } from './ChildrenTable';
import { ChildrenAdvancedFilter } from './ChildrenAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockChildren, mockGuardians, mockAreas } from '../../data/mockData';
import { exportChildrenToExcel, createChildrenTemplate, importChildrenFromExcel, exportChildrenErrorsToExcel, downloadExcelFile } from '../../utils/childrenExcelUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { smartSearch } from '../../utils/smartSearch';

export const ChildrenPage: React.FC = () => {
  const [children, setChildren] = useLocalStorage<Child[]>('children', mockChildren);
  const [guardians, setGuardians] = useLocalStorage<Guardian[]>('guardians', mockGuardians);
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

  // عند تحميل البيانات أو تحديثها، اربط المنطقة من ولي الأمر إذا لم تكن موجودة
  useEffect(() => {
    setChildren(prevChildren => prevChildren.map(child => {
      if (!child.areaId || !child.areaName) {
        const guardian = guardians.find(g => g.id === child.guardianId);
        if (guardian) {
          return {
            ...child,
            areaId: guardian.areaId,
            areaName: guardian.area?.name || guardian.areaName || ''
          };
        }
      }
      return child;
    }));
  }, [guardians]);

  // تحميل بيانات أولياء الأمور مع areaName
  useEffect(() => {
    setGuardians(prevGuardians => prevGuardians.map(g => ({
      ...g,
      areaName: g.areaName || g.area?.name || ''
    })));
  }, []);

  // دالة لإعادة تعيين البيانات الوهمية مع معلومات المنطقة
  const resetChildrenData = () => {
    const updatedChildren = mockChildren.map(child => {
      const guardian = guardians.find(g => g.id === child.guardianId);
      if (guardian) {
        return {
          ...child,
          areaId: guardian.areaId,
          areaName: guardian.areaName || ''
        };
      }
      return child;
    });
    setChildren(updatedChildren);
  };

  // إعادة تعيين البيانات عند التحميل الأول
  useEffect(() => {
    if (children.length === 0) {
      resetChildrenData();
    }
  }, [guardians]);

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

  const handleAddChild = (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'age'>) => {
    // الحصول على بيانات ولي الأمر لتحديث المنطقة
    const guardian = guardians.find(g => g.id === data.guardianId);
    
    // حساب العمر
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const newChild: Child = {
      ...data,
      id: Math.max(0, ...children.map(c => c.id)) + 1,
      age,
      areaId: guardian?.areaId || 0,
      areaName: guardian?.area?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // تحديث عدد الأبناء لولي الأمر
    const updatedGuardians = guardians.map(g => {
      if (g.id === data.guardianId) {
        return {
          ...g,
          childrenCount: g.childrenCount + 1,
          familyMembersCount: g.familyMembersCount + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    
    setChildren([newChild, ...children]);
    setGuardians(updatedGuardians);
    setIsAddModalOpen(false);
  };

  const handleEditChild = (data: Omit<Child, 'id' | 'createdAt' | 'updatedAt' | 'age'>) => {
    if (!selectedChild) return;
    
    // الحصول على بيانات ولي الأمر لتحديث المنطقة
    const guardian = guardians.find(g => g.id === data.guardianId);
    
    const updatedChild: Child = {
      ...data,
      id: selectedChild.id,
      age: calculateAge(data.birthDate),
      areaId: guardian?.areaId || 0,
      areaName: guardian?.area?.name || '',
      createdAt: selectedChild.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // إذا تغير ولي الأمر، نحدث عدد الأبناء للوليين القديم والجديد
    if (selectedChild.guardianId !== data.guardianId) {
      const updatedGuardians = guardians.map(guardian => {
        if (guardian.id === selectedChild.guardianId) {
          return {
            ...guardian,
            childrenCount: Math.max(0, guardian.childrenCount - 1),
            familyMembersCount: Math.max(1, guardian.familyMembersCount - 1),
            updatedAt: new Date().toISOString()
          };
        }
        if (guardian.id === data.guardianId) {
          return {
            ...guardian,
            childrenCount: guardian.childrenCount + 1,
            familyMembersCount: guardian.familyMembersCount + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return guardian;
      });
      
      setGuardians(updatedGuardians);
    }
    
    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewChild = (child: Child) => {
    setSelectedChild(child);
    setIsViewModalOpen(true);
  };

  const handleEditChildClick = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };

  const handleDeleteChild = (child: Child) => {
    if (window.confirm(`هل أنت متأكد من حذف الابن ${child.name}؟`)) {
      // تحديث عدد الأبناء لولي الأمر
      const updatedGuardians = guardians.map(guardian => {
        if (guardian.id === child.guardianId) {
          return {
            ...guardian,
            childrenCount: Math.max(0, guardian.childrenCount - 1),
            familyMembersCount: Math.max(1, guardian.familyMembersCount - 1),
            updatedAt: new Date().toISOString()
          };
        }
        return guardian;
      });
      
      setChildren(children.filter(c => c.id !== child.id));
      setGuardians(updatedGuardians);
    }
  };

  const handleBulkDelete = (childIds: number[]) => {
    // تحديث عدد الأبناء لأولياء الأمور
    const childrenToDelete = children.filter(child => childIds.includes(child.id));
    const guardianIds = new Set(childrenToDelete.map(child => child.guardianId));
    
    const updatedGuardians = guardians.map(guardian => {
      if (guardianIds.has(guardian.id)) {
        const deletedChildrenCount = childrenToDelete.filter(child => child.guardianId === guardian.id).length;
        return {
          ...guardian,
          childrenCount: Math.max(0, guardian.childrenCount - deletedChildrenCount),
          familyMembersCount: Math.max(1, guardian.familyMembersCount - deletedChildrenCount),
          updatedAt: new Date().toISOString()
        };
      }
      return guardian;
    });
    
    setChildren(children.filter(child => !childIds.includes(child.id)));
    setGuardians(updatedGuardians);
  };

  const handleInlineEdit = (child: Child, field: string, value: any) => {
    const updatedChildren = children.map(c => {
      if (c.id === child.id) {
        return { ...c, [field]: value, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    
    setChildren(updatedChildren);
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
        const newChildren = validChildren.map((childData, index) => ({
          ...childData,
          id: Math.max(0, ...children.map(c => c.id)) + index + 1,
          age: calculateAge(childData.birthDate as string),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Child[];
        
        // تحديث عدد الأبناء لأولياء الأمور
        const guardianIds = new Set(newChildren.map(child => child.guardianId));
        const updatedGuardians = guardians.map(guardian => {
          if (guardianIds.has(guardian.id)) {
            const newChildrenCount = newChildren.filter(child => child.guardianId === guardian.id).length;
            return {
              ...guardian,
              childrenCount: guardian.childrenCount + newChildrenCount,
              familyMembersCount: guardian.familyMembersCount + newChildrenCount,
              updatedAt: new Date().toISOString()
            };
          }
          return guardian;
        });
        
        setChildren([...newChildren, ...children]);
        setGuardians(updatedGuardians);
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
              onClick={() => {
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الأبناء؟ لا يمكن التراجع عن هذه العملية.')) {
                  setChildren([]);
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
                if (window.confirm('هل تريد إعادة تعيين بيانات الأبناء بالبيانات الوهمية مع معلومات المنطقة؟')) {
                  const updatedChildren = mockChildren.map(child => {
                    const guardian = guardians.find(g => g.id === child.guardianId);
                    if (guardian) {
                      return {
                        ...child,
                        areaId: guardian.areaId,
                        areaName: guardian.areaName || ''
                      };
                    }
                    return child;
                  });
                  setChildren(updatedChildren);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
            >
              <span className="text-lg font-bold">↻</span>
              <span>إعادة تعيين البيانات</span>
            </button>

            {/* زر إعادة تعيين أولياء الأمور */}
            <button
              onClick={() => {
                if (window.confirm('هل تريد إعادة تعيين أولياء الأمور للبيانات الافتراضية؟')) {
                  setGuardians(mockGuardians.map(g => ({
                    ...g,
                    areaName: g.areaName || g.area?.name || ''
                  })));
                  alert('تمت إعادة تعيين أولياء الأمور! سيتم إعادة تحميل الصفحة الآن.');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 font-semibold text-sm mb-4"
            >
              إعادة تعيين أولياء الأمور (مؤقت)
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
          areas={mockAreas}
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
>>>>>>> 3ca27ee0dc3d217772a37de8e9a8ccde9127f7e0
};