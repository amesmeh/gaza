import React, { useState, useEffect } from 'react';
import { User, Area } from '../../types';

interface UserFormProps {
  user?: User;
  areas: Area[];
  onSubmit: (data: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  areas, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    role: 'observer' as 'admin' | 'representative' | 'observer',
    areaId: undefined as number | undefined
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '', // لا نعرض كلمة المرور الحالية
        email: user.email,
        name: user.name,
        role: user.role,
        areaId: user.areaId
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من كلمة المرور
    if (!user && formData.password.length < 6) {
      setPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    if (!user && formData.password !== confirmPassword) {
      setPasswordError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }
    
    // التحقق من اختيار المنطقة لمندوب المنطقة
    if (formData.role === 'representative' && !formData.areaId) {
      alert('يجب اختيار المنطقة لمندوب المنطقة');
      return;
    }
    
    // إذا كان الدور ليس مندوب منطقة، قم بإزالة معرف المنطقة
    const finalData = {
      ...formData,
      areaId: formData.role === 'representative' ? formData.areaId : undefined
    };
    
    onSubmit(finalData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'areaId') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // إعادة تعيين خطأ كلمة المرور عند تغييرها
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* البيانات الأساسية */}
      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
        <h3 className="text-lg font-bold text-teal-900 mb-4">البيانات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المستخدم *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="أدخل اسم المستخدم"
              disabled={!!user} // لا يمكن تغيير اسم المستخدم في حالة التعديل
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدور *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="admin">مدير عام</option>
              <option value="representative">مندوب منطقة</option>
              <option value="observer">مراقب عام</option>
            </select>
          </div>

          {formData.role === 'representative' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنطقة *
              </label>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">اختر المنطقة</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* كلمة المرور */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">
          {user ? 'تغيير كلمة المرور (اختياري)' : 'كلمة المرور *'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور {!user && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user} // مطلوب فقط في حالة الإضافة
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={user ? 'اتركها فارغة للاحتفاظ بكلمة المرور الحالية' : 'أدخل كلمة المرور'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور {!user && '*'}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!user} // مطلوب فقط في حالة الإضافة
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>
        </div>
        
        {passwordError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {passwordError}
          </div>
        )}
        
        {user && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            ملاحظة: إذا لم ترغب في تغيير كلمة المرور، اترك الحقول فارغة.
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition-colors"
        >
          {user ? 'تحديث' : 'إضافة'}
        </button>
      </div>
    </form>
  );
};