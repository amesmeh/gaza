const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gaza-aids.onrender.com';

// أنواع البيانات
export interface Aid {
  _id?: string;
  guardianNationalId: string;
  guardianName?: string;
  areaName?: string;
  guardianPhone?: string;
  aidType: string;
  aidDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Guardian {
  _id?: string;
  name: string;
  nationalId: string;
  phone: string;
  gender: 'male' | 'female';
  maritalStatus: string;
  childrenCount: number;
  wivesCount: number;
  familyMembersCount: number;
  currentJob?: string;
  residenceStatus: 'resident' | 'displaced';
  originalGovernorate?: string;
  originalCity?: string;
  displacementAddress?: string;
  areaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// دوال API للمساعدات
export const aidsAPI = {
  // جلب جميع المساعدات
  getAll: async (): Promise<Aid[]> => {
    const response = await fetch(`${API_BASE_URL}/aids`);
    if (!response.ok) {
      throw new Error('فشل في جلب المساعدات');
    }
    return response.json();
  },

  // إضافة مساعدة جديدة
  create: async (aid: Omit<Aid, '_id' | 'createdAt' | 'updatedAt'>): Promise<Aid> => {
    const response = await fetch(`${API_BASE_URL}/aids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aid),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة المساعدة');
    }
    return response.json();
  },

  // تحديث مساعدة
  update: async (id: string, aid: Partial<Aid>): Promise<Aid> => {
    const response = await fetch(`${API_BASE_URL}/aids/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aid),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث المساعدة');
    }
    return response.json();
  },

  // حذف مساعدة
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/aids/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف المساعدة');
    }
  },
};

// دوال API لأولياء الأمور
export const guardiansAPI = {
  // جلب جميع أولياء الأمور
  getAll: async (): Promise<Guardian[]> => {
    const response = await fetch(`${API_BASE_URL}/guardians`);
    if (!response.ok) {
      throw new Error('فشل في جلب أولياء الأمور');
    }
    return response.json();
  },

  // إضافة ولي أمر جديد
  create: async (guardian: Omit<Guardian, '_id' | 'createdAt' | 'updatedAt'>): Promise<Guardian> => {
    const response = await fetch(`${API_BASE_URL}/guardians`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guardian),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة ولي الأمر');
    }
    return response.json();
  },

  // تحديث ولي أمر
  update: async (id: string, guardian: Partial<Guardian>): Promise<Guardian> => {
    const response = await fetch(`${API_BASE_URL}/guardians/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guardian),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث ولي الأمر');
    }
    return response.json();
  },

  // حذف ولي أمر
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/guardians/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف ولي الأمر');
    }
  },
}; 