import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Lock, LogIn, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, isAuthenticated, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  // إذا كان المستخدم مسجل الدخول بالفعل، قم بتوجيهه إلى الصفحة الرئيسية
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!username.trim() || !password.trim()) {
      setLocalError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    console.log('محاولة تسجيل الدخول:', { username, password });
    
    const success = await login({ username, password });
    if (success) {
      navigate('/');
    } else {
      // إذا فشل تسجيل الدخول، اعرض رسالة الخطأ
      setLocalError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  // عرض رسالة الخطأ من AuthContext أو من النموذج المحلي
  const displayError = authError || localError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* رأس الصفحة */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 p-8 text-white text-center relative overflow-hidden">
            {/* خلفية مزخرفة */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">برنامج المساعدات</h1>
              <p className="text-teal-100 text-lg">قطاع غزة</p>
              <p className="mt-3 text-teal-200 text-sm">تسجيل الدخول إلى نظام الإدارة</p>
            </div>
          </div>
          
          {/* نموذج تسجيل الدخول */}
          <div className="p-8">
            {displayError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 animate-fade-in">
                <AlertCircle className="h-5 w-5 ml-3 rtl:mr-3 rtl:ml-0 text-red-500 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-lg"
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-lg"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-3 rtl:space-x-reverse px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all duration-200 font-semibold text-lg ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>جاري تسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-6 w-6" />
                      <span>تسجيل الدخول</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* معلومات إضافية */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-teal-600 ml-2" />
                <h3 className="text-sm font-semibold text-gray-700">نظام آمن ومحمي</h3>
              </div>
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                يتم تشفير جميع البيانات وحمايتها وفقاً لأعلى معايير الأمان.
                <br />
                للوصول للنظام، يرجى التواصل مع المدير العام.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500 mb-2">
            <p>© 2024 برنامج المساعدات - قطاع غزة</p>
          </div>
          <div className="text-xs text-gray-400">
            <p>جميع الحقوق محفوظة | تطوير الأخ/ عاطف سعيد مسمح</p>
          </div>
        </div>
      </div>
    </div>
  );
};