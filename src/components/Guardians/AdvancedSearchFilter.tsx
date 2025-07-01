import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface AdvancedSearchFilterProps {
  filters: {
    selectedArea: string;
    selectedGender: string;
    selectedStatus: string;
    selectedMaritalStatus: string;
    wivesCountRange: { min: string; max: string };
    familyMembersRange: { min: string; max: string };
  };
  areas: Array<{ id: number; name: string }>;
  onFiltersChange: (filters: any) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching?: boolean;
  disableAreaFilter?: boolean;
}

export const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({
  filters,
  areas,
  onFiltersChange,
  onSearch,
  onReset,
  isSearching = false,
  disableAreaFilter = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleRangeChange = (rangeField: string, field: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      [rangeField]: { ...filters[rangeField as keyof typeof filters], [field]: value }
    });
  };

  const hasActiveFilters = () => {
    return filters.selectedArea || 
           filters.selectedGender || 
           filters.selectedStatus || 
           filters.selectedMaritalStatus ||
           filters.wivesCountRange.min || 
           filters.wivesCountRange.max ||
           filters.familyMembersRange.min || 
           filters.familyMembersRange.max;
  };

  return (
    <div className="space-y-3">
      {/* شريط الفلاتر */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <Filter className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">الفلاتر والتصفية المتقدمة</h3>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 border-2 rounded-lg transition-all duration-200 font-semibold text-xs ${
                isExpanded 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>فلترة متقدمة</span>
              {hasActiveFilters() && (
                <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </button>

            {hasActiveFilters() && (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                <span>إعادة تعيين</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
          <div className="space-y-4">
            {/* الفلاتر الأساسية */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                الفلاتر الأساسية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الحي</label>
                  <select
                    value={filters.selectedArea}
                    onChange={(e) => handleFilterChange('selectedArea', e.target.value)}
                    className={`w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 ${disableAreaFilter ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-300'}`}
                    disabled={disableAreaFilter}
                  >
                    <option value="">جميع الأحياء</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id.toString()}>{area.name}</option>
                    ))}
                  </select>
                  {disableAreaFilter && (
                    <p className="mt-1 text-xs text-blue-600 font-semibold">
                      تم تقييد العرض على منطقتك فقط
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الجنس</label>
                  <select
                    value={filters.selectedGender}
                    onChange={(e) => handleFilterChange('selectedGender', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">جميع الأجناس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الحالة الاجتماعية</label>
                  <select
                    value={filters.selectedMaritalStatus}
                    onChange={(e) => handleFilterChange('selectedMaritalStatus', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="متزوج">متزوج</option>
                    <option value="أرمل">أرمل</option>
                    <option value="مطلق">مطلق</option>
                    <option value="أعزب">أعزب</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">حالة الإقامة</label>
                  <select
                    value={filters.selectedStatus}
                    onChange={(e) => handleFilterChange('selectedStatus', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="resident">مقيم</option>
                    <option value="displaced">نازح</option>
                  </select>
                </div>
              </div>
            </div>

            {/* فلاتر النطاقات */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                فلاتر النطاقات
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                  <h5 className="text-xs font-bold text-gray-900 mb-2">عدد الزوجات</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأدنى</label>
                      <input
                        type="number"
                        value={filters.wivesCountRange.min}
                        onChange={(e) => handleRangeChange('wivesCountRange', 'min', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأقصى</label>
                      <input
                        type="number"
                        value={filters.wivesCountRange.max}
                        onChange={(e) => handleRangeChange('wivesCountRange', 'max', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                  <h5 className="text-xs font-bold text-gray-900 mb-2">عدد أفراد الأسرة</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأدنى</label>
                      <input
                        type="number"
                        value={filters.familyMembersRange.min}
                        onChange={(e) => handleRangeChange('familyMembersRange', 'min', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأقصى</label>
                      <input
                        type="number"
                        value={filters.familyMembersRange.max}
                        onChange={(e) => handleRangeChange('familyMembersRange', 'max', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="20"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};