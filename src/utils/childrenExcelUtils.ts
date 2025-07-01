import * as XLSX from 'xlsx';
import { Child, Guardian } from '../types';

// حساب العمر من تاريخ الميلاد
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.abs(age); // إرجاع القيمة المطلقة للعمر
};

// تحويل رقم Excel التسلسلي إلى تاريخ
const excelDateToJSDate = (excelDate: number): Date => {
  // Excel يحسب التواريخ من 1900-01-01، لكن هناك خطأ في Excel حيث يعتبر 1900 سنة كبيسة
  const excelEpoch = new Date(1899, 11, 30); // 30 ديسمبر 1899
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
  return jsDate;
};

// دالة شاملة لتحويل أي صيغة تاريخ إلى ISO (بدون قيود)
const parseAnyDateFormat = (dateValue: any): string | null => {
  if (!dateValue) return null;
  
  try {
    // إذا كان رقم (Excel serial date)
    if (typeof dateValue === 'number') {
      // قبول أي رقم تسلسلي (بدون قيود)
      if (dateValue > -100000 && dateValue < 200000) {
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
      
      // صيغ مختلفة للتاريخ
      const dateFormats = [
        // ISO format
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        // DD/MM/YYYY or DD-MM-YYYY
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
        // MM/DD/YYYY or MM-DD-YYYY
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
        // YYYY/MM/DD or YYYY-MM-DD
        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
        // DD.MM.YYYY
        /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
        // YYYY.MM.DD
        /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/
      ];
      
      // جرب التحويل المباشر أولاً
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      // جرب الصيغ المختلفة
      for (const format of dateFormats) {
        const match = dateStr.match(format);
        if (match) {
          let year, month, day;
          
          // تحديد ترتيب السنة والشهر واليوم حسب الصيغة
          if (format.source.startsWith('^(\\d{4})')) {
            // YYYY-MM-DD format
            year = parseInt(match[1]);
            month = parseInt(match[2]);
            day = parseInt(match[3]);
          } else if (format.source.includes('(\\d{4})$')) {
            // DD-MM-YYYY format (الأكثر شيوعاً في المنطقة العربية)
            day = parseInt(match[1]);
            month = parseInt(match[2]);
            year = parseInt(match[3]);
          } else {
            // MM-DD-YYYY format
            month = parseInt(match[1]);
            day = parseInt(match[2]);
            year = parseInt(match[3]);
          }
          
          // التحقق من صحة القيم الأساسية فقط (بدون قيود على السنة)
          if (year >= 1 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
          }
        }
      }
      
      // جرب تحويل النص إلى رقم (في حالة كان رقم تسلسلي كنص)
      const numericValue = parseFloat(dateStr);
      if (!isNaN(numericValue) && numericValue > -100000 && numericValue < 200000) {
        const jsDate = excelDateToJSDate(numericValue);
        return jsDate.toISOString().split('T')[0];
      }
      
      // جرب تحليل التاريخ بصيغ أخرى
      const alternativeFormats = [
        // تجربة تبديل الشهر واليوم
        dateStr.replace(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/, '$2/$1/$3'),
        // تجربة إضافة أصفار
        dateStr.replace(/^(\d{1})[\/\-]/, '0$1/').replace(/[\/\-](\d{1})[\/\-]/, '/0$1/'),
        // تجربة تحويل الفواصل
        dateStr.replace(/[\.]/g, '/').replace(/[-]/g, '/')
      ];
      
      for (const altFormat of alternativeFormats) {
        date = new Date(altFormat);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('خطأ في تحويل التاريخ:', dateValue, error);
    return null;
  }
};

// إنشاء قالب Excel للأبناء (مبسط)
export const createChildrenTemplate = (guardians: Guardian[]) => {
  // فلترة أولياء الأمور الذين لديهم أبناء
  const guardiansWithChildren = guardians.filter(g => g.childrenCount > 0);

  const templateData = [
    {
      'اسم الابن': 'مثال: محمد أحمد السالم',
      'رقم هوية الابن': '123456789',
      'تاريخ الميلاد': '2015-03-15',
      'رقم هوية ولي الأمر': guardiansWithChildren[0]?.nationalId || '123456789'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم الابن
    { wch: 20 }, // رقم هوية الابن
    { wch: 15 }, // تاريخ الميلاد
    { wch: 20 }  // رقم هوية ولي الأمر
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة أولياء الأمور المتاحين
  const guardiansData = guardiansWithChildren.map(guardian => ({
    'رقم ولي الأمر': guardian.id,
    'اسم ولي الأمر': guardian.name,
    'رقم هوية ولي الأمر': guardian.nationalId,
    'رقم الهاتف': guardian.phone,
    'عدد الأبناء': guardian.childrenCount,
    'المنطقة': guardian.area?.name || 'غير محدد',
    'الحالة الاجتماعية': guardian.maritalStatus,
    'حالة الإقامة': guardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'
  }));

  const guardiansWorksheet = XLSX.utils.json_to_sheet(guardiansData);
  guardiansWorksheet['!dir'] = 'rtl';
  guardiansWorksheet['!cols'] = [
    { wch: 15 }, // رقم ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 15 }, // رقم الهاتف
    { wch: 15 }, // عدد الأبناء
    { wch: 20 }, // المنطقة
    { wch: 18 }, // الحالة الاجتماعية
    { wch: 15 }  // حالة الإقامة
  ];

  // إنشاء ورقة التعليمات والصيغ المدعومة
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات الأبناء:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. اسم الابن (مطلوب)' },
    { 'التعليمات': '2. رقم هوية الابن (مطلوب)' },
    { 'التعليمات': '3. تاريخ الميلاد (مطلوب)' },
    { 'التعليمات': '4. رقم هوية ولي الأمر (مطلوب)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📅 صيغ التاريخ المدعومة (جميعها مقبولة):' },
    { 'التعليمات': '• 2015-03-15 (السنة-الشهر-اليوم)' },
    { 'التعليمات': '• 15/3/2015 (اليوم/الشهر/السنة)' },
    { 'التعليمات': '• 15-3-2015 (اليوم-الشهر-السنة)' },
    { 'التعليمات': '• 15.3.2015 (اليوم.الشهر.السنة)' },
    { 'التعليمات': '• 3/15/2015 (الشهر/اليوم/السنة)' },
    { 'التعليمات': '• 2015/03/15 (السنة/الشهر/اليوم)' },
    { 'التعليمات': '• يمكن استخدام رقم أو رقمين للشهر واليوم' },
    { 'التعليمات': '• مثال: 5/3/2015 أو 05/03/2015 كلاهما صحيح' },
    { 'التعليمات': '• يمكن استخدام أي سنة من 1 إلى 9999' },
    { 'التعليمات': '' },
    { 'التعليمات': '🚀 مرونة كاملة في التواريخ:' },
    { 'التعليمات': '• لا توجد قيود على السنة (يمكن أي سنة)' },
    { 'التعليمات': '• لا توجد قيود على العمر (يمكن أي عمر)' },
    { 'التعليمات': '• يمكن استيراد تواريخ من الماضي البعيد أو المستقبل' },
    { 'التعليمات': '• النظام يقبل جميع التواريخ بدون استثناء' },
    { 'التعليمات': '' },
    { 'التعليمات': '👨‍👩‍👧‍👦 شروط ولي الأمر:' },
    { 'التعليمات': '• رقم هوية ولي الأمر يجب أن يكون موجود في النظام' },
    { 'التعليمات': '• يجب أن يكون لولي الأمر أبناء مسجلين (childrenCount > 0)' },
    { 'التعليمات': '• راجع ورقة "أولياء الأمور المتاحين" للتأكد' },
    { 'التعليمات': '' },
    { 'التعليمات': '🔄 معلومات تلقائية:' },
    { 'التعليمات': '• العمر سيتم حسابه تلقائياً من تاريخ الميلاد' },
    { 'التعليمات': '• اسم ولي الأمر والمنطقة سيتم قراءتهما تلقائياً' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• استخدم صيغة التاريخ المفضلة: YYYY-MM-DD' },
    { 'التعليمات': '• تحقق من وجود ولي الأمر في النظام أولاً' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' },
    { 'التعليمات': '• يمكنك استيراد أي تاريخ ميلاد بدون قيود!' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الأبناء');
  XLSX.utils.book_append_sheet(workbook, guardiansWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات والصيغ');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب الأبناء - بدون قيود',
    Subject: 'قالب لاستيراد بيانات الأبناء - يدعم جميع صيغ التاريخ بدون قيود',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات الأبناء إلى Excel
export const exportChildrenToExcel = (children: Child[]) => {
  const exportData = children.map(child => ({
    'اسم الابن': child.name,
    'رقم هوية الابن': child.nationalId,
    'تاريخ الميلاد': child.birthDate,
    'العمر': child.age,
    'رقم هوية ولي الأمر': child.guardianNationalId || '',
    'اسم ولي الأمر': child.guardianName || '',
    'المنطقة': child.areaName || '',
    'تاريخ التسجيل': new Date(child.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(child.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم الابن
    { wch: 20 }, // رقم هوية الابن
    { wch: 15 }, // تاريخ الميلاد
    { wch: 10 }, // العمر
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 20 }, // المنطقة
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الأبناء');

  workbook.Props = {
    Title: 'بيانات الأبناء',
    Subject: 'تصدير بيانات الأبناء',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات الأبناء مع التحقق من الأخطاء (بدون قيود العمر)
export const importChildrenFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validChildren: Partial<Child>[];
  errors: Array<{row: number, field: string, message: string}>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // قراءة الملف مع خيارات محسنة لمعالجة التواريخ
        const workbook = XLSX.read(data, { 
          type: 'array', 
          cellDates: false, // نتعامل مع التواريخ يدوياً
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: '',
          blankrows: false
        });

        const validChildren: Partial<Child>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // فلترة أولياء الأمور الذين لديهم أبناء
        const guardiansWithChildren = guardians.filter(g => g.childrenCount > 0);

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // +2 لأن الصف الأول هو العناوين
          const child: Partial<Child> = {};
          let hasErrors = false;

          // اسم الابن (مطلوب)
          const name = row['اسم الابن'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الابن', message: 'اسم الابن مطلوب'});
            hasErrors = true;
          } else {
            child.name = name.toString().trim();
          }

          // رقم هوية الابن (مطلوب)
          const nationalId = row['رقم هوية الابن'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الابن', message: 'رقم هوية الابن مطلوب'});
            hasErrors = true;
          } else {
            child.nationalId = nationalId.toString().trim();
          }

          // تاريخ الميلاد (مطلوب) - بدون أي قيود!
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
                message: `تاريخ الميلاد غير صحيح: "${birthDateValue}". استخدم صيغة مثل: 2015-03-15 أو 15/3/2015`
              });
              hasErrors = true;
            } else {
              child.birthDate = parsedDate;
              child.age = calculateAge(parsedDate);
              
              // لا توجد قيود على التاريخ أو العمر - قبول أي شيء!
              console.log(`تم قبول التاريخ: ${parsedDate} مع العمر: ${child.age} سنة`);
            }
          }

          // رقم هوية ولي الأمر (مطلوب)
          const guardianNationalId = row['رقم هوية ولي الأمر'] || '';
          if (!guardianNationalId || guardianNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية ولي الأمر', message: 'رقم هوية ولي الأمر مطلوب'});
            hasErrors = true;
          } else {
            const guardianNationalIdStr = guardianNationalId.toString().trim();
            child.guardianNationalId = guardianNationalIdStr;

            // البحث عن ولي الأمر في قائمة أولياء الأمور
            const guardian = guardiansWithChildren.find(g => g.nationalId === guardianNationalIdStr);
            if (guardian) {
              child.guardianId = guardian.id;
              child.guardianName = guardian.name;
              child.areaId = guardian.areaId;
              child.areaName = guardian.area?.name;
            } else {
              // تحقق إضافي: هل ولي الأمر موجود لكن ليس لديه أبناء؟
              const guardianExists = guardians.find(g => g.nationalId === guardianNationalIdStr);
              if (guardianExists) {
                errors.push({
                  row: rowNumber, 
                  field: 'رقم هوية ولي الأمر', 
                  message: `ولي الأمر "${guardianExists.name}" موجود لكن ليس لديه أبناء مسجلين في النظام (عدد الأبناء: ${guardianExists.childrenCount})`
                });
              } else {
                errors.push({
                  row: rowNumber, 
                  field: 'رقم هوية ولي الأمر', 
                  message: `لم يتم العثور على ولي أمر برقم الهوية: ${guardianNationalIdStr}`
                });
              }
              hasErrors = true;
            }
          }

          if (!hasErrors) {
            validChildren.push(child);
          }
        });

        resolve({ validChildren, errors });
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
export const exportChildrenErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'تاريخ الميلاد' ? 'خطأ في التاريخ' : 
                  error.field.includes('ولي الأمر') ? 'خطأ في بيانات ولي الأمر' : 'خطأ في البيانات'
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
    { 'الحلول': '• تأكد من استخدام صيغة صحيحة: 2015-03-15 أو 15/3/2015' },
    { 'الحلول': '• تجنب ترك خانة التاريخ فارغة' },
    { 'الحلول': '• يمكن استخدام أي سنة من 1 إلى 9999' },
    { 'الحلول': '• لا توجد قيود على العمر - يمكن أي عمر!' },
    { 'الحلول': '• يمكن استيراد تواريخ من الماضي البعيد أو المستقبل' },
    { 'الحلول': '' },
    { 'الحلول': '👨‍👩‍👧‍👦 مشاكل ولي الأمر:' },
    { 'الحلول': '• تأكد من وجود ولي الأمر في النظام أولاً' },
    { 'الحلول': '• تأكد من أن ولي الأمر لديه أبناء مسجلين (childrenCount > 0)' },
    { 'الحلول': '• راجع ورقة "أولياء الأمور المتاحين" في القالب' },
    { 'الحلول': '• تأكد من صحة رقم الهوية (بدون مسافات أو رموز)' },
    { 'الحلول': '' },
    { 'الحلول': '📝 نصائح عامة:' },
    { 'الحلول': '• لا تترك أي حقل مطلوب فارغاً' },
    { 'الحلول': '• استخدم أرقام الهوية كما هي بدون تنسيق' },
    { 'الحلول': '• تأكد من أن أسماء الأبناء مكتوبة بوضوح' },
    { 'الحلول': '• في حالة استمرار المشاكل، راجع ورقة التعليمات في القالب' },
    { 'الحلول': '• النظام الآن يقبل جميع التواريخ بدون قيود!' }
  ];

  const solutionsWorksheet = XLSX.utils.json_to_sheet(solutionsData);
  solutionsWorksheet['!dir'] = 'rtl';
  solutionsWorksheet['!cols'] = [{ wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أخطاء الاستيراد');
  XLSX.utils.book_append_sheet(workbook, solutionsWorksheet, 'الحلول والنصائح');

  workbook.Props = {
    Title: 'أخطاء استيراد الأبناء',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد الأبناء مع الحلول - بدون قيود العمر',
    Author: 'نظام مساعدات غزة',
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