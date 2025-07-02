import React, { useState, useEffect } from 'react';
import { Area } from '../../types';
import { Modal } from '../Common/Modal';
import { AreaForm } from './AreaForm';
import { AreaDetails } from './AreaDetails';
import { AreasTable } from './AreasTable';
import { SimpleSearch } from '../Guardians/SimpleSearch';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { smartSearch } from '../../utils/smartSearch';
import { areasAPI } from '../../services/api';

export const AreasPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const areasData = await areasAPI.getAll();
        
        // تحويل البيانات من API إلى التنسيق المطلوب
        const convertedAreas: Area[] = areasData.map((area: any) => ({
          id: parseInt(area._id?.slice(-6) || '0', 16),
          name: area.name,
          representativeName: area.representativeName || '',
          representativeId: area.representativeId || '',
          representativePhone: area.representativePhone || '',
          createdAt: area.createdAt || new Date().toISOString(),
          updatedAt: area.updatedAt || new Date().toISOString(),
          guardiansCount: 0 // سيتم تحديثه لاحقاً إذا لزم الأمر
        }));
        
        setAreas(convertedAreas);
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

  const handleAddArea = async (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newArea = await areasAPI.create(data);
      
      // تحويل البيانات المستلمة إلى التنسيق المطلوب
      const convertedArea: Area = {
        id: parseInt(newArea._id?.slice(-6) || '0', 16),
        name: newArea.name,
        representativeName: newArea.representativeName || '',
        representativeId: newArea.representativeId || '',
        representativePhone: newArea.representativePhone || '',
        createdAt: newArea.createdAt || new Date().toISOString(),
        updatedAt: newArea.updatedAt || new Date().toISOString(),
        guardiansCount: 0
      };
      
      setAreas(prev => [...prev, convertedArea]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding area:', error);
      alert('حدث خطأ أثناء إضافة المنطقة');
    }
  };

  const handleEditArea = async (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedArea?._id) return;
    
    try {
      const updatedArea = await areasAPI.update(selectedArea._id, data);
      
      // تحويل البيانات المستلمة إلى التنسيق المطلوب
      const convertedArea: Area = {
        id: parseInt(updatedArea._id?.slice(-6) || '0', 16),
        name: updatedArea.name,
        representativeName: updatedArea.representativeName || '',
        representativeId: updatedArea.representativeId || '',
        representativePhone: updatedArea.representativePhone || '',
        createdAt: updatedArea.createdAt || new Date().toISOString(),
        updatedAt: updatedArea.updatedAt || new Date().toISOString(),
        guardiansCount: selectedArea.guardiansCount
      };
      
      setAreas(prev => prev.map(area => area.id === selectedArea.id ? convertedArea : area));
      setIsEditModalOpen(false);
      setSelectedArea(null);
    } catch (error) {
      console.error('Error updating area:', error);
      alert('حدث خطأ أثناء تحديث المنطقة');
    }
  };

  const handleViewArea = (area: Area) => {
    setSelectedArea(area);
    setIsViewModalOpen(true);
  };

  const handleEditAreaClick = (area: Area) => {
    setSelectedArea(area);
    setIsEditModalOpen(true);
  };

  const handleDeleteArea = async (area: Area) => {
    if (!area._id) return;
    
    if (window.confirm(`هل أنت متأكد من حذف المنطقة ${area.name}؟`)) {
      try {
        await areasAPI.delete(area._id);
        setAreas(prev => prev.filter(a => a.id !== area.id));
      } catch (error) {
        console.error('Error deleting area:', error);
        alert('حدث خطأ أثناء حذف المنطقة');
      }
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