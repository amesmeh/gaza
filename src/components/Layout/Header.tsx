import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LogOut, User, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };
  
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير عام';
      case 'representative': return 'مندوب منطقة';
      case 'observer': return 'مراقب عام';
      default: return 'مستخدم';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-[15px] transition-colors ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
        >
          <Home size={18} />
          <span>لوحة التحكم</span>
        </Link>
        {user && (
          <span className="font-medium text-gray-700 text-[15px]">{user.name} ({user.role})</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700">
          <div className="p-2 bg-teal-100 rounded-full">
            <User className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <div className="font-medium">{user?.name || 'المستخدم'}</div>
            <div className="text-xs text-gray-500">{user ? getRoleText(user.role) : ''}</div>
          </div>
        </div>
        
        {onLogout && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-[14px]"
          >
            تسجيل الخروج
          </button>
        )}
      </div>
    </header>
  );
};