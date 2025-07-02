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

export interface Area {
  _id?: string;
  name: string;
  representativeName?: string;
  representativeId?: string;
  representativePhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Child {
  _id?: string;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Martyr {
  _id?: string;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  martyrdomDate: string;
  martyrdomLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Injured {
  _id?: string;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  injuryDate: string;
  injuryType?: string;
  injuryLocation?: string;
  treatmentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalData {
  _id?: string;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  medicalCondition?: string;
  medications?: string[];
  allergies?: string[];
  bloodType?: string;
  emergencyContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Orphan {
  _id?: string;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  orphanageStatus?: string;
  supportType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Damage {
  _id?: string;
  guardianId: string;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: string;
  areaName?: string;
  damageType: string;
  damageDate: string;
  damageLocation?: string;
  damageDescription?: string;
  estimatedCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationRequest {
  _id?: string;
  status: 'pending' | 'approved' | 'rejected';
  // بيانات ولي الأمر
  name: string;
  nationalId: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  maritalStatus: string;
  currentJob?: string;
  residenceStatus: 'resident' | 'displaced';
  originalGovernorate?: string;
  originalCity?: string;
  displacementAddress?: string;
  areaId?: string;
  areaName?: string;
  // بيانات الزوجات والأبناء
  wives: {
    name: string;
    nationalId: string;
  }[];
  children: {
    name: string;
    nationalId: string;
    birthDate: string;
    gender: 'male' | 'female';
  }[];
  notes?: string;
  requestType?: string;
  requestDetails?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
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

// دوال API للمناطق
export const areasAPI = {
  // جلب جميع المناطق
  getAll: async (): Promise<Area[]> => {
    const response = await fetch(`${API_BASE_URL}/areas`);
    if (!response.ok) {
      throw new Error('فشل في جلب المناطق');
    }
    return response.json();
  },

  // إضافة منطقة جديدة
  create: async (area: Omit<Area, '_id' | 'createdAt' | 'updatedAt'>): Promise<Area> => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(area),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة المنطقة');
    }
    return response.json();
  },

  // تحديث منطقة
  update: async (id: string, area: Partial<Area>): Promise<Area> => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(area),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث المنطقة');
    }
    return response.json();
  },

  // حذف منطقة
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف المنطقة');
    }
  },
};

// دوال API للأبناء
export const childrenAPI = {
  // جلب جميع الأبناء
  getAll: async (): Promise<Child[]> => {
    const response = await fetch(`${API_BASE_URL}/children`);
    if (!response.ok) {
      throw new Error('فشل في جلب الأبناء');
    }
    return response.json();
  },

  // إضافة ابن جديد
  create: async (child: Omit<Child, '_id' | 'createdAt' | 'updatedAt'>): Promise<Child> => {
    const response = await fetch(`${API_BASE_URL}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(child),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة الابن');
    }
    return response.json();
  },

  // تحديث ابن
  update: async (id: string, child: Partial<Child>): Promise<Child> => {
    const response = await fetch(`${API_BASE_URL}/children/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(child),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث الابن');
    }
    return response.json();
  },

  // حذف ابن
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/children/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الابن');
    }
  },

  // حذف مجموعة من الأبناء
  deleteMany: async (ids: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/children`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الأبناء');
    }
  },
};

// دوال API للشهداء
export const martyrsAPI = {
  // جلب جميع الشهداء
  getAll: async (): Promise<Martyr[]> => {
    const response = await fetch(`${API_BASE_URL}/martyrs`);
    if (!response.ok) {
      throw new Error('فشل في جلب الشهداء');
    }
    return response.json();
  },

  // إضافة شهيد جديد
  create: async (martyr: Omit<Martyr, '_id' | 'createdAt' | 'updatedAt'>): Promise<Martyr> => {
    const response = await fetch(`${API_BASE_URL}/martyrs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(martyr),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة الشهيد');
    }
    return response.json();
  },

  // تحديث شهيد
  update: async (id: string, martyr: Partial<Martyr>): Promise<Martyr> => {
    const response = await fetch(`${API_BASE_URL}/martyrs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(martyr),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث الشهيد');
    }
    return response.json();
  },

  // حذف شهيد
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/martyrs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الشهيد');
    }
  },

  // حذف مجموعة من الشهداء
  deleteMany: async (ids: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/martyrs`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الشهداء');
    }
  },
};

// دوال API للجرحى
export const injuredAPI = {
  // جلب جميع الجرحى
  getAll: async (): Promise<Injured[]> => {
    const response = await fetch(`${API_BASE_URL}/injured`);
    if (!response.ok) {
      throw new Error('فشل في جلب الجرحى');
    }
    return response.json();
  },

  // إضافة جريح جديد
  create: async (injured: Omit<Injured, '_id' | 'createdAt' | 'updatedAt'>): Promise<Injured> => {
    const response = await fetch(`${API_BASE_URL}/injured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(injured),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة الجريح');
    }
    return response.json();
  },

  // تحديث جريح
  update: async (id: string, injured: Partial<Injured>): Promise<Injured> => {
    const response = await fetch(`${API_BASE_URL}/injured/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(injured),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث الجريح');
    }
    return response.json();
  },

  // حذف جريح
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/injured/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الجريح');
    }
  },

  // حذف مجموعة من الجرحى
  deleteMany: async (ids: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/injured`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الجرحى');
    }
  },
};

// دوال API للبيانات الطبية
export const medicalDataAPI = {
  // جلب جميع البيانات الطبية
  getAll: async (): Promise<MedicalData[]> => {
    const response = await fetch(`${API_BASE_URL}/medical-data`);
    if (!response.ok) {
      throw new Error('فشل في جلب البيانات الطبية');
    }
    return response.json();
  },

  // إضافة بيانات طبية جديدة
  create: async (medicalData: Omit<MedicalData, '_id' | 'createdAt' | 'updatedAt'>): Promise<MedicalData> => {
    const response = await fetch(`${API_BASE_URL}/medical-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicalData),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة البيانات الطبية');
    }
    return response.json();
  },

  // تحديث بيانات طبية
  update: async (id: string, medicalData: Partial<MedicalData>): Promise<MedicalData> => {
    const response = await fetch(`${API_BASE_URL}/medical-data/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicalData),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث البيانات الطبية');
    }
    return response.json();
  },

  // حذف بيانات طبية
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/medical-data/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف البيانات الطبية');
    }
  },
};

// دوال API للأيتام
export const orphansAPI = {
  // جلب جميع الأيتام
  getAll: async (): Promise<Orphan[]> => {
    const response = await fetch(`${API_BASE_URL}/orphans`);
    if (!response.ok) {
      throw new Error('فشل في جلب الأيتام');
    }
    return response.json();
  },

  // إضافة يتيم جديد
  create: async (orphan: Omit<Orphan, '_id' | 'createdAt' | 'updatedAt'>): Promise<Orphan> => {
    const response = await fetch(`${API_BASE_URL}/orphans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orphan),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة اليتيم');
    }
    return response.json();
  },

  // تحديث يتيم
  update: async (id: string, orphan: Partial<Orphan>): Promise<Orphan> => {
    const response = await fetch(`${API_BASE_URL}/orphans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orphan),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث اليتيم');
    }
    return response.json();
  },

  // حذف يتيم
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/orphans/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف اليتيم');
    }
  },
};

// دوال API للأضرار
export const damagesAPI = {
  // جلب جميع الأضرار
  getAll: async (): Promise<Damage[]> => {
    const response = await fetch(`${API_BASE_URL}/damages`);
    if (!response.ok) {
      throw new Error('فشل في جلب الأضرار');
    }
    return response.json();
  },

  // إضافة ضرر جديد
  create: async (damage: Omit<Damage, '_id' | 'createdAt' | 'updatedAt'>): Promise<Damage> => {
    const response = await fetch(`${API_BASE_URL}/damages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(damage),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة الضرر');
    }
    return response.json();
  },

  // تحديث ضرر
  update: async (id: string, damage: Partial<Damage>): Promise<Damage> => {
    const response = await fetch(`${API_BASE_URL}/damages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(damage),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث الضرر');
    }
    return response.json();
  },

  // حذف ضرر
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/damages/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف الضرر');
    }
  },
};

// دوال API لطلبات التسجيل
export const registrationRequestsAPI = {
  // جلب جميع طلبات التسجيل
  getAll: async (): Promise<RegistrationRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/registration-requests`);
    if (!response.ok) {
      throw new Error('فشل في جلب طلبات التسجيل');
    }
    return response.json();
  },

  // إضافة طلب تسجيل جديد
  create: async (request: Omit<RegistrationRequest, '_id' | 'createdAt' | 'updatedAt'>): Promise<RegistrationRequest> => {
    const response = await fetch(`${API_BASE_URL}/registration-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('فشل في إضافة طلب التسجيل');
    }
    return response.json();
  },

  // تحديث طلب تسجيل
  update: async (id: string, request: Partial<RegistrationRequest>): Promise<RegistrationRequest> => {
    const response = await fetch(`${API_BASE_URL}/registration-requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('فشل في تحديث طلب التسجيل');
    }
    return response.json();
  },

  // حذف طلب تسجيل
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/registration-requests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('فشل في حذف طلب التسجيل');
    }
  },
}; 