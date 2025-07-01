export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'representative' | 'observer';
  areaId?: number;
  createdAt: string;
  name: string;
}

export interface Area {
  id: number;
  name: string;
  representativeName: string;
  representativeId: string;
  representativePhone: string;
  createdAt: string;
  updatedAt: string;
  guardiansCount?: number;
}

export interface Guardian {
  id: number;
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
  areaId: number;
  area?: Area;
  createdAt: string;
  updatedAt: string;
}

export interface Wife {
  id: number;
  name: string;
  nationalId: string;
  husbandId: number;
  husbandNationalId: string;
  husbandName?: string;
  areaId?: number;
  areaName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: number;
  name: string;
  nationalId: string;
  birthDate: string;
  age: number;
  guardianId: number;
  guardianName?: string;
  guardianNationalId?: string;
  areaId?: number;
  areaName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aid {
  id: number;
  guardianNationalId: string;
  guardianName?: string;
  guardianPhone?: string;
  aidType: string;
  aidDate: string;
  areaId?: number;
  areaName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Martyr {
  id: number;
  name: string;
  nationalId: string;
  martyrdomDate: string;
  agentName: string;
  agentNationalId: string;
  agentPhone: string;
  relationshipToMartyr: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Injured {
  id: number;
  name: string;
  nationalId: string;
  phone: string;
  injuryDate: string;
  injuryType: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalData {
  id: number;
  patientName: string;
  patientNationalId: string;
  guardianNationalId: string;
  guardianName?: string;
  diseaseType: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Orphan {
  id: number;
  name: string;
  nationalId: string;
  gender: 'male' | 'female';
  birthDate: string;
  age: number;
  healthStatus: string;
  educationalStage: string;
  martyrNationalId: string;
  martyrName: string;
  martyrdomDate: string;
  maleSiblingsCount: number;
  femaleSiblingsCount: number;
  guardianName: string;
  guardianRelationship: string;
  address: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Damage {
  id: number;
  guardianNationalId: string;
  guardianName?: string;
  guardianPhone?: string;
  areaId?: number;
  areaName?: string;
  damageType: 'كلي' | 'جزئي';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationRequest {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  // بيانات ولي الأمر
  name: string;
  nationalId: string;
  phone: string;
  gender: 'male' | 'female';
  maritalStatus: string;
  currentJob?: string;
  residenceStatus: 'resident' | 'displaced';
  originalGovernorate?: string;
  originalCity?: string;
  displacementAddress?: string;
  areaId: number;
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
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Statistics {
  totalAreas: number;
  totalGuardians: number;
  maleGuardians: number;
  femaleGuardians: number;
  displacedGuardians: number;
  residentGuardians: number;
  areasData: { name: string; count: number }[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}