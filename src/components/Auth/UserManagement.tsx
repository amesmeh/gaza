import React, { useState, useEffect } from 'react';
import { User, Area } from '../../types';
import { Modal } from '../Common/Modal';
import { UserForm } from './UserForm';
import { UserTable } from './UserTable';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { mockAreas } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers.map(({ password, ...user }) => user));
  const [areas, setAreas] = useLocalStorage<Area[]>('areas', mockAreas);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // محاكاة جلب البيانات من الخادم
  useEffect(() => {
    const fetchData = async () => {
      try {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // استخدام mockUsers مباشرة
        setUsers(mockUsers.map(({ password, ...user }) => user));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // تطبيق البحث
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      return;
    }
    
    const searchResults = users.filter(user => {
      const term = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.role === 'admin' && 'مدير عام'.includes(term)) ||
        (user.role === 'representative' && 'مندوب منطقة'.includes(term)) ||
        (user.role === 'observer' && 'مراقب عام'.includes(term))
      );
    });
    
    setFilteredUsers(searchResults);
  }, [searchTerm, users]);

  const handleAddUser = (data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...data,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString()
    };
    
    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (data: Omit<User, 'id' | 'createdAt'>) => {
    if (!selectedUser) return;
    
    const updatedUser: User = {
      ...data,
      id: selectedUser.id,
      createdAt: selectedUser.createdAt
    };
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    ));
    
    setIsEditModalOpen(false);
  };

  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // لا يمكن حذف المستخدم الحالي
    if (user.id === currentUser?.id) {
      alert('لا يمكنك حذف حسابك الحالي');
      return;
    }
    
    if (window.confirm(`هل أنت متأكد من حذف المستخدم ${user.name}؟`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="mr-3 text-gray-700">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان وأزرار الإجراءات */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة مستخدم جديد</span>
          </button>
        </div>
      </div>

      {/* البحث البسيط */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base placeholder-gray-500"
            placeholder="البحث في المستخدمين (الاسم، اسم المستخدم، البريد الإلكتروني...)"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium text-teal-600">{filteredUsers.length}</span> مستخدم
          {searchTerm && (
            <span className="mr-2 rtl:ml-2 rtl:mr-0">
              للبحث عن: <span className="font-medium text-gray-900">"{searchTerm}"</span>
            </span>
          )}
        </div>
      </div>

      {/* جدول المستخدمين */}
      <UserTable
        users={filteredUsers}
        areas={areas}
        onEdit={handleEditUserClick}
        onDelete={handleDeleteUser}
        currentUserId={currentUser?.id || 0}
      />

      {/* نافذة إضافة مستخدم جديد */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مستخدم جديد"
        size="md"
      >
        <UserForm
          areas={areas}
          onSubmit={handleAddUser}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* نافذة تعديل مستخدم */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`تعديل بيانات المستخدم: ${selectedUser?.name || ''}`}
        size="md"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            areas={areas}
            onSubmit={handleEditUser}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};