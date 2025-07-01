import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // الحصول على القيمة من localStorage أو استخدام القيمة الافتراضية
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        // إذا كانت البيانات موجودة في localStorage، استخدمها حتى لو كانت فارغة
        return parsed;
      }
      // فقط إذا لم تكن البيانات موجودة في localStorage أصلاً، استخدم القيمة الافتراضية
      return initialValue;
    } catch (error) {
      console.error(`خطأ في قراءة ${key} من localStorage:`, error);
      return initialValue;
    }
  });

  // دالة لتحديث القيمة
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // السماح بالقيمة أو دالة لتحديث القيمة
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // حفظ في localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`تم حفظ ${key} في localStorage:`, valueToStore);
    } catch (error) {
      console.error(`خطأ في حفظ ${key} في localStorage:`, error);
    }
  };

  // التأكد من أن البيانات محفوظة في localStorage عند التحميل
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item && storedValue !== initialValue) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
        console.log(`تم حفظ ${key} في localStorage عند التحميل:`, storedValue);
      }
    } catch (error) {
      console.error(`خطأ في حفظ ${key} في localStorage عند التحميل:`, error);
    }
  }, [key, storedValue, initialValue]);

  return [storedValue, setValue] as const;
}

// دالة لحذف جميع البيانات من localStorage
export const clearAllLocalStorage = () => {
  try {
    const keys = [
      'areas',
      'guardians', 
      'children',
      'wives',
      'martyrs',
      'injured',
      'orphans',
      'aids',
      'damages',
      'medicalData',
      'registrationRequests',
      'users'
    ];
    
    keys.forEach(key => {
      window.localStorage.removeItem(key);
    });
    
    console.log('تم حذف جميع البيانات من localStorage بنجاح');
    return true;
  } catch (error) {
    console.error('خطأ في حذف البيانات من localStorage:', error);
    return false;
  }
};

// دالة لحذف بيانات محددة من localStorage
export const clearLocalStorageItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
    console.log(`تم حذف ${key} من localStorage بنجاح`);
    return true;
  } catch (error) {
    console.error(`خطأ في حذف ${key} من localStorage:`, error);
    return false;
  }
};

// دالة لحذف بيانات المستخدمين من localStorage
export const clearUsersFromLocalStorage = () => {
  try {
    window.localStorage.removeItem('users');
    console.log('تم حذف بيانات المستخدمين من localStorage بنجاح');
    return true;
  } catch (error) {
    console.error('خطأ في حذف بيانات المستخدمين من localStorage:', error);
    return false;
  }
};