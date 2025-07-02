import React, { useState, useEffect } from 'react';
import { Aid, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { AidForm } from './AidForm';
import AidDetails from './AidDetails';
import { AidsTable } from './AidsTable';
import { AidsAdvancedFilter } from './AidsAdvancedFilter';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { exportAidsToExcel, createAidsTemplate, importAidsFromExcel, exportAidsErrorsToExcel, exportAidsWarningsToExcel, downloadExcelFile } from '../../utils/aidsExcelUtils';
import { useAuth } from '../../context/AuthContext';
import { aidsAPI, guardiansAPI, Aid as AidFromAPI, Guardian as GuardianFromAPI } from '../../services/api';

export const AidsPage: React.FC = () => {
  const [aids, setAids] = useState<Aid[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredAids, setFilteredAids] = useState<Aid[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAid, setSelectedAid] = useState<Aid | null>(null);
  const [showAidDetails, setShowAidDetails] = useState(false);
  
  const [filters, setFilters] = useState({
    selectedArea: '',
    selectedAidType: '',
    selectedGuardian: '',
    dateRange: { from: '', to: '' }
  });

  const { user } = useAuth();

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // جلب المساعدات وأولياء الأمور من قاعدة البيانات
        const [aidsData, guardiansData] = await Promise.all([
          aidsAPI.getAll(),
          guardiansAPI.getAll()
        ]);
        
        // تحويل بيانات المساعدات من API إلى التنسيق المطلوب
        const convertedAids: Aid[] = aidsData.map((aid: AidFromAPI) => ({
          id: parseInt(aid._id?.slice(-6) || '0', 16), // تحويل ObjectId إلى رقم
          guardianNationalId: aid.guardianNationalId,
          guardianName: aid.guardianName || '',
          areaName: aid.areaName || '',
          guardianPhone: aid.guardianPhone || '',
          aidType: aid.aidType,
          aidDate: aid.aidDate,
          notes: aid.notes || '',
          createdAt: aid.createdAt || new Date().toISOString(),
          updatedAt: aid.updatedAt || new Date().toISOString()
        }));
        
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
        
        // فلترة البيانات حسب صلاحيات المستخدم
        let filteredAidsData = [...convertedAids];
        let filteredGuardiansData = [...convertedGuardians];
        
        // إذا كان المستخدم مندوب منطقة، قم بفلترة البيانات حسب المنطقة
        if (user?.role === 'representative' && user?.areaId) {
          filteredAidsData = filteredAidsData.filter(aid => {
            const guardian = convertedGuardians.find(g => g.nationalId === aid.guardianNationalId);
            return guardian && guardian.areaId === user.areaId;
          });
          filteredGuardiansData = filteredGuardiansData.filter(guardian => guardian.areaId === user.areaId);
        }
        
        setAids(filteredAidsData);
        setGuardians(filteredGuardiansData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('فشل في جلب البيانات من قاعدة البيانات');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // تطبيق البحث البسيط
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAids(aids);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
      
      const searchResults = aids.filter(aid => {
        // البحث في اسم ولي الأمر (ديناميكي)
        const guardianName = aid.guardianName?.toLowerCase() || '';
        const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
        const guardianFullName = guardian?.name?.toLowerCase() || '';
        
        // دمج جميع الأسماء المتاحة
        const allNames = [guardianName, guardianFullName].filter(name => name.length > 0);
        const fullText = allNames.join(' ') + ' ' + 
                        aid.guardianNationalId + ' ' + 
                        (aid.guardianPhone || '') + ' ' + 
                        (guardian?.phone || '') + ' ' + 
                        aid.aidType.toLowerCase() + ' ' + 
                        (aid.areaName || '') + ' ' + 
                        (guardian?.areaName || '') + ' ' + 
                        (aid.notes || '');
        
        // البحث بـ AND - جميع الكلمات يجب أن تكون موجودة
        const allTermsFound = searchTerms.every(term => fullText.includes(term));
        
        return allTermsFound;
      });
      
      setFilteredAids(searchResults);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, aids, guardians]);

  // تطبيق الفلاتر المتقدمة
  useEffect(() => {
    if (!hasActiveFilters()) {
      if (searchTerm.trim() === '') {
        setFilteredAids(aids);
      }
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      let filtered = [...aids];
      
      // فلترة حسب المنطقة
      if (filters.selectedArea) {
        filtered = filtered.filter(aid => {
          const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
          return guardian && guardian.areaId?.toString() === filters.selectedArea;
        });
      }
      
      // فلترة حسب نوع المساعدة
      if (filters.selectedAidType) {
        filtered = filtered.filter(aid => aid.aidType.includes(filters.selectedAidType));
      }
      
      // فلترة حسب ولي الأمر
      if (filters.selectedGuardian) {
        filtered = filtered.filter(aid => aid.guardianNationalId === filters.selectedGuardian);
      }
      
      // فلترة حسب نطاق تاريخ المساعدة
      if (filters.dateRange.from) {
        filtered = filtered.filter(aid => new Date(aid.aidDate) >= new Date(filters.dateRange.from));
      }
      if (filters.dateRange.to) {
        filtered = filtered.filter(aid => new Date(aid.aidDate) <= new Date(filters.dateRange.to));
      }
      
      setFilteredAids(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, aids, searchTerm, guardians]);

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedAidType || 
           filters.selectedGuardian ||
           filters.dateRange.from ||
           filters.dateRange.to;
  };

  const handleAddAid = async (data: Omit<Aid, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // البحث عن ولي الأمر للحصول على المنطقة
      const guardian = guardians.find(g => g.nationalId === data.guardianNationalId);
      
      // إذا كان المستخدم مندوب منطقة، تأكد من أن المساعدة الجديدة تنتمي إلى منطقته
      if (user?.role === 'representative' && user?.areaId) {
        if (!guardian || guardian.areaId !== user.areaId) {
          setError('لا يمكنك إضافة مساعدة لولي أمر من منطقة أخرى');
          return;
        }
      }
      
      // إضافة المساعدة إلى قاعدة البيانات
      const newAid = await aidsAPI.create({
        guardianNationalId: data.guardianNationalId,
        guardianName: data.guardianName,
        areaName: data.areaName,
        guardianPhone: data.guardianPhone,
        aidType: data.aidType,
        aidDate: data.aidDate,
        notes: data.notes
      });
      
      // إضافة المساعدة الجديدة إلى القائمة المحلية
      const convertedAid: Aid = {
        id: parseInt(newAid._id?.slice(-6) || '0', 16),
        guardianNationalId: newAid.guardianNationalId,
        guardianName: newAid.guardianName || '',
        areaName: newAid.areaName || '',
        guardianPhone: newAid.guardianPhone || '',
        aidType: newAid.aidType,
        aidDate: newAid.aidDate,
        notes: newAid.notes || '',
        createdAt: newAid.createdAt || new Date().toISOString(),
        updatedAt: newAid.updatedAt || new Date().toISOString()
      };
      
      setAids([convertedAid, ...aids]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding aid:', error);
      setError('فشل في إضافة المساعدة');
    }
  };

  const handleEditAid = async (data: Omit<Aid, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedAid) return;
    
    try {
      // البحث عن ولي الأمر للحصول على المنطقة
      const guardian = guardians.find(g => g.nationalId === data.guardianNationalId);
      
      // إذا كان المستخدم مندوب منطقة، تأكد من أن المساعدة المعدلة تنتمي إلى منطقته
      if (user?.role === 'representative' && user?.areaId) {
        if (!guardian || guardian.areaId !== user.areaId) {
          setError('لا يمكنك تعديل مساعدة لولي أمر من منطقة أخرى');
          return;
        }
      }
      
      // تحديث المساعدة في قاعدة البيانات
      const updatedAid = await aidsAPI.update(selectedAid._id || '', {
        guardianNationalId: data.guardianNationalId,
        guardianName: data.guardianName,
        areaName: data.areaName,
        guardianPhone: data.guardianPhone,
        aidType: data.aidType,
        aidDate: data.aidDate,
        notes: data.notes
      });
      
      // تحديث المساعدة في القائمة المحلية
      const updatedAids = aids.map(aid => 
        aid.id === selectedAid.id 
          ? {
              ...aid,
              guardianNationalId: data.guardianNationalId,
              guardianName: data.guardianName,
              areaName: data.areaName,
              guardianPhone: data.guardianPhone,
              aidType: data.aidType,
              aidDate: data.aidDate,
              notes: data.notes,
              updatedAt: new Date().toISOString()
            }
          : aid
      );
      
      setAids(updatedAids);
      setIsEditModalOpen(false);
      setSelectedAid(null);
    } catch (error) {
      console.error('Error updating aid:', error);
      setError('فشل في تحديث المساعدة');
    }
  };

  const handleViewAid = (aid: Aid) => {
    setSelectedAid(aid);
    setShowAidDetails(true);
  };

  const handleEditAidClick = (aid: Aid) => {
    setSelectedAid(aid);
    setIsEditModalOpen(true);
  };

  const handleDuplicateAid = async (aid: Aid) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أن المساعدة المكررة تنتمي إلى منطقته
    if (user?.role === 'representative' && user?.areaId) {
      const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
      if (!guardian || guardian.areaId !== user.areaId) {
        setError('لا يمكنك تكرار مساعدة من منطقة أخرى');
        return;
      }
    }
    
    try {
      // إضافة المساعدة المكررة إلى قاعدة البيانات
      const newAid = await aidsAPI.create({
        guardianNationalId: aid.guardianNationalId,
        guardianName: aid.guardianName,
        areaName: aid.areaName,
        guardianPhone: aid.guardianPhone,
        aidType: aid.aidType,
        aidDate: new Date().toISOString().split('T')[0],
        notes: aid.notes
      });
      
      // إضافة المساعدة الجديدة إلى القائمة المحلية
      const convertedAid: Aid = {
        id: parseInt(newAid._id?.slice(-6) || '0', 16),
        guardianNationalId: newAid.guardianNationalId,
        guardianName: newAid.guardianName || '',
        areaName: newAid.areaName || '',
        guardianPhone: newAid.guardianPhone || '',
        aidType: newAid.aidType,
        aidDate: newAid.aidDate,
        notes: newAid.notes || '',
        createdAt: newAid.createdAt || new Date().toISOString(),
        updatedAt: newAid.updatedAt || new Date().toISOString()
      };
      
      setAids([convertedAid, ...aids]);
      alert(`تم نسخ المساعدة لـ ${aid.guardianName || aid.guardianNationalId} بنجاح.`);
    } catch (error) {
      console.error('Error duplicating aid:', error);
      setError('فشل في تكرار المساعدة');
    }
  };

  const handleDeleteAid = async (aid: Aid) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أنه يمكنه حذف المساعدة فقط من منطقته
    if (user?.role === 'representative' && user?.areaId) {
      const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
      if (!guardian || guardian.areaId !== user.areaId) {
        setError('لا يمكنك حذف مساعدة من منطقة أخرى');
        return;
      }
    }
    
    if (window.confirm(`هل أنت متأكد من حذف المساعدة لـ ${aid.guardianName || aid.guardianNationalId}؟`)) {
      try {
        // حذف المساعدة من قاعدة البيانات
        await aidsAPI.delete(aid._id || '');
        
        // حذف المساعدة من القائمة المحلية
        setAids(aids.filter(a => a.id !== aid.id));
      } catch (error) {
        console.error('Error deleting aid:', error);
        setError('فشل في حذف المساعدة');
      }
    }
  };

  const handleBulkDelete = async (aidIds: number[]) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أنه يمكنه حذف المساعدات فقط من منطقته
    if (user?.role === 'representative' && user?.areaId) {
      const aidsToDelete = aids.filter(aid => aidIds.includes(aid.id));
      const hasOtherAreaAids = aidsToDelete.some(aid => {
        const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
        return !guardian || guardian.areaId !== user.areaId;
      });
      
      if (hasOtherAreaAids) {
        setError('لا يمكنك حذف مساعدات من مناطق أخرى');
        return;
      }
    }
    
    try {
      // حذف المساعدات من قاعدة البيانات
      const deletePromises = aidIds.map(id => {
        const aid = aids.find(a => a.id === id);
        return aid ? aidsAPI.delete(aid._id || '') : Promise.resolve();
      });
      
      await Promise.all(deletePromises);
      
      // حذف المساعدات من القائمة المحلية
      setAids(aids.filter(aid => !aidIds.includes(aid.id)));
    } catch (error) {
      console.error('Error bulk deleting aids:', error);
      setError('فشل في حذف المساعدات المحددة');
    }
  };

  const handleInlineEdit = async (aid: Aid, field: string, value: any) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أنه يمكنه تعديل المساعدات فقط من منطقته
    if (user?.role === 'representative' && user?.areaId) {
      const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
      if (!guardian || guardian.areaId !== user.areaId) {
        setError('لا يمكنك تعديل مساعدة من منطقة أخرى');
        return;
      }
    }
    
    try {
      // تحديث المساعدة في قاعدة البيانات
      await aidsAPI.update(aid._id || '', { [field]: value });
      
      // تحديث المساعدة في القائمة المحلية
      const updatedAids = aids.map(a => {
        if (a.id === aid.id) {
          return { ...a, [field]: value, updatedAt: new Date().toISOString() };
        }
        return a;
      });
      
      setAids(updatedAids);
    } catch (error) {
      console.error('Error inline editing aid:', error);
      setError('فشل في تحديث المساعدة');
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    // إذا كان المستخدم مندوب منطقة، تأكد من أن الفلتر يتضمن منطقته فقط
    if (user?.role === 'representative' && user?.areaId) {
      newFilters.selectedArea = user.areaId.toString();
    }
    
    setFilters(newFilters);
  };

  const resetFilters = () => {
    // إذا كان المستخدم مندوب منطقة، احتفظ بفلتر المنطقة
    if (user?.role === 'representative' && user?.areaId) {
      setFilters({
        selectedArea: user.areaId.toString(),
        selectedAidType: '',
        selectedGuardian: '',
        dateRange: { from: '', to: '' }
      });
    } else {
      setFilters({
        selectedArea: '',
        selectedAidType: '',
        selectedGuardian: '',
        dateRange: { from: '', to: '' }
      });
    }
  };

  // استيراد بيانات المساعدات من ملف Excel
  const handleImportAids = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validAids, errors, warnings } = await importAidsFromExcel(file, guardians);
      
      // إذا كان المستخدم مندوب منطقة، تأكد من أن المساعدات المستوردة تنتمي إلى منطقته
      let filteredAids = validAids;
      if (user?.role === 'representative' && user?.areaId) {
        filteredAids = validAids.filter(aid => {
          const guardian = guardians.find(g => g.nationalId === aid.guardianNationalId);
          return guardian && guardian.areaId === user.areaId;
        });
        
        if (filteredAids.length < validAids.length) {
          const skippedCount = validAids.length - filteredAids.length;
          alert(`تم تجاهل ${skippedCount} من المساعدات لأنها لا تنتمي إلى منطقتك.`);
        }
      }
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportAidsErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-المساعدات');
      }
      
      if (warnings.length > 0) {
        alert(`تم العثور على ${warnings.length} تحذيرات في ملف الاستيراد. سيتم تنزيل ملف التحذيرات.`);
        const warningWorkbook = exportAidsWarningsToExcel(warnings);
        downloadExcelFile(warningWorkbook, 'تحذيرات-استيراد-المساعدات');
      }
      
      if (filteredAids.length > 0) {
        // إضافة المساعدات إلى قاعدة البيانات
        const addPromises = filteredAids.map(aidData => 
          aidsAPI.create({
            guardianNationalId: aidData.guardianNationalId,
            guardianName: aidData.guardianName,
            areaName: aidData.areaName,
            guardianPhone: aidData.guardianPhone,
            aidType: aidData.aidType,
            aidDate: aidData.aidDate,
            notes: aidData.notes
          })
        );
        
        const newAids = await Promise.all(addPromises);
        
        // تحويل البيانات وإضافتها للقائمة المحلية
        const convertedAids: Aid[] = newAids.map((newAid, index) => ({
          id: parseInt(newAid._id?.slice(-6) || '0', 16),
          guardianNationalId: newAid.guardianNationalId,
          guardianName: newAid.guardianName || '',
          areaName: newAid.areaName || '',
          guardianPhone: newAid.guardianPhone || '',
          aidType: newAid.aidType,
          aidDate: newAid.aidDate,
          notes: newAid.notes || '',
          createdAt: newAid.createdAt || new Date().toISOString(),
          updatedAt: newAid.updatedAt || new Date().toISOString()
        }));
        
        setAids([...convertedAids, ...aids]);
        alert(`تم استيراد ${convertedAids.length} مساعدة بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing aids:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات المساعدات إلى ملف Excel
  const handleExportAids = () => {
    try {
      const workbook = exportAidsToExcel(filteredAids.length > 0 ? filteredAids : aids);
      downloadExcelFile(workbook, 'بيانات-المساعدات');
    } catch (error) {
      console.error('Error exporting aids:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للمساعدات
  const handleDownloadTemplate = () => {
    try {
      const workbook = createAidsTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-المساعدات');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('حدث خطأ أثناء إنشاء القالب');
    }
  };

  // إنشاء قائمة المناطق المتاحة من بيانات أولياء الأمور
  const availableAreas = Array.from(new Set(guardians.map(g => g.areaId)))
    .map(areaId => ({
      id: areaId,
      name: `المنطقة ${areaId}`,
      representativeName: '',
      representativeId: '',
      representativePhone: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guardiansCount: guardians.filter(g => g.areaId === areaId).length
    }));

  // إذا كان يتم عرض تفاصيل المساعدة، اعرض صفحة التفاصيل
  if (showAidDetails && selectedAid) {
    return (
      <AidDetails
        aid={selectedAid}
        guardians={guardians}
        allAids={aids}
        onClose={() => setShowAidDetails(false)}
      />
    );
  }

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المساعدات</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار الإضافة والتصدير */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium">إضافة مساعدة</span>
            </button>
            <button
              onClick={handleExportAids}
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
              onChange={handleImportAids}
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
            onClick={async () => {
              if (window.confirm('هل أنت متأكد أنك تريد حذف جميع المساعدات؟ لا يمكن التراجع عن هذه العملية.')) {
                try {
                  // حذف جميع المساعدات من قاعدة البيانات
                  const deletePromises = aids.map(aid => aidsAPI.delete(aid._id || ''));
                  await Promise.all(deletePromises);
                  
                  // حذف جميع المساعدات من القائمة المحلية
                  setAids([]);
                } catch (error) {
                  console.error('Error deleting all aids:', error);
                  setError('فشل في حذف جميع المساعدات');
                }
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
        placeholder="البحث في المساعدات (اسم ولي الأمر، رقم الهوية، نوع المساعدة...)"
        resultsCount={filteredAids.length}
      />

      {/* فلاتر البحث المتقدمة */}
      <AidsAdvancedFilter
        filters={filters}
        areas={availableAreas}
        guardians={guardians}
        onFiltersChange={handleFiltersChange}
        onSearch={() => {}}
        onReset={resetFilters}
        resultsCount={filteredAids.length}
        isSearching={isSearching}
        disableAreaFilter={user?.role === 'representative'}
      />

      {/* جدول المساعدات */}
      <AidsTable
        aids={filteredAids}
        guardians={guardians}
        onView={handleViewAid}
        onEdit={handleEditAidClick}
        onDelete={handleDeleteAid}
        onDuplicate={handleDuplicateAid}
        onBulkDelete={handleBulkDelete}
        onInlineEdit={handleInlineEdit}
      />

      {/* نافذة إضافة مساعدة جديدة */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مساعدة جديدة"
        size="lg"
      >
        <AidForm
          guardians={guardians}
          onSubmit={handleAddAid}
          onCancel={() => setIsAddModalOpen(false)}
          disableAreaSelect={user?.role === 'representative'}
          defaultAreaId={user?.role === 'representative' ? user.areaId : undefined}
        />
      </Modal>

      {/* نافذة تعديل مساعدة */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل مساعدة: ${selectedAid?.guardianName || selectedAid?.guardianNationalId || ''}`}
        size="lg"
      >
        {selectedAid && (
          <AidForm
            aid={selectedAid}
            guardians={guardians}
            onSubmit={handleEditAid}
            onCancel={() => setIsEditModalOpen(false)}
            disableAreaSelect={user?.role === 'representative'}
            defaultAreaId={user?.role === 'representative' ? user.areaId : undefined}
          />
        )}
      </Modal>
    </div>
  );
};