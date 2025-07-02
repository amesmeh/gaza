import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { clearAllLocalStorage, clearLocalStorageItem, clearUsersFromLocalStorage } from '../../hooks/useLocalStorage';

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearAllData = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const success = clearAllLocalStorage();
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'تم حذف جميع البيانات بنجاح. سيتم إعادة تحميل الصفحة الآن.'
        });
        
        // إعادة تحميل الصفحة بعد ثانيتين
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: 'حدث خطأ أثناء حذف البيانات'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ غير متوقع'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearUsersData = async () => {
    if (!window.confirm('هل أنت متأكد من حذف بيانات المستخدمين؟ هذا سيحل مشاكل تسجيل الدخول.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const success = clearUsersFromLocalStorage();
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'تم حذف بيانات المستخدمين بنجاح. سيتم إعادة تحميل الصفحة الآن.'
        });
        
        // إعادة تحميل الصفحة بعد ثانيتين
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: 'حدث خطأ أثناء حذف بيانات المستخدمين'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ غير متوقع'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSpecificData = async (key: string, label: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف بيانات ${label}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const success = clearLocalStorageItem(key);
      
      if (success) {
        setMessage({
          type: 'success',
          text: `تم حذف بيانات ${label} بنجاح. سيتم إعادة تحميل الصفحة الآن.`
        });
        
        // إعادة تحميل الصفحة بعد ثانيتين
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: `حدث خطأ أثناء حذف بيانات ${label}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ غير متوقع'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dataTypes = [
    { key: 'areas', label: 'المناطق' },
    { key: 'guardians', label: 'أولياء الأمور' },
    { key: 'children', label: 'الأبناء' },
    { key: 'wives', label: 'الزوجات' },
    { key: 'martyrs', label: 'الشهداء' },
    { key: 'injured', label: 'الجرحى' },
    { key: 'orphans', label: 'الأيتام' },
    { key: 'aids', label: 'المساعدات' },
    { key: 'damages', label: 'الأضرار' },
    { key: 'medicalData', label: 'البيانات الطبية' },
    { key: 'registrationRequests', label: 'طلبات التسجيل' }
  ];

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
      </div>

      {/* رسالة النتيجة */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* قسم إدارة البيانات */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة البيانات</h2>
        
        <div className="space-y-4">
          {/* حذف بيانات المستخدمين */}
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-orange-900">حذف بيانات المستخدمين</h3>
                <p className="text-orange-700 mt-1">
                  لحل مشاكل تسجيل الدخول - سيتم إعادة تعيين بيانات المستخدمين للبيانات الافتراضية
                </p>
              </div>
              <button
                onClick={handleClearUsersData}
                disabled={isLoading}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>{isLoading ? 'جاري الحذف...' : 'حذف بيانات المستخدمين'}</span>
              </button>
            </div>
          </div>

          {/* حذف جميع البيانات */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-red-900">حذف جميع البيانات</h3>
                <p className="text-red-700 mt-1">
                  سيتم حذف جميع البيانات المحفوظة وإعادة تعيين التطبيق إلى حالته الأولية
                </p>
              </div>
              <button
                onClick={handleClearAllData}
                disabled={isLoading}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                <span>{isLoading ? 'جاري الحذف...' : 'حذف جميع البيانات'}</span>
              </button>
            </div>
          </div>

          {/* حذف بيانات محددة */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">حذف بيانات محددة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dataTypes.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleClearSpecificData(key, label)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-gray-700">{label}</span>
                  <RotateCcw className="h-4 w-4 text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">ملاحظة مهمة</h3>
            <p className="text-blue-700 text-sm mt-1">
              جميع البيانات تُحفظ محلياً في متصفحك. عند حذف البيانات، سيتم إعادة تعيينها إلى البيانات الوهمية الأصلية.
              تأكد من تصدير البيانات المهمة قبل الحذف.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 