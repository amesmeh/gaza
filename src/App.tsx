import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { mockAreas, mockGuardians, mockWives, mockChildren, mockAids, mockMartyrs, mockInjured, mockMedicalData, mockOrphans, mockDamages, mockRegistrationRequests } from './data/mockData';
import { RegistrationRequestsPage } from './components/RegistrationRequests/RegistrationRequestsPage';
import { OrphansPage } from './components/Orphans/OrphansPage';
import { DamagesPage } from './components/Damages/DamagesPage';
import { MartyrsPage } from './components/Martyrs/MartyrsPage';
import { InjuredPage } from './components/Injured/InjuredPage';
import { MedicalDataPage } from './components/MedicalData/MedicalDataPage';
import { AidsPage } from './components/Aids/AidsPage';
import { GuardiansPage } from './components/Guardians/GuardiansPage';
import { AreasPage } from './components/Areas/AreasPage';
import { WivesPage } from './components/Wives/WivesPage';
import { ChildrenPage } from './components/Children/ChildrenPage';
import { ExternalRegistrationPage } from './components/RegistrationRequests/ExternalRegistrationPage';
import { LoginPage } from './components/Auth/LoginPage';
import { UnauthorizedPage } from './components/Auth/UnauthorizedPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { UserManagement } from './components/Auth/UserManagement';
import { Settings } from './components/Common/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">لوحة التحكم</h1>
      <p className="text-gray-600 mb-6">مرحباً بك {user?.name || ''} في نظام إدارة المساعدات لقطاع غزة</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-2">أولياء الأمور</h3>
          <p className="text-3xl font-bold text-blue-700">{mockGuardians.length}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-bold text-green-900 mb-2">المساعدات</h3>
          <p className="text-3xl font-bold text-green-700">{mockAids.length}</p>
        </div>
        
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className="text-lg font-bold text-red-900 mb-2">الشهداء</h3>
          <p className="text-3xl font-bold text-red-700">{mockMartyrs.length}</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <h3 className="text-lg font-bold text-purple-900 mb-2">المناطق</h3>
          <p className="text-3xl font-bold text-purple-700">{mockAreas.length}</p>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-100">
        <h3 className="text-lg font-bold text-yellow-900 mb-4">معلومات الصلاحيات</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <div className="p-1 bg-red-100 rounded-full mt-0.5">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">المدير العام</p>
              <p className="text-sm text-gray-600">له صلاحية على كل البرنامج بكل التفاصيل</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <div className="p-1 bg-blue-100 rounded-full mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">مندوب منطقة</p>
              <p className="text-sm text-gray-600">له صلاحية للاطلاع فقط على منطقته وعلى بيانات الجرحى والشهداء والمرضى والأضرار والأيتام، لكن بالنسبة لأولياء الأمور والمساعدات فقط على منطقته</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <div className="p-1 bg-green-100 rounded-full mt-0.5">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">المراقب العام</p>
              <p className="text-sm text-gray-600">له صلاحية أن يطلع على كل البرنامج دون إضافة أو حذف أو تعديل</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/registration-requests" element={<RegistrationRequestsPage />} />
            <Route path="/orphans" element={<OrphansPage />} />
            <Route path="/damages" element={<DamagesPage />} />
            <Route path="/martyrs" element={<MartyrsPage />} />
            <Route path="/injured" element={<InjuredPage />} />
            <Route path="/medical-data" element={<MedicalDataPage />} />
            <Route path="/aids" element={<AidsPage />} />
            <Route path="/guardians" element={<GuardiansPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/wives" element={<WivesPage />} />
            <Route path="/children" element={<ChildrenPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<ExternalRegistrationPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppContent />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;