import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw, Calendar } from 'lucide-react';

interface ChildrenFilters {
  selectedArea: string;
  selectedGuardian: string;
  selectedMaritalStatus: string;
  selectedResidenceStatus: string;
  wivesCountRange: { min: string; max: string };
  familyMembersRange: { min: string; max: string };
  birthDateRange: { from: string; to: string };
  ageRange: { min: string; max: string };
}

interface ChildrenAdvancedFilterProps {
  filters: ChildrenFilters;
  areas: Array<{ id: number; name: string }>;
  guardians: Array<{ id: number; name: string; nationalId: string; maritalStatus: string; residenceStatus: string; wivesCount: number; familyMembersCount: number }>;
  onFiltersChange: (filters: ChildrenFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching?: boolean;
}

export const ChildrenAdvancedFilter: React.FC<ChildrenAdvancedFilterProps> = ({
  filters,
  areas,
  guardians,
  onFiltersChange,
  onSearch,
  onReset,
  isSearching = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ChildrenFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    onFiltersChange(newFilters);
  };

  const handleRangeChange = (rangeKey: 'wivesCountRange' | 'familyMembersRange' | 'birthDateRange' | 'ageRange', field: 'min' | 'max' | 'from' | 'to', value: string) => {
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
              <h3 className="text-sm font-bold text-gray-900">الفلاتر والتصفية المتقدمة للأبناء</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المنطقة</label>
                  <select
                    value={filters.selectedArea}
                    onChange={(e) => handleFilterChange('selectedArea', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">جميع المناطق</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id.toString()}>{area.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ولي الأمر</label>
                  <select
                    value={filters.selectedGuardian}
                    onChange={(e) => handleFilterChange('selectedGuardian', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                  >
                    <option value="">جميع أولياء الأمور</option>
                    {guardians.map(guardian => (
                      <option key={guardian.id} value={guardian.id.toString()}>
                        {guardian.name} - {guardian.nationalId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* فلاتر ولي الأمر */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                فلاتر ولي الأمر
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الحالة الاجتماعية</label>
                  <select
                    value={filters.selectedMaritalStatus}
                    onChange={(e) => handleFilterChange('selectedMaritalStatus', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
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
                    value={filters.selectedResidenceStatus}
                    onChange={(e) => handleFilterChange('selectedResidenceStatus', e.target.value)}
                    className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
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
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                فلاتر النطاقات
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                  <h5 className="text-xs font-bold text-gray-900 mb-2">نطاق العمر</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأدنى</label>
                      <input
                        type="number"
                        value={filters.ageRange.min}
                        onChange={(e) => handleRangeChange('ageRange', 'min', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">الحد الأقصى</label>
                      <input
                        type="number"
                        value={filters.ageRange.max}
                        onChange={(e) => handleRangeChange('ageRange', 'max', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="18"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                  <h5 className="text-xs font-bold text-gray-900 mb-2">تاريخ الميلاد</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">من تاريخ</label>
                      <input
                        type="date"
                        value={filters.birthDateRange.from}
                        onChange={(e) => handleRangeChange('birthDateRange', 'from', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">إلى تاريخ</label>
                      <input
                        type="date"
                        value={filters.birthDateRange.to}
                        onChange={(e) => handleRangeChange('birthDateRange', 'to', e.target.value)}
                        className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs transition-all duration-200 bg-white hover:border-gray-300"
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