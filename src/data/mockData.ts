import { Area, Guardian, Statistics, Wife, Child, Aid, Martyr, Injured, MedicalData, Orphan, Damage, RegistrationRequest } from '../types';

// بيانات المناطق الوهمية
export const mockAreas: Area[] = [
  {
    id: 1,
    name: 'الرباط',
    representativeName: 'محمد أحمد',
    representativeId: '123456789',
    representativePhone: '0597111222',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    guardiansCount: 120
  },
  {
    id: 2,
    name: 'الشجاعية',
    representativeName: 'أحمد محمود',
    representativeId: '234567890',
    representativePhone: '0598222333',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    guardiansCount: 85
  },
  {
    id: 3,
    name: 'جباليا',
    representativeName: 'محمود خالد',
    representativeId: '345678901',
    representativePhone: '0599333444',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    guardiansCount: 150
  },
  {
    id: 4,
    name: 'النصيرات',
    representativeName: 'خالد سعيد',
    representativeId: '456789012',
    representativePhone: '0591444555',
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-04T10:00:00Z',
    guardiansCount: 110
  },
  {
    id: 5,
    name: 'خان يونس',
    representativeName: 'سعيد عبد الله',
    representativeId: '567890123',
    representativePhone: '0592555666',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    guardiansCount: 130
  }
];

// بيانات أولياء الأمور الوهمية
export const mockGuardians: Guardian[] = [
  {
    id: 1,
    name: 'محمد أحمد السالم',
    nationalId: '123456789',
    phone: '0597111222',
    gender: 'male',
    maritalStatus: 'متزوج',
    childrenCount: 3,
    wivesCount: 1,
    familyMembersCount: 5,
    currentJob: 'مدرس',
    residenceStatus: 'resident',
    areaId: 1,
    area: mockAreas[0],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 2,
    name: 'أحمد محمود الخالدي',
    nationalId: '234567890',
    phone: '0598222333',
    gender: 'male',
    maritalStatus: 'متزوج',
    childrenCount: 4,
    wivesCount: 2,
    familyMembersCount: 7,
    currentJob: 'مهندس',
    residenceStatus: 'displaced',
    originalGovernorate: 'شمال غزة',
    originalCity: 'بيت حانون',
    displacementAddress: 'مخيم النصيرات',
    areaId: 4,
    area: mockAreas[3],
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z'
  },
  {
    id: 3,
    name: 'محمود خالد العلي',
    nationalId: '345678901',
    phone: '0599333444',
    gender: 'male',
    maritalStatus: 'أرمل',
    childrenCount: 2,
    wivesCount: 0,
    familyMembersCount: 3,
    currentJob: 'تاجر',
    residenceStatus: 'resident',
    areaId: 2,
    area: mockAreas[1],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: 4,
    name: 'فاطمة سعيد الحسن',
    nationalId: '456789012',
    phone: '0591444555',
    gender: 'female',
    maritalStatus: 'أرملة',
    childrenCount: 3,
    wivesCount: 0,
    familyMembersCount: 4,
    currentJob: 'ربة منزل',
    residenceStatus: 'displaced',
    originalGovernorate: 'خان يونس',
    originalCity: 'خان يونس',
    displacementAddress: 'مدرسة الأونروا - الرباط',
    areaId: 1,
    area: mockAreas[0],
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  },
  {
    id: 5,
    name: 'خالد سعيد المصري',
    nationalId: '567890123',
    phone: '0592555666',
    gender: 'male',
    maritalStatus: 'مطلق',
    childrenCount: 1,
    wivesCount: 0,
    familyMembersCount: 2,
    currentJob: 'موظف',
    residenceStatus: 'resident',
    areaId: 5,
    area: mockAreas[4],
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  }
];

// بيانات الزوجات الوهمية
export const mockWives: Wife[] = [
  {
    id: 1,
    name: 'سارة محمد الخالدي',
    nationalId: '123123123',
    husbandId: 1,
    husbandNationalId: '123456789',
    husbandName: 'محمد أحمد السالم',
    areaId: 1,
    areaName: 'الرباط',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    name: 'نور أحمد العلي',
    nationalId: '234234234',
    husbandId: 2,
    husbandNationalId: '234567890',
    husbandName: 'أحمد محمود الخالدي',
    areaId: 4,
    areaName: 'النصيرات',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 3,
    name: 'ليلى أحمد الحسن',
    nationalId: '345345345',
    husbandId: 2,
    husbandNationalId: '234567890',
    husbandName: 'أحمد محمود الخالدي',
    areaId: 4,
    areaName: 'النصيرات',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  }
];

// بيانات الأبناء الوهمية
export const mockChildren: Child[] = [
  {
    id: 1,
    name: 'أحمد محمد السالم',
    nationalId: '111222333',
    birthDate: '2015-05-10',
    age: 9,
    guardianId: 1,
    guardianName: 'محمد أحمد السالم',
    guardianNationalId: '123456789',
    areaId: 1,
    areaName: 'الرباط',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 2,
    name: 'فاطمة محمد السالم',
    nationalId: '222333444',
    birthDate: '2018-08-15',
    age: 6,
    guardianId: 1,
    guardianName: 'محمد أحمد السالم',
    guardianNationalId: '123456789',
    areaId: 1,
    areaName: 'الرباط',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z'
  },
  {
    id: 3,
    name: 'عبد الرحمن أحمد الخالدي',
    nationalId: '333444555',
    birthDate: '2016-02-20',
    age: 8,
    guardianId: 2,
    guardianName: 'أحمد محمود الخالدي',
    guardianNationalId: '234567890',
    areaId: 4,
    areaName: 'النصيرات',
    createdAt: '2024-01-27T10:00:00Z',
    updatedAt: '2024-01-27T10:00:00Z'
  },
  {
    id: 4,
    name: 'ليلى أحمد الخالدي',
    nationalId: '444555666',
    birthDate: '2019-11-05',
    age: 5,
    guardianId: 2,
    guardianName: 'أحمد محمود الخالدي',
    guardianNationalId: '234567890',
    areaId: 4,
    areaName: 'النصيرات',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z'
  },
  {
    id: 5,
    name: 'محمد محمود العلي',
    nationalId: '555666777',
    birthDate: '2017-07-12',
    age: 7,
    guardianId: 3,
    guardianName: 'محمود خالد العلي',
    guardianNationalId: '345678901',
    areaId: 2,
    areaName: 'الشجاعية',
    createdAt: '2024-01-29T10:00:00Z',
    updatedAt: '2024-01-29T10:00:00Z'
  }
];

// بيانات المساعدات الوهمية
export const mockAids: Aid[] = [
  {
    id: 1,
    guardianNationalId: '123456789',
    guardianName: 'محمد أحمد السالم',
    guardianPhone: '0597111222',
    aidType: 'مساعدة غذائية',
    aidDate: '2024-02-01',
    areaId: 1,
    areaName: 'الرباط',
    notes: 'طرد غذائي شامل للعائلة',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 2,
    guardianNationalId: '234567890',
    guardianName: 'أحمد محمود الخالدي',
    guardianPhone: '0598222333',
    aidType: 'مساعدة نقدية',
    aidDate: '2024-02-02',
    areaId: 4,
    areaName: 'النصيرات',
    notes: 'مساعدة نقدية بقيمة 200 دولار',
    createdAt: '2024-02-02T10:00:00Z',
    updatedAt: '2024-02-02T10:00:00Z'
  },
  {
    id: 3,
    guardianNationalId: '345678901',
    guardianName: 'محمود خالد العلي',
    guardianPhone: '0599333444',
    aidType: 'مساعدة طبية',
    aidDate: '2024-02-03',
    areaId: 2,
    areaName: 'الشجاعية',
    notes: 'أدوية وعلاجات طبية',
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z'
  },
  {
    id: 4,
    guardianNationalId: '456789012',
    guardianName: 'فاطمة سعيد الحسن',
    guardianPhone: '0591444555',
    aidType: 'مساعدة ملابس',
    aidDate: '2024-02-04',
    areaId: 1,
    areaName: 'الرباط',
    notes: 'ملابس للأطفال',
    createdAt: '2024-02-04T10:00:00Z',
    updatedAt: '2024-02-04T10:00:00Z'
  },
  {
    id: 5,
    guardianNationalId: '567890123',
    guardianName: 'خالد سعيد المصري',
    guardianPhone: '0592555666',
    aidType: 'مساعدة إيوائية',
    aidDate: '2024-02-05',
    areaId: 5,
    areaName: 'خان يونس',
    notes: 'مساعدة في توفير سكن مؤقت',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  }
];

// بيانات الشهداء الوهمية
export const mockMartyrs: Martyr[] = [
  {
    id: 1,
    name: 'أحمد محمد الخالدي',
    nationalId: '111222333',
    martyrdomDate: '2024-01-15',
    agentName: 'محمد أحمد الخالدي',
    agentNationalId: '123456789',
    agentPhone: '0597111222',
    relationshipToMartyr: 'والد',
    notes: 'استشهد في قصف منزله',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'محمود خالد العلي',
    nationalId: '222333444',
    martyrdomDate: '2024-01-16',
    agentName: 'خالد محمود العلي',
    agentNationalId: '234567890',
    agentPhone: '0598222333',
    relationshipToMartyr: 'والد',
    notes: 'استشهد أثناء عمله في المستشفى',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 3,
    name: 'فاطمة سعيد الحسن',
    nationalId: '333444555',
    martyrdomDate: '2024-01-17',
    agentName: 'سعيد محمد الحسن',
    agentNationalId: '345678901',
    agentPhone: '0599333444',
    relationshipToMartyr: 'والد',
    notes: 'استشهدت في قصف سوق شعبي',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 4,
    name: 'خالد سعيد المصري',
    nationalId: '444555666',
    martyrdomDate: '2024-01-18',
    agentName: 'سعيد خالد المصري',
    agentNationalId: '456789012',
    agentPhone: '0591444555',
    relationshipToMartyr: 'والد',
    notes: 'استشهد أثناء إسعاف الجرحى',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 5,
    name: 'سعيد عبد الله الأحمد',
    nationalId: '555666777',
    martyrdomDate: '2024-01-19',
    agentName: 'عبد الله سعيد الأحمد',
    agentNationalId: '567890123',
    agentPhone: '0592555666',
    relationshipToMartyr: 'والد',
    notes: 'استشهد في قصف مدرسة',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  }
];

// بيانات الجرحى الوهمية
export const mockInjured: Injured[] = [
  {
    id: 1,
    name: 'محمد أحمد الخالدي',
    nationalId: '111222334',
    phone: '0597111223',
    injuryDate: '2024-01-20',
    injuryType: 'إصابة متوسطة',
    notes: 'إصابة في الساق اليمنى',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    name: 'أحمد محمود الخالدي',
    nationalId: '222333445',
    phone: '0598222334',
    injuryDate: '2024-01-21',
    injuryType: 'إصابة خطيرة',
    notes: 'إصابة في الرأس تتطلب تدخل جراحي',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 3,
    name: 'محمود خالد العلي',
    nationalId: '333444556',
    phone: '0599333445',
    injuryDate: '2024-01-22',
    injuryType: 'إصابة بالأطراف',
    notes: 'كسر في الذراع اليسرى',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 4,
    name: 'فاطمة سعيد الحسن',
    nationalId: '444555667',
    phone: '0591444556',
    injuryDate: '2024-01-23',
    injuryType: 'حروق',
    notes: 'حروق من الدرجة الثانية في اليد والوجه',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z'
  },
  {
    id: 5,
    name: 'خالد سعيد المصري',
    nationalId: '555666778',
    phone: '0592555667',
    injuryDate: '2024-01-24',
    injuryType: 'بتر',
    notes: 'بتر في القدم اليمنى',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z'
  }
];

// بيانات المرضى الوهمية
export const mockMedicalData: MedicalData[] = [
  {
    id: 1,
    patientName: 'محمد أحمد الخالدي',
    patientNationalId: '111222335',
    guardianNationalId: '123456789',
    guardianName: 'محمد أحمد السالم',
    diseaseType: 'مرض السكري',
    phone: '0597111224',
    notes: 'يحتاج إلى أنسولين بشكل منتظم',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 2,
    patientName: 'أحمد محمود الخالدي',
    patientNationalId: '222333446',
    guardianNationalId: '234567890',
    guardianName: 'أحمد محمود الخالدي',
    diseaseType: 'مرض الربو',
    phone: '0598222335',
    notes: 'يحتاج إلى بخاخات ربو',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z'
  },
  {
    id: 3,
    patientName: 'محمود خالد العلي',
    patientNationalId: '333444557',
    guardianNationalId: '345678901',
    guardianName: 'محمود خالد العلي',
    diseaseType: 'مرض القلب',
    phone: '0599333446',
    notes: 'يحتاج إلى أدوية قلب بشكل منتظم',
    createdAt: '2024-01-27T10:00:00Z',
    updatedAt: '2024-01-27T10:00:00Z'
  },
  {
    id: 4,
    patientName: 'فاطمة سعيد الحسن',
    patientNationalId: '444555668',
    guardianNationalId: '456789012',
    guardianName: 'فاطمة سعيد الحسن',
    diseaseType: 'مرض الضغط',
    phone: '0591444557',
    notes: 'تحتاج إلى أدوية ضغط بشكل منتظم',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z'
  },
  {
    id: 5,
    patientName: 'خالد سعيد المصري',
    patientNationalId: '555666779',
    guardianNationalId: '567890123',
    guardianName: 'خالد سعيد المصري',
    diseaseType: 'مرض السرطان',
    phone: '0592555668',
    notes: 'يحتاج إلى علاج كيماوي',
    createdAt: '2024-01-29T10:00:00Z',
    updatedAt: '2024-01-29T10:00:00Z'
  }
];

// بيانات الأيتام الوهمية
export const mockOrphans: Orphan[] = [
  {
    id: 1,
    name: 'أحمد محمد الخالدي',
    nationalId: '111222336',
    gender: 'male',
    birthDate: '2015-05-10',
    age: 9,
    healthStatus: 'جيدة',
    educationalStage: 'ابتدائي',
    martyrNationalId: '111222333',
    martyrName: 'أحمد محمد الخالدي',
    martyrdomDate: '2024-01-15',
    maleSiblingsCount: 1,
    femaleSiblingsCount: 2,
    guardianName: 'محمد أحمد الخالدي',
    guardianRelationship: 'عم',
    address: 'الرباط - شارع الشهداء',
    phone: '0597111225',
    notes: 'يحتاج إلى دعم نفسي',
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z'
  },
  {
    id: 2,
    name: 'فاطمة محمود العلي',
    nationalId: '222333447',
    gender: 'female',
    birthDate: '2016-08-15',
    age: 8,
    healthStatus: 'متوسطة',
    educationalStage: 'ابتدائي',
    martyrNationalId: '222333444',
    martyrName: 'محمود خالد العلي',
    martyrdomDate: '2024-01-16',
    maleSiblingsCount: 0,
    femaleSiblingsCount: 1,
    guardianName: 'خالد محمود العلي',
    guardianRelationship: 'جد',
    address: 'الشجاعية - شارع الوحدة',
    phone: '0598222336',
    notes: 'تحتاج إلى رعاية صحية',
    createdAt: '2024-01-31T10:00:00Z',
    updatedAt: '2024-01-31T10:00:00Z'
  },
  {
    id: 3,
    name: 'محمد سعيد الحسن',
    nationalId: '333444558',
    gender: 'male',
    birthDate: '2017-03-20',
    age: 7,
    healthStatus: 'جيدة',
    educationalStage: 'ابتدائي',
    martyrNationalId: '333444555',
    martyrName: 'فاطمة سعيد الحسن',
    martyrdomDate: '2024-01-17',
    maleSiblingsCount: 1,
    femaleSiblingsCount: 0,
    guardianName: 'سعيد محمد الحسن',
    guardianRelationship: 'جد',
    address: 'النصيرات - مخيم 2',
    phone: '0599333447',
    notes: 'يحتاج إلى دعم تعليمي',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 4,
    name: 'ليلى خالد المصري',
    nationalId: '444555669',
    gender: 'female',
    birthDate: '2018-11-05',
    age: 6,
    healthStatus: 'ضعيفة',
    educationalStage: 'روضة',
    martyrNationalId: '444555666',
    martyrName: 'خالد سعيد المصري',
    martyrdomDate: '2024-01-18',
    maleSiblingsCount: 0,
    femaleSiblingsCount: 0,
    guardianName: 'سعيد خالد المصري',
    guardianRelationship: 'جد',
    address: 'خان يونس - حي الأمل',
    phone: '0591444558',
    notes: 'تحتاج إلى رعاية صحية خاصة',
    createdAt: '2024-02-02T10:00:00Z',
    updatedAt: '2024-02-02T10:00:00Z'
  },
  {
    id: 5,
    name: 'عبد الله سعيد الأحمد',
    nationalId: '555666780',
    gender: 'male',
    birthDate: '2014-07-12',
    age: 10,
    healthStatus: 'جيدة',
    educationalStage: 'إعدادي',
    martyrNationalId: '555666777',
    martyrName: 'سعيد عبد الله الأحمد',
    martyrdomDate: '2024-01-19',
    maleSiblingsCount: 2,
    femaleSiblingsCount: 1,
    guardianName: 'عبد الله سعيد الأحمد',
    guardianRelationship: 'عم',
    address: 'جباليا - شارع النزهة',
    phone: '0592555669',
    notes: 'يحتاج إلى دعم نفسي وتعليمي',
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z'
  }
];

// بيانات أصحاب الأضرار الوهمية
export const mockDamages: Damage[] = [
  {
    id: 1,
    guardianNationalId: '123456789',
    guardianName: 'محمد أحمد السالم',
    guardianPhone: '0597111222',
    areaId: 1,
    areaName: 'الرباط',
    damageType: 'كلي',
    notes: 'تدمير كامل للمنزل',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 2,
    guardianNationalId: '234567890',
    guardianName: 'أحمد محمود الخالدي',
    guardianPhone: '0598222333',
    areaId: 4,
    areaName: 'النصيرات',
    damageType: 'جزئي',
    notes: 'تضرر جزء من المنزل',
    createdAt: '2024-02-06T10:00:00Z',
    updatedAt: '2024-02-06T10:00:00Z'
  },
  {
    id: 3,
    guardianNationalId: '345678901',
    guardianName: 'محمود خالد العلي',
    guardianPhone: '0599333444',
    areaId: 2,
    areaName: 'الشجاعية',
    damageType: 'كلي',
    notes: 'تدمير كامل للمنزل والممتلكات',
    createdAt: '2024-02-07T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z'
  },
  {
    id: 4,
    guardianNationalId: '456789012',
    guardianName: 'فاطمة سعيد الحسن',
    guardianPhone: '0591444555',
    areaId: 1,
    areaName: 'الرباط',
    damageType: 'جزئي',
    notes: 'تضرر النوافذ والأبواب',
    createdAt: '2024-02-08T10:00:00Z',
    updatedAt: '2024-02-08T10:00:00Z'
  },
  {
    id: 5,
    guardianNationalId: '567890123',
    guardianName: 'خالد سعيد المصري',
    guardianPhone: '0592555666',
    areaId: 5,
    areaName: 'خان يونس',
    damageType: 'كلي',
    notes: 'تدمير كامل للمنزل والمحل التجاري',
    createdAt: '2024-02-09T10:00:00Z',
    updatedAt: '2024-02-09T10:00:00Z'
  }
];

// بيانات طلبات التسجيل الوهمية
export const mockRegistrationRequests: RegistrationRequest[] = [
  {
    id: 1,
    status: 'pending',
    name: 'محمد أحمد الخالدي',
    nationalId: '123123123',
    phone: '0597111222',
    gender: 'male',
    maritalStatus: 'متزوج',
    currentJob: 'مدرس',
    residenceStatus: 'resident',
    areaId: 1,
    areaName: 'الرباط',
    wives: [
      { name: 'سارة محمد الخالدي', nationalId: '123123124' }
    ],
    children: [
      { name: 'أحمد محمد الخالدي', nationalId: '123123125', birthDate: '2015-05-10', gender: 'male' },
      { name: 'فاطمة محمد الخالدي', nationalId: '123123126', birthDate: '2018-08-15', gender: 'female' }
    ],
    notes: 'أرجو النظر في طلبي بأسرع وقت ممكن',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 2,
    status: 'approved',
    name: 'خالد عبد الرحمن',
    nationalId: '456456456',
    phone: '0598222333',
    gender: 'male',
    maritalStatus: 'متزوج',
    currentJob: 'مهندس',
    residenceStatus: 'displaced',
    originalGovernorate: 'شمال غزة',
    originalCity: 'بيت حانون',
    displacementAddress: 'مخيم النصيرات',
    areaId: 4,
    areaName: 'النصيرات',
    wives: [
      { name: 'نور خالد عبد الرحمن', nationalId: '456456457' }
    ],
    children: [
      { name: 'عبد الرحمن خالد', nationalId: '456456458', birthDate: '2016-02-20', gender: 'male' },
      { name: 'ليلى خالد', nationalId: '456456459', birthDate: '2019-11-05', gender: 'female' }
    ],
    notes: 'نزحنا من بيت حانون بسبب القصف',
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-03T15:30:00Z',
    reviewedAt: '2024-03-03T15:30:00Z',
    reviewedBy: 'المدير'
  },
  {
    id: 3,
    status: 'rejected',
    name: 'سمير محمود العلي',
    nationalId: '789789789',
    phone: '0599333444',
    gender: 'male',
    maritalStatus: 'أعزب',
    currentJob: 'طالب',
    residenceStatus: 'resident',
    areaId: 2,
    areaName: 'الشجاعية',
    wives: [],
    children: [],
    notes: 'أرجو قبول طلبي',
    createdAt: '2024-03-03T10:00:00Z',
    updatedAt: '2024-03-04T12:45:00Z',
    reviewedAt: '2024-03-04T12:45:00Z',
    reviewedBy: 'المدير',
    rejectionReason: 'البيانات غير مكتملة، يرجى مراجعة مكتب المساعدات'
  },
  {
    id: 4,
    status: 'pending',
    name: 'فاطمة علي الحسن',
    nationalId: '321321321',
    phone: '0591444555',
    gender: 'female',
    maritalStatus: 'أرملة',
    currentJob: 'ربة منزل',
    residenceStatus: 'displaced',
    originalGovernorate: 'خان يونس',
    originalCity: 'خان يونس',
    displacementAddress: 'مدرسة الأونروا - الرباط',
    areaId: 1,
    areaName: 'الرباط',
    wives: [],
    children: [
      { name: 'علي محمد الحسن', nationalId: '321321322', birthDate: '2014-07-12', gender: 'male' },
      { name: 'زينب محمد الحسن', nationalId: '321321323', birthDate: '2017-03-25', gender: 'female' },
      { name: 'حسن محمد الحسن', nationalId: '321321324', birthDate: '2020-09-18', gender: 'male' }
    ],
    notes: 'زوجي استشهد في القصف الأخير',
    createdAt: '2024-03-04T10:00:00Z',
    updatedAt: '2024-03-04T10:00:00Z'
  },
  {
    id: 5,
    status: 'pending',
    name: 'أحمد محمد السعيد',
    nationalId: '654654654',
    phone: '0592555666',
    gender: 'male',
    maritalStatus: 'متزوج',
    currentJob: 'تاجر',
    residenceStatus: 'resident',
    areaId: 3,
    areaName: 'جباليا',
    wives: [
      { name: 'مريم أحمد السعيد', nationalId: '654654655' },
      { name: 'سارة أحمد السعيد', nationalId: '654654656' }
    ],
    children: [
      { name: 'محمد أحمد السعيد', nationalId: '654654657', birthDate: '2012-11-30', gender: 'male' },
      { name: 'عائشة أحمد السعيد', nationalId: '654654658', birthDate: '2015-04-22', gender: 'female' },
      { name: 'يوسف أحمد السعيد', nationalId: '654654659', birthDate: '2018-08-15', gender: 'male' },
      { name: 'فاطمة أحمد السعيد', nationalId: '654654660', birthDate: '2021-01-10', gender: 'female' }
    ],
    notes: 'أحتاج إلى مساعدة عاجلة لعائلتي',
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  }
];

// بيانات الإحصائيات الوهمية
export const mockStatistics: Statistics = {
  totalAreas: 5,
  totalGuardians: 5,
  maleGuardians: 4,
  femaleGuardians: 1,
  displacedGuardians: 2,
  residentGuardians: 3,
  areasData: [
    { name: 'الرباط', count: 120 },
    { name: 'الشجاعية', count: 85 },
    { name: 'جباليا', count: 150 },
    { name: 'النصيرات', count: 110 },
    { name: 'خان يونس', count: 130 }
  ]
};