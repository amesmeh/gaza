import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthState } from '../types';
import { jwtDecode } from 'jwt-decode';
import { mockUsers } from '../data/mockUsers';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // التحقق من الجلسة عند تحميل التطبيق
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        return;
      }
      
      try {
        // محاكاة التحقق من الرمز
        const decoded = jwtDecode<{ user: User }>(token);
        
        // التحقق من صلاحية الرمز
        const currentTime = Date.now() / 1000;
        if ((decoded as any).exp && (decoded as any).exp < currentTime) {
          // الرمز منتهي الصلاحية
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
          });
          return;
        }
        
        setAuthState({
          user: decoded.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'حدث خطأ في التحقق من الجلسة'
        });
      }
    };
    
    verifyToken();
  }, []);

  // تسجيل الدخول
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // محاكاة طلب تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // التحقق من بيانات الاعتماد - استخدام mockUsers مباشرة
      const user = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        }));
        return false;
      }
      
      // إنشاء كائن المستخدم بدون كلمة المرور
      const userWithoutPassword: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        areaId: user.areaId,
        name: user.name,
        createdAt: user.createdAt
      };
      
      // إنشاء كائن البيانات للتشفير
      const tokenData = {
        user: userWithoutPassword,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // صالح لمدة 24 ساعة
      };
      
      // تحويل البيانات إلى سلسلة JSON
      const jsonString = JSON.stringify(tokenData);
      
      // تشفير البيانات باستخدام btoa مع معالجة الأحرف غير اللاتينية
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        unescape(encodeURIComponent(jsonString))
      )}.SIGNATURE`;
      
      // حفظ الرمز في التخزين المحلي
      localStorage.setItem('token', token);
      
      // تحديث حالة المصادقة
      setAuthState({
        user: userWithoutPassword,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      console.log('تم تسجيل الدخول بنجاح:', userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'حدث خطأ أثناء تسجيل الدخول'
      }));
      return false;
    }
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  // التحقق من الصلاحيات
  const checkPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    const { role, areaId } = authState.user;
    
    // المدير العام له جميع الصلاحيات
    if (role === 'admin') return true;
    
    // المراقب العام له صلاحية الاطلاع فقط
    if (role === 'observer') {
      // إذا كانت الصلاحية المطلوبة هي الاطلاع فقط
      return permission.startsWith('view');
    }
    
    // مندوب المنطقة له صلاحيات محددة
    if (role === 'representative' && areaId) {
      // صلاحيات الاطلاع على الجرحى والشهداء والمرضى والأضرار والأيتام
      if (
        permission.startsWith('view') && 
        (
          permission.includes('injured') || 
          permission.includes('martyrs') || 
          permission.includes('medical') || 
          permission.includes('damages') || 
          permission.includes('orphans')
        )
      ) {
        return true;
      }
      
      // صلاحيات أولياء الأمور والمساعدات فقط على منطقته
      if (
        permission.startsWith('view') && 
        (
          permission.includes('guardians') || 
          permission.includes('aids') ||
          permission.includes('wives') ||
          permission.includes('children')
        )
      ) {
        // مندوب المنطقة يمكنه رؤية هذه البيانات لمنطقته فقط
        return true;
      }
    }
    
    return false;
  };

  const value = {
    ...authState,
    login,
    logout,
    checkPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};