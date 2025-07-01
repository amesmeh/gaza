import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">غير مصرح بالوصول</h1>
          <p className="mt-2 text-red-100">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">
              عزيزي <span className="font-bold">{user?.name || 'المستخدم'}</span>، أنت مسجل الدخول كـ{' '}
              <span className="font-bold">
                {user?.role === 'admin' ? 'مدير عام' : 
                 user?.role === 'representative' ? 'مندوب منطقة' : 
                 user?.role === 'observer' ? 'مراقب عام' : 'مستخدم'}
              </span>
              {user?.role === 'representative' && user?.areaId && (
                <span> في منطقة {user.areaId}</span>
              )}
              ، ولكن ليس لديك صلاحية للوصول إلى هذه الصفحة.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>العودة للصفحة السابقة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};