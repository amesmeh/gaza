import * as XLSX from 'xlsx';
import { Orphan, Martyr } from '../types';

// تحويل رقم Excel التسلسلي إلى تاريخ
const excelDateToJSDate = (excelDate: number): Date => {
  const excelEpoch = new Date(1899, 11, 30);
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
  return jsDate;
};

// حساب العمر من تاريخ الميلاد
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// دالة شاملة لتحويل أي صيغة تاريخ إلى ISO
const parseAnyDateFormat = (dateValue: any): string | null => {
  if (!dateValue) return null;
  
  try {
    // إذا كان رقم (Excel serial date)
    if (typeof dateValue === 'number') {
      if (dateValue > 1 && dateValue < 100000) {
        const jsDate = excelDateToJSDate(dateValue);
        return jsDate.toISOString().split('T')[0];
      }
    }
    
    // إذا كان كائن Date
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // إذا كان نص، جرب صيغ مختلفة
    if (typeof dateValue === 'string') {
      const dateStr = dateValue.toString().trim();
      
      // جرب التحويل المباشر أولاً
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      // صيغ مختلفة للتاريخ
      const dateFormats = [
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
        /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
        /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/
      ];
      
      for (const format of dateFormats) {
        const match = dateStr.match(format);
        if (match) {
          let year, month, day;
          
          if (format.source.startsWith('^(\\d{4})')) {
            year = parseInt(match[1]);
            month = parseInt(match[2]);
            day = parseInt(match[3]);
          } else if (format.source.includes('(\\d{4})$')) {
            day = parseInt(match[1]);
            month = parseInt(match[2]);
            year = parseInt(match[3]);
          } else {
            month = parseInt(match[1]);
            day = parseInt(match[2]);
            year = parseInt(match[3]);
          }
          
          if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('خطأ في تحويل التاريخ:', dateValue, error);
    return null;
  }
};

// إنشاء قالب Excel للأيتام
export const createOrphansTemplate = (martyrs: Martyr[]) => {
  const templateData = [
    {
      'اسم اليتيم': 'مثال: أحمد محمد الخالدي',
      'رقم هوية اليتيم': '123456791',
      'الجنس': 'ذكر',
      'تاريخ الميلاد': '2015-05-10',
      'الحالة الصحية': 'جيدة',
      'المرحلة الدراسية': 'ابتدائي',
      'رقم هوية الشهيد': martyrs[0]?.nationalId || '111222333',
      'اسم الشهيد/المتوفي': martyrs[0]?.name || 'أحمد محمد السالم',
      'تاريخ الاستشهاد': martyrs[0]?.martyrdomDate || '2024-01-15',
      'عدد الأخوة الذكور': 1,
      'عدد الأخوة الإناث': 2,
      'اسم الوصي على الأيتام': 'محمد أحمد السالم',
      'صلة قرابة الوصي بالأيتام': 'عم',
      'العنوان': 'الرباط - شارع الشهداء',
      'رقم الجوال': '0597111112',
      'ملاحظات': 'يحتاج إلى دعم نفسي'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم اليتيم
    { wch: 20 }, // رقم هوية اليتيم
    { wch: 10 }, // الجنس
    { wch: 15 }, // تاريخ الميلاد
    { wch: 15 }, // الحالة الصحية
    { wch: 15 }, // المرحلة الدراسية
    { wch: 20 }, // رقم هوية الشهيد
    { wch: 25 }, // اسم الشهيد/المتوفي
    { wch: 15 }, // تاريخ الاستشهاد
    { wch: 15 }, // عدد الأخوة الذكور
    { wch: 15 }, // عدد الأخوة الإناث
    { wch: 25 }, // اسم الوصي على الأيتام
    { wch: 20 }, // صلة قرابة الوصي بالأيتام
    { wch: 25 }, // العنوان
    { wch: 15 }, // رقم الجوال
    { wch: 30 }  // ملاحظات
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة الشهداء المتاحين
  const martyrsData = martyrs.map(martyr => ({
    'رقم الشهيد': martyr.id,
    'اسم الشهيد': martyr.name,
    'رقم هوية الشهيد': martyr.nationalId,
    'تاريخ الاستشهاد': martyr.martyrdomDate,
    'اسم الوكيل': martyr.agentName,
    'رقم هاتف الوكيل': martyr.agentPhone
  }));

  const martyrsWorksheet = XLSX.utils.json_to_sheet(martyrsData);
  martyrsWorksheet['!dir'] = 'rtl';
  martyrsWorksheet['!cols'] = [
    { wch: 12 }, // رقم الشهيد
    { wch: 25 }, // اسم الشهيد
    { wch: 20 }, // رقم هوية الشهيد
    { wch: 15 }, // تاريخ الاستشهاد
    { wch: 25 }, // اسم الوكيل
    { wch: 15 }  // رقم هاتف الوكيل
  ];

  // إنشاء ورقة الحالات الصحية والمراحل الدراسية
  const statusesData = [
    { 'النوع': 'الحالات الصحية', 'القيمة': 'جيدة', 'الوصف': 'الحالة الصحية جيدة' },
    { 'النوع': 'الحالات الصحية', 'القيمة': 'متوسطة', 'الوصف': 'الحالة الصحية متوسطة' },
    { 'النوع': 'الحالات الصحية', 'القيمة': 'ضعيفة', 'الوصف': 'الحالة الصحية ضعيفة' },
    { 'النوع': 'الحالات الصحية', 'القيمة': 'سيئة', 'الوصف': 'الحالة الصحية سيئة' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'روضة', 'الوصف': 'مرحلة رياض الأطفال' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'ابتدائي', 'الوصف': 'المرحلة الابتدائية' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'إعدادي', 'الوصف': 'المرحلة الإعدادية' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'ثانوي', 'الوصف': 'المرحلة الثانوية' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'جامعي', 'الوصف': 'المرحلة الجامعية' },
    { 'النوع': 'المراحل الدراسية', 'القيمة': 'غير متعلم', 'الوصف': 'غير ملتحق بالتعليم' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'أب', 'الوصف': 'الأب' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'أم', 'الوصف': 'الأم' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'جد', 'الوصف': 'الجد' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'جدة', 'الوصف': 'الجدة' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'عم', 'الوصف': 'العم' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'عمة', 'الوصف': 'العمة' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'خال', 'الوصف': 'الخال' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'خالة', 'الوصف': 'الخالة' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'أخ', 'الوصف': 'الأخ' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'أخت', 'الوصف': 'الأخت' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'قريب', 'الوصف': 'قريب آخر' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'وصي قانوني', 'الوصف': 'وصي قانوني معين' },
    { 'النوع': 'صلات قرابة الوصي', 'القيمة': 'أخرى', 'الوصف': 'صلة قرابة أخرى' }
  ];

  const statusesWorksheet = XLSX.utils.json_to_sheet(statusesData);
  statusesWorksheet['!dir'] = 'rtl';
  statusesWorksheet['!cols'] = [
    { wch: 20 }, // النوع
    { wch: 20 }, // القيمة
    { wch: 40 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات الأيتام:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. اسم اليتيم (مطلوب)' },
    { 'التعليمات': '2. رقم هوية اليتيم (مطلوب)' },
    { 'التعليمات': '3. الجنس (مطلوب) - ذكر أو أنثى' },
    { 'التعليمات': '4. تاريخ الميلاد (مطلوب)' },
    { 'التعليمات': '5. الحالة الصحية (مطلوب) - جيدة، متوسطة، ضعيفة، سيئة' },
    { 'التعليمات': '6. المرحلة الدراسية (مطلوب) - روضة، ابتدائي، إعدادي، ثانوي، جامعي، غير متعلم' },
    { 'التعليمات': '7. رقم هوية الشهيد (مطلوب)' },
    { 'التعليمات': '8. اسم الشهيد/المتوفي (مطلوب)' },
    { 'التعليمات': '9. تاريخ الاستشهاد (مطلوب)' },
    { 'التعليمات': '10. عدد الأخوة الذكور (مطلوب)' },
    { 'التعليمات': '11. عدد الأخوة الإناث (مطلوب)' },
    { 'التعليمات': '12. اسم الوصي على الأيتام (مطلوب)' },
    { 'التعليمات': '13. صلة قرابة الوصي بالأيتام (مطلوب)' },
    { 'التعليمات': '14. العنوان (مطلوب)' },
    { 'التعليمات': '15. رقم الجوال (مطلوب)' },
    { 'التعليمات': '16. الملاحظات (اختياري)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📅 صيغ التاريخ المدعومة:' },
    { 'التعليمات': '• 2015-05-10 (السنة-الشهر-اليوم) - الأفضل' },
    { 'التعليمات': '• 10/5/2015 (اليوم/الشهر/السنة)' },
    { 'التعليمات': '• 10-5-2015 (اليوم-الشهر-السنة)' },
    { 'التعليمات': '• 10.5.2015 (اليوم.الشهر.السنة)' },
    { 'التعليمات': '' },
    { 'التعليمات': '👥 بيانات الشهداء:' },
    { 'التعليمات': '• يمكن الاستفادة من بيانات الشهداء الموجودة في النظام' },
    { 'التعليمات': '• راجع ورقة "الشهداء المتاحين" للتفاصيل' },
    { 'التعليمات': '• يمكن إدخال بيانات شهيد غير مسجل في النظام' },
    { 'التعليمات': '' },
    { 'التعليمات': '🔄 معلومات تلقائية:' },
    { 'التعليمات': '• العمر سيتم حسابه تلقائياً من تاريخ الميلاد' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• استخدم صيغة التاريخ المفضلة: YYYY-MM-DD' },
    { 'التعليمات': '• تأكد من كتابة الحالة الصحية والمرحلة الدراسية بالضبط كما هو مكتوب' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الأيتام');
  XLSX.utils.book_append_sheet(workbook, martyrsWorksheet, 'الشهداء المتاحين');
  XLSX.utils.book_append_sheet(workbook, statusesWorksheet, 'الحالات والمراحل');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب الأيتام',
    Subject: 'قالب لاستيراد بيانات الأيتام',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات الأيتام إلى Excel
export const exportOrphansToExcel = (orphans: Orphan[]) => {
  const exportData = orphans.map(orphan => ({
    'اسم اليتيم': orphan.name,
    'رقم هوية اليتيم': orphan.nationalId,
    'الجنس': orphan.gender === 'male' ? 'ذكر' : 'أنثى',
    'تاريخ الميلاد': orphan.birthDate,
    'العمر': orphan.age,
    'الحالة الصحية': orphan.healthStatus,
    'المرحلة الدراسية': orphan.educationalStage,
    'رقم هوية الشهيد': orphan.martyrNationalId,
    'اسم الشهيد/المتوفي': orphan.martyrName,
    'تاريخ الاستشهاد': orphan.martyrdomDate,
    'عدد الأخوة الذكور': orphan.maleSiblingsCount,
    'عدد الأخوة الإناث': orphan.femaleSiblingsCount,
    'اسم الوصي على الأيتام': orphan.guardianName,
    'صلة قرابة الوصي بالأيتام': orphan.guardianRelationship,
    'العنوان': orphan.address,
    'رقم الجوال': orphan.phone,
    'ملاحظات': orphan.notes || '',
    'تاريخ التسجيل': new Date(orphan.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(orphan.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم اليتيم
    { wch: 20 }, // رقم هوية اليتيم
    { wch: 10 }, // الجنس
    { wch: 15 }, // تاريخ الميلاد
    { wch: 10 }, // العمر
    { wch: 15 }, // الحالة الصحية
    { wch: 15 }, // المرحلة الدراسية
    { wch: 20 }, // رقم هوية الشهيد
    { wch: 25 }, // اسم الشهيد/المتوفي
    { wch: 15 }, // تاريخ الاستشهاد
    { wch: 15 }, // عدد الأخوة الذكور
    { wch: 15 }, // عدد الأخوة الإناث
    { wch: 25 }, // اسم الوصي على الأيتام
    { wch: 20 }, // صلة قرابة الوصي بالأيتام
    { wch: 25 }, // العنوان
    { wch: 15 }, // رقم الجوال
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الأيتام');

  workbook.Props = {
    Title: 'بيانات الأيتام',
    Subject: 'تصدير بيانات الأيتام',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات الأيتام مع التحقق من الأخطاء
export const importOrphansFromExcel = (file: File, martyrs: Martyr[]): Promise<{
  validOrphans: Partial<Orphan>[];
  errors: Array<{row: number, field: string, message: string}>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { 
          type: 'array', 
          cellDates: false,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: '',
          blankrows: false
        });

        const validOrphans: Partial<Orphan>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // الحالات الصحية المتاحة
        const healthStatuses = [
          'جيدة',
          'متوسطة',
          'ضعيفة',
          'سيئة'
        ];

        // المراحل الدراسية المتاحة
        const educationalStages = [
          'روضة',
          'ابتدائي',
          'إعدادي',
          'ثانوي',
          'جامعي',
          'غير متعلم'
        ];

        // صلات القرابة المتاحة
        const guardianRelationships = [
          'أب',
          'أم',
          'جد',
          'جدة',
          'عم',
          'عمة',
          'خال',
          'خالة',
          'أخ',
          'أخت',
          'قريب',
          'وصي قانوني',
          'أخرى'
        ];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const orphan: Partial<Orphan> = {};
          let hasErrors = false;

          // اسم اليتيم (مطلوب)
          const name = row['اسم اليتيم'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم اليتيم', message: 'اسم اليتيم مطلوب'});
            hasErrors = true;
          } else {
            orphan.name = name.toString().trim();
          }

          // رقم هوية اليتيم (مطلوب)
          const nationalId = row['رقم هوية اليتيم'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية اليتيم', message: 'رقم هوية اليتيم مطلوب'});
            hasErrors = true;
          } else {
            orphan.nationalId = nationalId.toString().trim();
          }

          // الجنس (مطلوب)
          const gender = row['الجنس'] || '';
          if (!gender || gender.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'الجنس', message: 'الجنس مطلوب'});
            hasErrors = true;
          } else {
            const genderStr = gender.toString().trim();
            if (genderStr === 'ذكر' || genderStr.toLowerCase() === 'male') {
              orphan.gender = 'male';
            } else if (genderStr === 'أنثى' || genderStr.toLowerCase() === 'female') {
              orphan.gender = 'female';
            } else {
              errors.push({
                row: rowNumber, 
                field: 'الجنس', 
                message: `الجنس غير صحيح: "${genderStr}". القيم المتاحة: ذكر، أنثى`
              });
              hasErrors = true;
            }
          }

          // تاريخ الميلاد (مطلوب)
          const birthDateValue = row['تاريخ الميلاد'];
          if (!birthDateValue) {
            errors.push({row: rowNumber, field: 'تاريخ الميلاد', message: 'تاريخ الميلاد مطلوب'});
            hasErrors = true;
          } else {
            const parsedDate = parseAnyDateFormat(birthDateValue);
            if (!parsedDate) {
              errors.push({
                row: rowNumber, 
                field: 'تاريخ الميلاد', 
                message: `تاريخ الميلاد غير صحيح: "${birthDateValue}". استخدم صيغة مثل: 2015-05-10 أو 10/5/2015`
              });
              hasErrors = true;
            } else {
              orphan.birthDate = parsedDate;
              orphan.age = calculateAge(parsedDate);
            }
          }

          // الحالة الصحية (مطلوب)
          const healthStatus = row['الحالة الصحية'] || '';
          if (!healthStatus || healthStatus.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'الحالة الصحية', message: 'الحالة الصحية مطلوبة'});
            hasErrors = true;
          } else {
            const healthStatusStr = healthStatus.toString().trim();
            if (healthStatuses.includes(healthStatusStr)) {
              orphan.healthStatus = healthStatusStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'الحالة الصحية', 
                message: `الحالة الصحية غير صحيحة: "${healthStatusStr}". القيم المتاحة: ${healthStatuses.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // المرحلة الدراسية (مطلوب)
          const educationalStage = row['المرحلة الدراسية'] || '';
          if (!educationalStage || educationalStage.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'المرحلة الدراسية', message: 'المرحلة الدراسية مطلوبة'});
            hasErrors = true;
          } else {
            const educationalStageStr = educationalStage.toString().trim();
            if (educationalStages.includes(educationalStageStr)) {
              orphan.educationalStage = educationalStageStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'المرحلة الدراسية', 
                message: `المرحلة الدراسية غير صحيحة: "${educationalStageStr}". القيم المتاحة: ${educationalStages.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // رقم هوية الشهيد (مطلوب)
          const martyrNationalId = row['رقم هوية الشهيد'] || '';
          if (!martyrNationalId || martyrNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الشهيد', message: 'رقم هوية الشهيد مطلوب'});
            hasErrors = true;
          } else {
            orphan.martyrNationalId = martyrNationalId.toString().trim();
            
            // التحقق من وجود الشهيد في النظام (اختياري)
            const martyr = martyrs.find(m => m.nationalId === martyrNationalId.toString().trim());
            if (martyr) {
              orphan.martyrName = martyr.name;
              orphan.martyrdomDate = martyr.martyrdomDate;
            }
          }

          // اسم الشهيد/المتوفي (مطلوب)
          const martyrName = row['اسم الشهيد/المتوفي'] || '';
          if (!martyrName || martyrName.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الشهيد/المتوفي', message: 'اسم الشهيد/المتوفي مطلوب'});
            hasErrors = true;
          } else {
            orphan.martyrName = martyrName.toString().trim();
          }

          // تاريخ الاستشهاد (مطلوب)
          const martyrdomDateValue = row['تاريخ الاستشهاد'];
          if (!martyrdomDateValue) {
            errors.push({row: rowNumber, field: 'تاريخ الاستشهاد', message: 'تاريخ الاستشهاد مطلوب'});
            hasErrors = true;
          } else {
            const parsedDate = parseAnyDateFormat(martyrdomDateValue);
            if (!parsedDate) {
              errors.push({
                row: rowNumber, 
                field: 'تاريخ الاستشهاد', 
                message: `تاريخ الاستشهاد غير صحيح: "${martyrdomDateValue}". استخدم صيغة مثل: 2024-01-15 أو 15/1/2024`
              });
              hasErrors = true;
            } else {
              orphan.martyrdomDate = parsedDate;
            }
          }

          // عدد الأخوة الذكور (مطلوب)
          const maleSiblingsCount = row['عدد الأخوة الذكور'];
          if (maleSiblingsCount === undefined || maleSiblingsCount === null || maleSiblingsCount === '') {
            errors.push({row: rowNumber, field: 'عدد الأخوة الذكور', message: 'عدد الأخوة الذكور مطلوب'});
            hasErrors = true;
          } else {
            const count = parseInt(maleSiblingsCount);
            if (isNaN(count) || count < 0) {
              errors.push({
                row: rowNumber, 
                field: 'عدد الأخوة الذكور', 
                message: `عدد الأخوة الذكور غير صحيح: "${maleSiblingsCount}". يجب أن يكون رقماً موجباً`
              });
              hasErrors = true;
            } else {
              orphan.maleSiblingsCount = count;
            }
          }

          // عدد الأخوة الإناث (مطلوب)
          const femaleSiblingsCount = row['عدد الأخوة الإناث'];
          if (femaleSiblingsCount === undefined || femaleSiblingsCount === null || femaleSiblingsCount === '') {
            errors.push({row: rowNumber, field: 'عدد الأخوة الإناث', message: 'عدد الأخوة الإناث مطلوب'});
            hasErrors = true;
          } else {
            const count = parseInt(femaleSiblingsCount);
            if (isNaN(count) || count < 0) {
              errors.push({
                row: rowNumber, 
                field: 'عدد الأخوة الإناث', 
                message: `عدد الأخوة الإناث غير صحيح: "${femaleSiblingsCount}". يجب أن يكون رقماً موجباً`
              });
              hasErrors = true;
            } else {
              orphan.femaleSiblingsCount = count;
            }
          }

          // اسم الوصي على الأيتام (مطلوب)
          const guardianName = row['اسم الوصي على الأيتام'] || '';
          if (!guardianName || guardianName.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الوصي على الأيتام', message: 'اسم الوصي على الأيتام مطلوب'});
            hasErrors = true;
          } else {
            orphan.guardianName = guardianName.toString().trim();
          }

          // صلة قرابة الوصي بالأيتام (مطلوب)
          const guardianRelationship = row['صلة قرابة الوصي بالأيتام'] || '';
          if (!guardianRelationship || guardianRelationship.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'صلة قرابة الوصي بالأيتام', message: 'صلة قرابة الوصي بالأيتام مطلوبة'});
            hasErrors = true;
          } else {
            const relationshipStr = guardianRelationship.toString().trim();
            if (guardianRelationships.includes(relationshipStr)) {
              orphan.guardianRelationship = relationshipStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'صلة قرابة الوصي بالأيتام', 
                message: `صلة قرابة الوصي غير صحيحة: "${relationshipStr}". القيم المتاحة: ${guardianRelationships.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // العنوان (مطلوب)
          const address = row['العنوان'] || '';
          if (!address || address.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'العنوان', message: 'العنوان مطلوب'});
            hasErrors = true;
          } else {
            orphan.address = address.toString().trim();
          }

          // رقم الجوال (مطلوب)
          const phone = row['رقم الجوال'] || '';
          if (!phone || phone.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم الجوال', message: 'رقم الجوال مطلوب'});
            hasErrors = true;
          } else {
            orphan.phone = phone.toString().trim();
          }

          // الملاحظات (اختياري)
          orphan.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validOrphans.push(orphan);
          }
        });

        resolve({ validOrphans, errors });
      } catch (error) {
        console.error('خطأ في قراءة ملف Excel:', error);
        reject(new Error(`خطأ في قراءة الملف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}. تأكد من أن الملف بصيغة Excel صحيحة.`));
      }
    };

    reader.onerror = () => {
      reject(new Error('خطأ في قراءة الملف. تأكد من أن الملف غير تالف.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// تصدير ملف الأخطاء
export const exportOrphansErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field.includes('تاريخ') ? 'خطأ في التاريخ' : 
                  error.field.includes('الشهيد') ? 'خطأ في بيانات الشهيد' : 
                  error.field.includes('الوصي') ? 'خطأ في بيانات الوصي' : 
                  error.field.includes('الصحية') ? 'خطأ في الحالة الصحية' : 
                  error.field.includes('الدراسية') ? 'خطأ في المرحلة الدراسية' : 'خطأ في البيانات'
  }));

  const worksheet = XLSX.utils.json_to_sheet(errorData);
  worksheet['!dir'] = 'rtl';
  worksheet['!cols'] = [
    { wch: 12 }, // رقم الخطأ
    { wch: 15 }, // رقم الصف في الملف
    { wch: 20 }, // الحقل المتأثر
    { wch: 60 }, // وصف المشكلة
    { wch: 20 }  // نوع الخطأ
  ];

  // إضافة ورقة حلول للأخطاء الشائعة
  const solutionsData = [
    { 'الحلول': '🔧 حلول للأخطاء الشائعة:' },
    { 'الحلول': '' },
    { 'الحلول': '📅 مشاكل التاريخ:' },
    { 'الحلول': '• تأكد من استخدام صيغة صحيحة: 2015-05-10 أو 10/5/2015' },
    { 'الحلول': '• تجنب ترك خانة التاريخ فارغة' },
    { 'الحلول': '• استخدم تواريخ منطقية' },
    { 'الحلول': '' },
    { 'الحلول': '👥 مشاكل بيانات الشهيد:' },
    { 'الحلول': '• تأكد من إدخال رقم هوية الشهيد واسمه بشكل صحيح' },
    { 'الحلول': '• يمكن الاستفادة من بيانات الشهداء الموجودة في النظام' },
    { 'الحلول': '• راجع ورقة "الشهداء المتاحين" للتفاصيل' },
    { 'الحلول': '' },
    { 'الحلول': '🏥 مشاكل الحالة الصحية والمرحلة الدراسية:' },
    { 'الحلول': '• استخدم القيم المحددة فقط من ورقة "الحالات والمراحل"' },
    { 'الحلول': '• تأكد من كتابة القيمة بالضبط كما هي مكتوبة' },
    { 'الحلول': '• لا تضع مسافات إضافية قبل أو بعد القيمة' },
    { 'الحلول': '' },
    { 'الحلول': '👨‍👩‍👧‍👦 مشاكل بيانات الوصي:' },
    { 'الحلول': '• تأكد من إدخال اسم الوصي وصلة قرابته بشكل صحيح' },
    { 'الحلول': '• استخدم صلات القرابة المحددة فقط' },
    { 'الحلول': '' },
    { 'الحلول': '📝 نصائح عامة:' },
    { 'الحلول': '• لا تترك أي حقل مطلوب فارغاً' },
    { 'الحلول': '• استخدم أرقام الهوية كما هي بدون تنسيق' },
    { 'الحلول': '• تأكد من صحة أرقام الجوال' },
    { 'الحلول': '• في حالة استمرار المشاكل، راجع ورقة التعليمات في القالب' }
  ];

  const solutionsWorksheet = XLSX.utils.json_to_sheet(solutionsData);
  solutionsWorksheet['!dir'] = 'rtl';
  solutionsWorksheet['!cols'] = [{ wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أخطاء الاستيراد');
  XLSX.utils.book_append_sheet(workbook, solutionsWorksheet, 'الحلول والنصائح');

  workbook.Props = {
    Title: 'أخطاء استيراد الأيتام',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد الأيتام مع الحلول',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تحميل ملف Excel
export const downloadExcelFile = (workbook: XLSX.WorkBook, filename: string) => {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(data);
  link.download = `${filename}.xlsx`;
  link.click();
  
  // تنظيف الذاكرة
  URL.revokeObjectURL(link.href);
};