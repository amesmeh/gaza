export interface User {
  id: number;
  _id?: string;
  username: string;
  email: string;
  role: 'admin' | 'representative' | 'observer';
  areaId?: number;
  createdAt: string;
  name: string;
}

export interface Area {
  id?: number;
  _id?: string;
  name: string;
  representativeName?: string;
  representativeId?: string;
  representativePhone?: string;
  createdAt?: string;
  updatedAt?: string;
  guardiansCount?: number;
}

export interface Guardian {
  id?: number;
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
  areaName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wife {
  id?: number;
  _id?: string;
  name: string;
  nationalId: string;
  husbandId: string;
  husbandNationalId: string;
  husbandName?: string;
  areaId?: string;
  areaName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Child {
  id?: number;
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

export interface Aid {
  id?: number;
  _id?: string;
  guardianNationalId: string;
  guardianName?: string;
  guardianPhone?: string;
  aidType: string;
  aidDate: string;
  areaId?: string;
  areaName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Martyr {
  id?: number;
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
  id?: number;
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
  id?: number;
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
  id?: number;
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
  id?: number;
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
  id?: number;
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