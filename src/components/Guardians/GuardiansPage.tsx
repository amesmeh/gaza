import React, { useState, useEffect } from 'react';
import { Guardian, Area, Wife, Child } from '../../types';
import { Modal } from '../Common/Modal';
import { GuardianForm } from './GuardianForm';
import { GuardianDetails } from './GuardianDetails';
import { GuardiansTable } from './GuardiansTable';
import { AdvancedSearchFilter } from './AdvancedSearchFilter';
import { SimpleSearch } from './SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportGuardiansToExcel, createGuardiansTemplate, importGuardiansFromExcel, exportErrorsToExcel, downloadExcelFile } from '../../utils/excelUtils';
import { useAuth } from '../../context/AuthContext';
import { smartSearch } from '../../utils/smartSearch';
import { guardiansAPI, areasAPI, Guardian as GuardianFromAPI, Area as AreaFromAPI } from '../../services/api';

export const GuardiansPage: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [wives, setWives] = useState<Wife[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  const [error, setError] = useState<string | null>(null);
  
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

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // جلب أولياء الأمور والمناطق من قاعدة البيانات
        const [guardiansData, areasData] = await Promise.all([
          guardiansAPI.getAll(),
          areasAPI.getAll()
        ]);
        
        // تحويل بيانات أولياء الأمور من API إلى التنسيق المطلوب
        const convertedGuardians: Guardian[] = guardiansData.map((guardian: GuardianFromAPI) => ({
          id: parseInt(guardian._id?.slice(-6) || '0', 16),
          name: guardian.name,
          nationalId: guardian.nationalId,
          phone: guardian.phone,
          gender: guardian.gender,
          maritalStatus: guardian.maritalStatus,
          childrenCount: guardian.childrenCount,
          wivesCount: guardian.wivesCount,
          familyMembersCount: guardian.familyMembersCount,
          currentJob: guardian.currentJob,
          residenceStatus: guardian.residenceStatus,
          originalGovernorate: guardian.originalGovernorate,
          originalCity: guardian.originalCity,
          displacementAddress: guardian.displacementAddress,
          areaId: parseInt(guardian.areaId || '0'),
          createdAt: guardian.createdAt || new Date().toISOString(),
          updatedAt: guardian.updatedAt || new Date().toISOString()
        }));
        
        // تحويل بيانات المناطق من API إلى التنسيق المطلوب
        const convertedAreas: Area[] = areasData.map((area: AreaFromAPI) => ({
          id: parseInt(area._id?.slice(-6) || '0', 16),
          name: area.name,
          representativeName: area.representativeName || '',
          representativeId: area.representativeId || '',
          representativePhone: area.representativePhone || '',
          createdAt: area.createdAt || new Date().toISOString(),
          updatedAt: area.updatedAt || new Date().toISOString(),
          guardiansCount: convertedGuardians.filter(g => g.areaId === parseInt(area._id?.slice(-6) || '0', 16)).length
        }));
        
        // فلترة البيانات حسب صلاحيات المستخدم
        let filteredGuardiansData = [...convertedGuardians];
        let filteredAreasData = [...convertedAreas];
        
        // إذا كان المستخدم مندوب منطقة، قم بفلترة البيانات حسب المنطقة
        if (user?.role === 'representative' && user?.areaId) {
          filteredGuardiansData = filteredGuardiansData.filter(guardian => guardian.areaId === user.areaId);
          filteredAreasData = filteredAreasData.filter(area => area.id === user.areaId);
        }
        
        setGuardians(filteredGuardiansData);
        setAreas(filteredAreasData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('فشل في جلب البيانات من قاعدة البيانات');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const handleAddGuardian = async (data: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // إذا كان المستخدم مندوب منطقة، تأكد من أن ولي الأمر الجديد ينتمي إلى منطقته
      if (user?.role === 'representative' && user?.areaId) {
        data.areaId = user.areaId;
      }
      
      // إضافة ولي الأمر إلى قاعدة البيانات
      const newGuardian = await guardiansAPI.create({
        name: data.name,
        nationalId: data.nationalId,
        phone: data.phone,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        childrenCount: data.childrenCount,
        wivesCount: data.wivesCount,
        familyMembersCount: data.familyMembersCount,
        currentJob: data.currentJob,
        residenceStatus: data.residenceStatus,
        originalGovernorate: data.originalGovernorate,
        originalCity: data.originalCity,
        displacementAddress: data.displacementAddress,
        areaId: data.areaId.toString()
      });
      
      // إضافة ولي الأمر الجديد إلى القائمة المحلية
      const convertedGuardian: Guardian = {
        id: parseInt(newGuardian._id?.slice(-6) || '0', 16),
        name: newGuardian.name,
        nationalId: newGuardian.nationalId,
        phone: newGuardian.phone,
        gender: newGuardian.gender,
        maritalStatus: newGuardian.maritalStatus,
        childrenCount: newGuardian.childrenCount,
        wivesCount: newGuardian.wivesCount,
        familyMembersCount: newGuardian.familyMembersCount,
        currentJob: newGuardian.currentJob,
        residenceStatus: newGuardian.residenceStatus,
        originalGovernorate: newGuardian.originalGovernorate,
        originalCity: newGuardian.originalCity,
        displacementAddress: newGuardian.displacementAddress,
        areaId: parseInt(newGuardian.areaId || '0'),
        createdAt: newGuardian.createdAt || new Date().toISOString(),
        updatedAt: newGuardian.updatedAt || new Date().toISOString()
      };
      
      setGuardians([convertedGuardian, ...guardians]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding guardian:', error);
      setError('فشل في إضافة ولي الأمر');
    }
  };

  const handleEditGuardian = async (data: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedGuardian) return;
    
    try {
      // إذا كان المستخدم مندوب منطقة، تأكد من أن ولي الأمر المعدل ينتمي إلى منطقته
      if (user?.role === 'representative' && user?.areaId) {
        data.areaId = user.areaId;
      }
      
      // تحديث ولي الأمر في قاعدة البيانات
      const updatedGuardian = await guardiansAPI.update(selectedGuardian._id || '', {
        name: data.name,
        nationalId: data.nationalId,
        phone: data.phone,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        childrenCount: data.childrenCount,
        wivesCount: data.wivesCount,
        familyMembersCount: data.familyMembersCount,
        currentJob: data.currentJob,
        residenceStatus: data.residenceStatus,
        originalGovernorate: data.originalGovernorate,
        originalCity: data.originalCity,
        displacementAddress: data.displacementAddress,
        areaId: data.areaId.toString()
      });
      
      // تحديث ولي الأمر في القائمة المحلية
      const convertedGuardian: Guardian = {
        id: selectedGuardian.id,
        name: updatedGuardian.name,
        nationalId: updatedGuardian.nationalId,
        phone: updatedGuardian.phone,
        gender: updatedGuardian.gender,
        maritalStatus: updatedGuardian.maritalStatus,
        childrenCount: updatedGuardian.childrenCount,
        wivesCount: updatedGuardian.wivesCount,
        familyMembersCount: updatedGuardian.familyMembersCount,
        currentJob: updatedGuardian.currentJob,
        residenceStatus: updatedGuardian.residenceStatus,
        originalGovernorate: updatedGuardian.originalGovernorate,
        originalCity: updatedGuardian.originalCity,
        displacementAddress: updatedGuardian.displacementAddress,
        areaId: parseInt(updatedGuardian.areaId || '0'),
        createdAt: selectedGuardian.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      setGuardians(guardians.map(guardian => 
        guardian.id === selectedGuardian.id ? convertedGuardian : guardian
      ));
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating guardian:', error);
      setError('فشل في تحديث ولي الأمر');
    }
  };

  const handleViewGuardian = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setIsViewModalOpen(true);
  };

  const handleEditGuardianClick = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setIsEditModalOpen(true);
  };

  const handleDeleteGuardian = async (guardian: Guardian) => {
    if (window.confirm(`هل أنت متأكد أنك تريد حذف ولي الأمر "${guardian.name}"؟`)) {
      try {
        // حذف ولي الأمر من قاعدة البيانات
        await guardiansAPI.delete(guardian._id || '');
        
        // حذف ولي الأمر من القائمة المحلية
        setGuardians(guardians.filter(g => g.id !== guardian.id));
      } catch (error) {
        console.error('Error deleting guardian:', error);
        setError('فشل في حذف ولي الأمر');
      }
    }
  };

  const handleBulkDelete = async (guardianIds: number[]) => {
    if (window.confirm(`هل أنت متأكد أنك تريد حذف ${guardianIds.length} من أولياء الأمور؟`)) {
      try {
        // حذف أولياء الأمور من قاعدة البيانات
        const deletePromises = guardianIds.map(id => {
          const guardian = guardians.find(g => g.id === id);
          return guardian ? guardiansAPI.delete(guardian._id || '') : Promise.resolve();
        });
        
        await Promise.all(deletePromises);
        
        // حذف أولياء الأمور من القائمة المحلية
        setGuardians(guardians.filter(g => !guardianIds.includes(g.id)));
      } catch (error) {
        console.error('Error bulk deleting guardians:', error);
        setError('فشل في حذف أولياء الأمور المحددين');
      }
    }
  };

  const handleInlineEdit = async (guardian: Guardian, field: string, value: any) => {
    try {
      // تحديث ولي الأمر في قاعدة البيانات
      await guardiansAPI.update(guardian._id || '', { [field]: value });
      
      // تحديث ولي الأمر في القائمة المحلية
      setGuardians(guardians.map(g => 
        g.id === guardian.id ? { ...g, [field]: value, updatedAt: new Date().toISOString() } : g
      ));
    } catch (error) {
      console.error('Error inline editing guardian:', error);
      setError('فشل في تحديث ولي الأمر');
    }
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
        // إضافة أولياء الأمور إلى قاعدة البيانات
        const addPromises = filteredGuardians.map(guardianData => 
          guardiansAPI.create({
            name: guardianData.name,
            nationalId: guardianData.nationalId,
            phone: guardianData.phone,
            gender: guardianData.gender,
            maritalStatus: guardianData.maritalStatus,
            childrenCount: guardianData.childrenCount,
            wivesCount: guardianData.wivesCount,
            familyMembersCount: guardianData.familyMembersCount,
            currentJob: guardianData.currentJob,
            residenceStatus: guardianData.residenceStatus,
            originalGovernorate: guardianData.originalGovernorate,
            originalCity: guardianData.originalCity,
            displacementAddress: guardianData.displacementAddress,
            areaId: guardianData.areaId.toString()
          })
        );
        
        const newGuardians = await Promise.all(addPromises);
        
        // تحويل البيانات وإضافتها للقائمة المحلية
        const convertedGuardians: Guardian[] = newGuardians.map((newGuardian, index) => ({
          id: parseInt(newGuardian._id?.slice(-6) || '0', 16),
          name: newGuardian.name,
          nationalId: newGuardian.nationalId,
          phone: newGuardian.phone,
          gender: newGuardian.gender,
          maritalStatus: newGuardian.maritalStatus,
          childrenCount: newGuardian.childrenCount,
          wivesCount: newGuardian.wivesCount,
          familyMembersCount: newGuardian.familyMembersCount,
          currentJob: newGuardian.currentJob,
          residenceStatus: newGuardian.residenceStatus,
          originalGovernorate: newGuardian.originalGovernorate,
          originalCity: newGuardian.originalCity,
          displacementAddress: newGuardian.displacementAddress,
          areaId: parseInt(newGuardian.areaId || '0'),
          createdAt: newGuardian.createdAt || new Date().toISOString(),
          updatedAt: newGuardian.updatedAt || new Date().toISOString()
        }));
        
        setGuardians([...convertedGuardians, ...guardians]);
        alert(`تم استيراد ${convertedGuardians.length} ولي أمر بنجاح.`);
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
      {/* رسائل الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="mr-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
              onClick={async () => {
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع أولياء الأمور؟ لا يمكن التراجع عن هذه العملية.')) {
                  try {
                    // حذف جميع أولياء الأمور من قاعدة البيانات
                    const deletePromises = guardians.map(guardian => guardiansAPI.delete(guardian._id || ''));
                    await Promise.all(deletePromises);
                    
                    // حذف جميع أولياء الأمور من القائمة المحلية
                    setGuardians([]);
                  } catch (error) {
                    console.error('Error deleting all guardians:', error);
                    setError('فشل في حذف جميع أولياء الأمور');
                  }
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