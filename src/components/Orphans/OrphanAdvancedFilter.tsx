import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw, Calendar } from 'lucide-react';

interface OrphanFilters {
  selectedGender: string;
  selectedHealthStatus: string;
  selectedEducationalStage: string;
  ageRange: { min: string; max: string };
  birthDateRange: { from: string; to: string };
  siblingsRange: { min: string; max: string };
  searchTerm: string;
}

interface OrphanAdvancedFilterProps {
  filters: OrphanFilters;
  healthStatuses: string[];
  educationalStages: string[];
  onFiltersChange: (filters: OrphanFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  resultsCount: number;
  isSearching?: boolean;
}

export const OrphanAdvancedFilter: React.FC<OrphanAdvancedFilterProps> = ({
  filters,
  healthStatuses,
  educationalStages,
  onFiltersChange,
  onSearch,
  onReset,
  resultsCount,
  isSearching = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // تطبيق البحث فوراً عند تغيير أي فلتر
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 50);

    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleFilterChange = (key: keyof OrphanFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    onFiltersChange(newFilters);
  };

  const handleRangeChange = (rangeKey: 'ageRange' | 'birthDateRange' | 'siblingsRange', field: 'min' | 'max' | 'from' | 'to', value: string) => {
    const newFilters = {
      ...filters,
      [rangeKey]: {
        ...filters[rangeKey],
        [field]: value
      }
    };
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = () => {
    return filters.selectedGender || 
           filters.selectedHealthStatus || 
           filters.selectedEducationalStage ||
           filters.ageRange.min || 
           filters.ageRange.max ||
           filters.birthDateRange.from || 
           filters.birthDateRange.to ||
           filters.siblingsRange.min || 
           filters.siblingsRange.max ||
           filters.searchTerm;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* شريط الفلاتر */}
      <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            الفلاتر والتصفية المتقدمة للأيتام
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 border rounded-lg transition-colors ${
                isExpanded 
                  ? 'bg-amber-100 border-amber-300 text-amber-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>فلترة متقدمة</span>
              {hasActiveFilters() && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            {hasActiveFilters() && (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>إعادة تعيين</span>
              </button>
            )}
          </div>
        </div>

        {/* عداد النتائج */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-amber-600">{resultsCount}</span> يتيم
            {isSearching && (
              <span className="mr-2 rtl:ml-2 rtl:mr-0 text-amber-600">
                (جاري التحديث...)
              </span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <div className="text-sm text-amber-600 font-medium">
              الفلاتر نشطة - التحديث فوري
            </div>
          )}
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-6">
            {/* البحث العام */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                البحث العام
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">البحث في جميع الحقول</label>
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    placeholder="ابحث بالاسم أو رقم الهوية أو اسم الشهيد أو اسم الوصي..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* الفلاتر الأساسية */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                الفلاتر الأساسية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">الجنس</label>
                  <select
                    value={filters.selectedGender}
                    onChange={(e) => handleFilterChange('selectedGender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">جميع الأجناس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">الحالة الصحية</label>
                  <select
                    value={filters.selectedHealthStatus}
                    onChange={(e) => handleFilterChange('selectedHealthStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">جميع الحالات الصحية</option>
                    {healthStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">المرحلة الدراسية</label>
                  <select
                    value={filters.selectedEducationalStage}
                    onChange={(e) => handleFilterChange('selectedEducationalStage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">جميع المراحل الدراسية</option>
                    {educationalStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* فلاتر العمر والتاريخ */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                فلاتر العمر والتاريخ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* نطاق العمر */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-3">نطاق العمر (بالسنوات)</label>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="من"
                        value={filters.ageRange.min}
                        onChange={(e) => handleRangeChange('ageRange', 'min', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        min="0"
                        max="25"
                      />
                    </div>
                    <span className="text-gray-500 text-sm">إلى</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="إلى"
                        value={filters.ageRange.max}
                        onChange={(e) => handleRangeChange('ageRange', 'max', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        min="0"
                        max="25"
                      />
                    </div>
                  </div>
                </div>

                {/* فترة تاريخ الميلاد */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0" />
                    فترة تاريخ الميلاد
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">من تاريخ</label>
                      <input
                        type="date"
                        value={filters.birthDateRange.from}
                        onChange={(e) => handleRangeChange('birthDateRange', 'from', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">إلى تاريخ</label>
                      <input
                        type="date"
                        value={filters.birthDateRange.to}
                        onChange={(e) => handleRangeChange('birthDateRange', 'to', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* فلاتر الأخوة */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                فلاتر الأخوة
              </h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-3">عدد الأخوة (ذكور وإناث)</label>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="من"
                      value={filters.siblingsRange.min}
                      onChange={(e) => handleRangeChange('siblingsRange', 'min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      min="0"
                    />
                  </div>
                  <span className="text-gray-500 text-sm">إلى</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="إلى"
                      value={filters.siblingsRange.max}
                      onChange={(e) => handleRangeChange('siblingsRange', 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* الفلاتر النشطة */}
            {hasActiveFilters() && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                  الفلاتر النشطة
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      بحث: {filters.searchTerm}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('searchTerm', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-amber-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.selectedGender && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      الجنس: {filters.selectedGender === 'male' ? 'ذكر' : 'أنثى'}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('selectedGender', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.selectedHealthStatus && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      الحالة الصحية: {filters.selectedHealthStatus}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('selectedHealthStatus', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.selectedEducationalStage && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      المرحلة الدراسية: {filters.selectedEducationalStage}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('selectedEducationalStage', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.ageRange.min || filters.ageRange.max) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      العمر: {filters.ageRange.min || '0'} - {filters.ageRange.max || '∞'} سنة
                      <button
                        type="button"
                        onClick={() => {
                          handleRangeChange('ageRange', 'min', '');
                          handleRangeChange('ageRange', 'max', '');
                        }}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-yellow-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.birthDateRange.from || filters.birthDateRange.to) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      تاريخ الميلاد: {filters.birthDateRange.from || '...'} - {filters.birthDateRange.to || '...'}
                      <button
                        type="button"
                        onClick={() => {
                          handleRangeChange('birthDateRange', 'from', '');
                          handleRangeChange('birthDateRange', 'to', '');
                        }}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-indigo-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.siblingsRange.min || filters.siblingsRange.max) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      عدد الأخوة: {filters.siblingsRange.min || '0'} - {filters.siblingsRange.max || '∞'}
                      <button
                        type="button"
                        onClick={() => {
                          handleRangeChange('siblingsRange', 'min', '');
                          handleRangeChange('siblingsRange', 'max', '');
                        }}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* معلومات */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-800">
                ✅ <strong>الفلاتر الذكية للأيتام:</strong> جميع الفلاتر تعمل فوراً عند التغيير مع إمكانية البحث بالعمر والمرحلة الدراسية والحالة الصحية!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};