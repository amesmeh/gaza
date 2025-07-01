import { User } from '../types';

// بيانات المستخدمين الوهمية للاختبار
interface MockUser extends User {
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    name: 'المدير العام',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    username: 'observer',
    password: 'observer123',
    email: 'observer@example.com',
    role: 'observer',
    name: 'المراقب العام',
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: 3,
    username: 'rep1',
    password: 'rep123',
    email: 'rep1@example.com',
    role: 'representative',
    areaId: 1,
    name: 'مندوب الرباط',
    createdAt: '2024-01-03T10:00:00Z'
  },
  {
    id: 4,
    username: 'rep2',
    password: 'rep123',
    email: 'rep2@example.com',
    role: 'representative',
    areaId: 2,
    name: 'مندوب الشجاعية',
    createdAt: '2024-01-04T10:00:00Z'
  },
  {
    id: 5,
    username: 'rep3',
    password: 'rep123',
    email: 'rep3@example.com',
    role: 'representative',
    areaId: 3,
    name: 'مندوب جباليا',
    createdAt: '2024-01-05T10:00:00Z'
  }
];