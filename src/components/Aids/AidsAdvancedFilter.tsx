import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw, Calendar } from 'lucide-react';

interface AidsFilters {
  selectedArea: string;
  selectedAidType: string;
  selectedGuardian: string;
  dateRange: { from: string; to: string };
}

interface AidsAdvancedFilterProps {
  filters: AidsFilters;
  areas: Array<{ id: number; name: string }>;
  guardians: Array<{ id: number; name: string; nationalId: string }>;
  onFiltersChange: (filters: AidsFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  resultsCount: number;
  isSearching?: boolean;
  disableAreaFilter?: boolean;
}

export const AidsAdvancedFilter: React.FC<AidsAdvancedFilterProps> = ({
  filters,
  areas,
  guardians,
  onFiltersChange,
  onSearch,
  onReset,
  resultsCount,
  isSearching = false,
  disableAreaFilter = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // تطبيق البحث فوراً عند تغيير أي فلتر
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 50);

    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleFilterChange = (key: keyof AidsFilters, value: any) => {
    // إذا كان فلتر المنطقة معطل، لا تسمح بتغييره
    if (key === 'selectedArea' && disableAreaFilter) {
      return;
    }
    
    const newFilters = {
      ...filters,
      [key]: value
    };
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    };
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedAidType || 
           filters.selectedGuardian ||
           filters.dateRange.from ||
           filters.dateRange.to;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* شريط الفلاتر */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            الفلاتر والتصفية المتقدمة للمساعدات
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 border rounded-lg transition-colors ${
                isExpanded 
                  ? 'bg-green-100 border-green-300 text-green-700' 
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
            <span className="font-medium text-green-600">{resultsCount}</span> مساعدة
            {isSearching && (
              <span className="mr-2 rtl:ml-2 rtl:mr-0 text-green-600">
                (جاري التحديث...)
              </span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <div className="text-sm text-green-600 font-medium">
              الفلاتر نشطة - التحديث فوري
            </div>
          )}
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-6">
            {/* الفلاتر الأساسية */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                الفلاتر الأساسية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">المنطقة</label>
                  <select
                    value={filters.selectedArea}
                    onChange={(e) => handleFilterChange('selectedArea', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm ${disableAreaFilter ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={disableAreaFilter}
                  >
                    <option value="">جميع المناطق</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id.toString()}>{area.name}</option>
                    ))}
                  </select>
                  {disableAreaFilter && (
                    <p className="mt-1 text-xs text-green-600">
                      تم تقييد العرض على منطقتك فقط
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">نوع المساعدة</label>
                  <input
                    type="text"
                    value={filters.selectedAidType}
                    onChange={(e) => handleFilterChange('selectedAidType', e.target.value)}
                    placeholder="ابحث عن نوع المساعدة..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">ولي الأمر</label>
                  <select
                    value={filters.selectedGuardian}
                    onChange={(e) => handleFilterChange('selectedGuardian', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">جميع أولياء الأمور</option>
                    {guardians.map(guardian => (
                      <option key={guardian.id} value={guardian.nationalId}>
                        {guardian.name} - {guardian.nationalId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* فلاتر التاريخ */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 rtl:mr-2 rtl:ml-0"></div>
                فلاتر التاريخ
              </h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0" />
                  فترة تاريخ المساعدة
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">من تاريخ</label>
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => handleDateRangeChange('from', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">إلى تاريخ</label>
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => handleDateRangeChange('to', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                  {filters.selectedArea && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      المنطقة: {areas.find(a => a.id.toString() === filters.selectedArea)?.name}
                      {!disableAreaFilter && (
                        <button
                          type="button"
                          onClick={() => handleFilterChange('selectedArea', '')}
                          className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-green-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  )}
                  {filters.selectedAidType && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      النوع: {filters.selectedAidType}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('selectedAidType', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.selectedGuardian && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      ولي الأمر: {guardians.find(g => g.nationalId === filters.selectedGuardian)?.name}
                      <button
                        type="button"
                        onClick={() => handleFilterChange('selectedGuardian', '')}
                        className="mr-1 rtl:ml-1 rtl:mr-0 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.dateRange.from || filters.dateRange.to) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      التاريخ: {filters.dateRange.from || '...'} - {filters.dateRange.to || '...'}
                      <button
                        type="button"
                        onClick={() => {
                          handleDateRangeChange('from', '');
                          handleDateRangeChange('to', '');
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
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                ✅ <strong>الفلاتر الذكية للمساعدات:</strong> جميع الفلاتر تعمل فوراً عند التغيير مع إمكانية البحث بالتاريخ والنوع!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};