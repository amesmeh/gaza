import React, { useState, useEffect } from 'react';
import { Wife, Guardian } from '../../types';
import { Modal } from '../Common/Modal';
import { WifeForm } from './WifeForm';
import { WifeDetails } from './WifeDetails';
import { WivesTable } from './WivesTable';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockWives, mockGuardians } from '../../data/mockData';
import { exportWivesToExcel, createWivesTemplate, importWivesFromExcel, exportWivesErrorsToExcel, downloadExcelFile } from '../../utils/wivesExcelUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { smartSearch } from '../../utils/smartSearch';

export const WivesPage: React.FC = () => {
  const [wives, setWives] = useLocalStorage<Wife[]>('wives', mockWives);
  const [guardians, setGuardians] = useLocalStorage<Guardian[]>('guardians', mockGuardians);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredWives, setFilteredWives] = useState<Wife[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWife, setSelectedWife] = useState<Wife | null>(null);

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

  // تطبيق البحث الذكي
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWives(wives);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = wives.filter(wife => {
        return (
          smartSearch(wife.name, searchTerm) ||
          smartSearch(wife.nationalId, searchTerm) ||
          (wife.husbandName && smartSearch(wife.husbandName, searchTerm)) ||
          (wife.husbandNationalId && smartSearch(wife.husbandNationalId, searchTerm)) ||
          (wife.areaName && smartSearch(wife.areaName, searchTerm))
        );
      });
      setFilteredWives(searchResults);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, wives]);

  // عند تحميل البيانات أو تحديثها، اربط المنطقة من ولي الأمر إذا لم تكن موجودة
  useEffect(() => {
    setWives(prevWives => prevWives.map(wife => {
      if (!wife.areaId || !wife.areaName) {
        const guardian = guardians.find(g => g.id === wife.husbandId);
        if (guardian) {
          return {
            ...wife,
            areaId: guardian.areaId,
            areaName: guardian.area?.name || guardian.areaName || ''
          };
        }
      }
      return wife;
    }));
  }, [guardians]);

  // تحميل بيانات أولياء الأمور مع areaName
  useEffect(() => {
    setGuardians(prevGuardians => prevGuardians.map(g => ({
      ...g,
      areaName: g.areaName || g.area?.name || ''
    })));
  }, []);

  const handleAddWife = (data: Omit<Wife, 'id' | 'createdAt' | 'updatedAt'>) => {
    // الحصول على بيانات الزوج لتحديث المنطقة
    const husband = guardians.find(g => g.id === data.husbandId);
    
    const newWife: Wife = {
      ...data,
      id: Math.max(0, ...wives.map(w => w.id)) + 1,
      areaId: husband?.areaId || 0,
      areaName: husband?.area?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // تحديث عدد الزوجات لولي الأمر
    const updatedGuardians = guardians.map(guardian => {
      if (guardian.id === data.husbandId) {
        return {
          ...guardian,
          wivesCount: guardian.wivesCount + 1,
          familyMembersCount: guardian.familyMembersCount + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return guardian;
    });
    
    setWives([newWife, ...wives]);
    setGuardians(updatedGuardians);
    setIsAddModalOpen(false);
  };

  const handleEditWife = (data: Omit<Wife, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedWife) return;
    
    // الحصول على بيانات الزوج لتحديث المنطقة
    const husband = guardians.find(g => g.id === data.husbandId);
    
    const updatedWife: Wife = {
      ...data,
      id: selectedWife.id,
      areaId: husband?.areaId || 0,
      areaName: husband?.area?.name || '',
      createdAt: selectedWife.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // إذا تغير الزوج، نحدث عدد الزوجات للزوجين القديم والجديد
    if (selectedWife.husbandId !== data.husbandId) {
      const updatedGuardians = guardians.map(guardian => {
        if (guardian.id === selectedWife.husbandId) {
          return {
            ...guardian,
            wivesCount: Math.max(0, guardian.wivesCount - 1),
            familyMembersCount: Math.max(1, guardian.familyMembersCount - 1),
            updatedAt: new Date().toISOString()
          };
        }
        if (guardian.id === data.husbandId) {
          return {
            ...guardian,
            wivesCount: guardian.wivesCount + 1,
            familyMembersCount: guardian.familyMembersCount + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return guardian;
      });
      
      setGuardians(updatedGuardians);
    }
    
    setWives(wives.map(wife => 
      wife.id === selectedWife.id ? updatedWife : wife
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewWife = (wife: Wife) => {
    setSelectedWife(wife);
    setIsViewModalOpen(true);
  };

  const handleEditWifeClick = (wife: Wife) => {
    setSelectedWife(wife);
    setIsEditModalOpen(true);
  };

  const handleDeleteWife = (wife: Wife) => {
    if (window.confirm(`هل أنت متأكد من حذف الزوجة ${wife.name}؟`)) {
      // تحديث عدد الزوجات لولي الأمر
      const updatedGuardians = guardians.map(guardian => {
        if (guardian.id === wife.husbandId) {
          return {
            ...guardian,
            wivesCount: Math.max(0, guardian.wivesCount - 1),
            familyMembersCount: Math.max(1, guardian.familyMembersCount - 1),
            updatedAt: new Date().toISOString()
          };
        }
        return guardian;
      });
      
      setWives(wives.filter(w => w.id !== wife.id));
      setGuardians(updatedGuardians);
    }
  };

  const handleBulkDelete = (wifeIds: number[]) => {
    // تحديث عدد الزوجات لأولياء الأمور
    const wivesToDelete = wives.filter(wife => wifeIds.includes(wife.id));
    const husbandIds = new Set(wivesToDelete.map(wife => wife.husbandId));
    
    const updatedGuardians = guardians.map(guardian => {
      if (husbandIds.has(guardian.id)) {
        const deletedWivesCount = wivesToDelete.filter(wife => wife.husbandId === guardian.id).length;
        return {
          ...guardian,
          wivesCount: Math.max(0, guardian.wivesCount - deletedWivesCount),
          familyMembersCount: Math.max(1, guardian.familyMembersCount - deletedWivesCount),
          updatedAt: new Date().toISOString()
        };
      }
      return guardian;
    });
    
    setWives(wives.filter(wife => !wifeIds.includes(wife.id)));
    setGuardians(updatedGuardians);
  };

  const handleInlineEdit = (wife: Wife, field: string, value: any) => {
    const updatedWives = wives.map(w => {
      if (w.id === wife.id) {
        return { ...w, [field]: value, updatedAt: new Date().toISOString() };
      }
      return w;
    });
    
    setWives(updatedWives);
  };

  // استيراد بيانات الزوجات من ملف Excel
  const handleImportWives = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const { validWives, errors } = await importWivesFromExcel(file, guardians);
      
      if (errors.length > 0) {
        alert(`تم العثور على ${errors.length} أخطاء في ملف الاستيراد. سيتم تنزيل ملف الأخطاء.`);
        const errorWorkbook = exportWivesErrorsToExcel(errors);
        downloadExcelFile(errorWorkbook, 'أخطاء-استيراد-الزوجات');
      }
      
      if (validWives.length > 0) {
        const newWives = validWives.map((wifeData, index) => ({
          ...wifeData,
          id: Math.max(0, ...wives.map(w => w.id)) + index + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Wife[];
        
        // تحديث عدد الزوجات لأولياء الأمور
        const husbandIds = new Set(newWives.map(wife => wife.husbandId));
        const updatedGuardians = guardians.map(guardian => {
          if (husbandIds.has(guardian.id)) {
            const newWivesCount = newWives.filter(wife => wife.husbandId === guardian.id).length;
            return {
              ...guardian,
              wivesCount: guardian.wivesCount + newWivesCount,
              familyMembersCount: guardian.familyMembersCount + newWivesCount,
              updatedAt: new Date().toISOString()
            };
          }
          return guardian;
        });
        
        setWives([...newWives, ...wives]);
        setGuardians(updatedGuardians);
        alert(`تم استيراد ${newWives.length} زوجة بنجاح.`);
      } else {
        alert('لم يتم استيراد أي بيانات. يرجى التحقق من الملف والأخطاء.');
      }
    } catch (error) {
      console.error('Error importing wives:', error);
      alert(`حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تصدير بيانات الزوجات إلى ملف Excel
  const handleExportWives = () => {
    try {
      const workbook = exportWivesToExcel(filteredWives.length > 0 ? filteredWives : wives);
      downloadExcelFile(workbook, 'بيانات-الزوجات');
    } catch (error) {
      console.error('Error exporting wives:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // تنزيل قالب Excel للزوجات
  const handleDownloadTemplate = () => {
    try {
      const workbook = createWivesTemplate(guardians);
      downloadExcelFile(workbook, 'قالب-الزوجات');
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة الزوجات</h1>
            <p className="text-gray-600 text-sm">إدارة بيانات زوجات أولياء الأمور</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* أزرار الإضافة والتصدير */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة زوجة</span>
              </button>
              <button
                onClick={handleExportWives}
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
                onChange={handleImportWives}
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
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع الزوجات؟ لا يمكن التراجع عن هذه العملية.')) {
                  setWives([]);
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
                if (window.confirm('هل تريد إعادة تعيين بيانات الزوجات بالبيانات الوهمية مع معلومات المنطقة؟')) {
                  const updatedWives = mockWives.map(wife => {
                    const guardian = guardians.find(g => g.id === wife.husbandId);
                    if (guardian) {
                      return {
                        ...wife,
                        areaId: guardian.areaId,
                        areaName: guardian.areaName || ''
                      };
                    }
                    return wife;
                  });
                  setWives(updatedWives);
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

            {/* زر تحديث المنطقة لأولياء الأمور فقط */}
            <button
              onClick={() => {
                setGuardians(prevGuardians => prevGuardians.map(g => ({
                  ...g,
                  areaName: g.areaName || g.area?.name || ''
                })));
                alert('تم تحديث المنطقة لأولياء الأمور بنجاح!');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 font-semibold text-sm mb-4"
            >
              تحديث المنطقة لأولياء الأمور فقط
            </button>
          </div>
        </div>
      </div>

      {/* البحث البسيط */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <SimpleSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="البحث في الزوجات (الاسم، رقم الهوية، اسم الزوج...)"
        />
      </div>

      {/* جدول الزوجات */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <WivesTable
          wives={filteredWives}
          guardians={guardians}
          onView={handleViewWife}
          onEdit={handleEditWifeClick}
          onDelete={handleDeleteWife}
          onBulkDelete={handleBulkDelete}
          onInlineEdit={handleInlineEdit}
        />
      </div>

      {/* نافذة إضافة زوجة جديدة */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة زوجة جديدة"
        size="md"
      >
        <WifeForm
          guardians={guardians}
          onSubmit={handleAddWife}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل زوجة */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات الزوجة: ${selectedWife?.name || ''}`}
        size="md"
      >
        {selectedWife && (
          <WifeForm
            wife={selectedWife}
            guardians={guardians}
            onSubmit={handleEditWife}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل الزوجة */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل الزوجة: ${selectedWife?.name || ''}`}
        size="md"
      >
        {selectedWife && (
          <WifeDetails
            wife={selectedWife}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};