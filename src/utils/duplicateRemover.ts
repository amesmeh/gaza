// أداة إزالة التكرار للأبناء وأولياء الأمور
import { Child, Guardian } from '../types';

interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateWith?: any;
  reason?: string;
}

// فحص التكرار في الأبناء
export const checkChildDuplicate = (
  newChild: Partial<Child>, 
  existingChildren: Child[]
): DuplicateCheckResult => {
  
  // فحص التكرار بواسطة رقم الهوية
  const duplicateByNationalId = existingChildren.find(
    child => child.nationalId === newChild.nationalId && child.id !== newChild.id
  );
  
  if (duplicateByNationalId) {
    return {
      isDuplicate: true,
      duplicateWith: duplicateByNationalId,
      reason: 'رقم الهوية مكرر'
    };
  }

  // فحص التكرار بواسطة الاسم الكامل + ولي الأمر
  const duplicateByNameAndGuardian = existingChildren.find(
    child => 
      child.name.toLowerCase().trim() === newChild.name?.toLowerCase().trim() &&
      child.guardianId === newChild.guardianId &&
      child.id !== newChild.id
  );

  if (duplicateByNameAndGuardian) {
    return {
      isDuplicate: true,
      duplicateWith: duplicateByNameAndGuardian,
      reason: 'نفس الاسم ونفس ولي الأمر'
    };
  }

  return { isDuplicate: false };
};

// فحص التكرار في أولياء الأمور
export const checkGuardianDuplicate = (
  newGuardian: Partial<Guardian>, 
  existingGuardians: Guardian[]
): DuplicateCheckResult => {
  
  // فحص التكرار بواسطة رقم الهوية
  const duplicateByNationalId = existingGuardians.find(
    guardian => guardian.nationalId === newGuardian.nationalId && guardian.id !== newGuardian.id
  );
  
  if (duplicateByNationalId) {
    return {
      isDuplicate: true,
      duplicateWith: duplicateByNationalId,
      reason: 'رقم الهوية مكرر'
    };
  }

  // فحص التكرار بواسطة رقم الهاتف
  const duplicateByPhone = existingGuardians.find(
    guardian => 
      guardian.phone === newGuardian.phone && 
      guardian.phone && 
      newGuardian.phone &&
      guardian.id !== newGuardian.id
  );

  if (duplicateByPhone) {
    return {
      isDuplicate: true,
      duplicateWith: duplicateByPhone,
      reason: 'رقم الهاتف مكرر'
    };
  }

  return { isDuplicate: false };
};

// إزالة التكرار من قائمة الأبناء
export const removeDuplicateChildren = (children: Child[]): Child[] => {
  const uniqueChildren: Child[] = [];
  const seenNationalIds = new Set<string>();
  const seenNameGuardianPairs = new Set<string>();

  children.forEach(child => {
    const nameGuardianKey = `${child.name.toLowerCase().trim()}_${child.guardianId}`;
    
    if (!seenNationalIds.has(child.nationalId) && !seenNameGuardianPairs.has(nameGuardianKey)) {
      uniqueChildren.push(child);
      seenNationalIds.add(child.nationalId);
      seenNameGuardianPairs.add(nameGuardianKey);
    }
  });

  return uniqueChildren;
};

// إزالة التكرار من قائمة أولياء الأمور
export const removeDuplicateGuardians = (guardians: Guardian[]): Guardian[] => {
  const uniqueGuardians: Guardian[] = [];
  const seenNationalIds = new Set<string>();

  guardians.forEach(guardian => {
    if (!seenNationalIds.has(guardian.nationalId)) {
      uniqueGuardians.push(guardian);
      seenNationalIds.add(guardian.nationalId);
    }
  });

  return uniqueGuardians;
};

// دالة لتنظيف البيانات المكررة
export const cleanDuplicateData = (children: Child[], guardians: Guardian[]) => {
  return {
    cleanChildren: removeDuplicateChildren(children),
    cleanGuardians: removeDuplicateGuardians(guardians)
  };
};