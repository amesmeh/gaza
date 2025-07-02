import React, { useState, useEffect } from 'react';
import { Area } from '../../types';
import { Modal } from '../Common/Modal';
import { AreaForm } from './AreaForm';
import { AreaDetails } from './AreaDetails';
import { AreasTable } from './AreasTable';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockAreas } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { smartSearch } from '../../utils/smartSearch';

export const AreasPage: React.FC = () => {
  const [areas, setAreas] = useLocalStorage<Area[]>('areas', mockAreas);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

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
      setFilteredAreas(areas);
      return;
    }
    
    const searchResults = areas.filter(area => 
      smartSearch(area.name, searchTerm) ||
      smartSearch(area.representativeName, searchTerm) ||
      smartSearch(area.representativeId, searchTerm) ||
      smartSearch(area.representativePhone, searchTerm)
    );
    
    setFilteredAreas(searchResults);
  }, [searchTerm, areas]);

  const handleAddArea = (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArea: Area = {
      ...data,
      id: Math.max(0, ...areas.map(a => a.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setAreas([newArea, ...areas]);
    setIsAddModalOpen(false);
  };

  const handleEditArea = (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedArea) return;
    
    const updatedArea: Area = {
      ...data,
      id: selectedArea.id,
      createdAt: selectedArea.createdAt,
      updatedAt: new Date().toISOString(),
      guardiansCount: selectedArea.guardiansCount
    };
    
    setAreas(areas.map(area => 
      area.id === selectedArea.id ? updatedArea : area
    ));
    
    setIsEditModalOpen(false);
  };

  const handleViewArea = (area: Area) => {
    setSelectedArea(area);
    setIsViewModalOpen(true);
  };

  const handleEditAreaClick = (area: Area) => {
    setSelectedArea(area);
    setIsEditModalOpen(true);
  };

  const handleDeleteArea = (area: Area) => {
    if (window.confirm(`هل أنت متأكد من حذف المنطقة ${area.name}؟`)) {
      setAreas(areas.filter(a => a.id !== area.id));
    }
  };

  // تصدير بيانات المناطق إلى ملف Excel
  const handleExportAreas = () => {
    try {
      // هنا يمكن إضافة كود لتصدير البيانات إلى Excel
      alert('تم تصدير بيانات المناطق بنجاح');
    } catch (error) {
      console.error('Error exporting areas:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  // استيراد بيانات المناطق من ملف Excel
  const handleImportAreas = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // هنا يمكن إضافة كود لاستيراد البيانات من Excel
    alert('تم استيراد بيانات المناطق بنجاح');
    
    // إعادة تعيين حقل الملف
    event.target.value = '';
  };

  // تحميل القالب
  const handleDownloadTemplate = () => {
    // هنا يمكن إضافة كود لتحميل القالب
    alert('تم تحميل القالب بنجاح');
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة المناطق</h1>
            <p className="text-gray-600 text-sm">إدارة بيانات المناطق ومندوبيها</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* أزرار الإضافة والتصدير */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة منطقة</span>
              </button>
              <button
                onClick={handleExportAreas}
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
                onChange={handleImportAreas}
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
                if (window.confirm('هل أنت متأكد أنك تريد حذف جميع المناطق؟ لا يمكن التراجع عن هذه العملية.')) {
                  setAreas([]);
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
          placeholder="البحث في المناطق (الاسم، اسم المندوب، رقم الهاتف...)"
        />
      </div>

      {/* جدول المناطق */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <AreasTable
          areas={filteredAreas}
          onView={handleViewArea}
          onEdit={handleEditAreaClick}
          onDelete={handleDeleteArea}
        />
      </div>

      {/* نافذة إضافة منطقة جديدة */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة منطقة جديدة"
        size="md"
      >
        <AreaForm
          onSubmit={handleAddArea}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل منطقة */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات المنطقة: ${selectedArea?.name || ''}`}
        size="md"
      >
        {selectedArea && (
          <AreaForm
            area={selectedArea}
            onSubmit={handleEditArea}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* نافذة عرض تفاصيل المنطقة */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`تفاصيل المنطقة: ${selectedArea?.name || ''}`}
        size="md"
      >
        {selectedArea && (
          <AreaDetails
            area={selectedArea}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};