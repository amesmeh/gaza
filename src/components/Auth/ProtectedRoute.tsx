import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuth();

  // إذا كان التحميل جارياً، اعرض شاشة التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">جاري التحقق من الصلاحيات...</p>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان هناك صلاحية مطلوبة، تحقق منها
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // إذا كان المستخدم مسجل الدخول ولديه الصلاحية المطلوبة، اعرض المحتوى
  return <Outlet />;
};