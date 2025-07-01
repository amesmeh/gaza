import * as XLSX from 'xlsx';
import { Damage, Guardian } from '../types';

// إنشاء قالب Excel لأصحاب الأضرار
export const createDamagesTemplate = (guardians: Guardian[]) => {
  const templateData = [
    {
      'رقم هوية ولي الأمر': guardians[0]?.nationalId || '123456789',
      'نوع الضرر': 'كلي',
      'ملاحظات': 'ملاحظات إضافية حول الضرر'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 15 }, // نوع الضرر
    { wch: 30 }  // ملاحظات
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة أولياء الأمور المتاحين
  const guardiansData = guardians.map(guardian => ({
    'رقم ولي الأمر': guardian.id,
    'اسم ولي الأمر': guardian.name,
    'رقم هوية ولي الأمر': guardian.nationalId,
    'رقم الهاتف': guardian.phone,
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
    { wch: 20 }, // المنطقة
    { wch: 18 }, // الحالة الاجتماعية
    { wch: 15 }  // حالة الإقامة
  ];

  // إنشاء ورقة أنواع الأضرار
  const damageTypesData = [
    { 'نوع الضرر': 'كلي', 'الوصف': 'ضرر كلي في المنزل أو الممتلكات' },
    { 'نوع الضرر': 'جزئي', 'الوصف': 'ضرر جزئي في المنزل أو الممتلكات' }
  ];

  const damageTypesWorksheet = XLSX.utils.json_to_sheet(damageTypesData);
  damageTypesWorksheet['!dir'] = 'rtl';
  damageTypesWorksheet['!cols'] = [
    { wch: 15 }, // نوع الضرر
    { wch: 40 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات أصحاب الأضرار:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. رقم هوية ولي الأمر (مطلوب)' },
    { 'التعليمات': '2. نوع الضرر (مطلوب) - كلي أو جزئي' },
    { 'التعليمات': '3. الملاحظات (اختياري)' },
    { 'التعليمات': '' },
    { 'التعليمات': '👨‍👩‍👧‍👦 شروط ولي الأمر:' },
    { 'التعليمات': '• رقم هوية ولي الأمر يجب أن يكون موجود في النظام' },
    { 'التعليمات': '• راجع ورقة "أولياء الأمور المتاحين" للتأكد' },
    { 'التعليمات': '' },
    { 'التعليمات': '🔄 معلومات تلقائية:' },
    { 'التعليمات': '• اسم ولي الأمر والمنطقة سيتم قراءتهما تلقائياً' },
    { 'التعليمات': '• رقم الهاتف سيتم قراءته من بيانات ولي الأمر' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• تأكد من وجود ولي الأمر في النظام أولاً' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب أصحاب الأضرار');
  XLSX.utils.book_append_sheet(workbook, guardiansWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, damageTypesWorksheet, 'أنواع الأضرار');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب أصحاب الأضرار',
    Subject: 'قالب لاستيراد بيانات أصحاب الأضرار',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات أصحاب الأضرار إلى Excel
export const exportDamagesToExcel = (damages: Damage[]) => {
  const exportData = damages.map(damage => ({
    'رقم هوية ولي الأمر': damage.guardianNationalId,
    'اسم ولي الأمر': damage.guardianName || '',
    'رقم الجوال': damage.guardianPhone || '',
    'المنطقة': damage.areaName || '',
    'نوع الضرر': damage.damageType,
    'ملاحظات': damage.notes || '',
    'تاريخ التسجيل': new Date(damage.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(damage.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 15 }, // رقم الجوال
    { wch: 20 }, // المنطقة
    { wch: 15 }, // نوع الضرر
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات أصحاب الأضرار');

  workbook.Props = {
    Title: 'بيانات أصحاب الأضرار',
    Subject: 'تصدير بيانات أصحاب الأضرار',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات أصحاب الأضرار مع التحقق من الأخطاء
export const importDamagesFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validDamages: Partial<Damage>[];
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
          raw: false
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: '',
          blankrows: false
        });

        const validDamages: Partial<Damage>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // أنواع الأضرار المتاحة
        const damageTypes = ['كلي', 'جزئي'];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const damage: Partial<Damage> = {};
          let hasErrors = false;

          // رقم هوية ولي الأمر (مطلوب)
          const guardianNationalId = row['رقم هوية ولي الأمر'] || '';
          if (!guardianNationalId || guardianNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية ولي الأمر', message: 'رقم هوية ولي الأمر مطلوب'});
            hasErrors = true;
          } else {
            const guardianNationalIdStr = guardianNationalId.toString().trim();
            damage.guardianNationalId = guardianNationalIdStr;

            // البحث عن ولي الأمر
            const guardian = guardians.find(g => g.nationalId === guardianNationalIdStr);
            if (guardian) {
              damage.guardianName = guardian.name;
              damage.guardianPhone = guardian.phone;
              damage.areaId = guardian.areaId;
              damage.areaName = guardian.area?.name;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'رقم هوية ولي الأمر', 
                message: `لم يتم العثور على ولي أمر برقم الهوية: ${guardianNationalIdStr}`
              });
              hasErrors = true;
            }
          }

          // نوع الضرر (مطلوب)
          const damageType = row['نوع الضرر'] || '';
          if (!damageType || damageType.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'نوع الضرر', message: 'نوع الضرر مطلوب'});
            hasErrors = true;
          } else {
            const damageTypeStr = damageType.toString().trim();
            if (damageTypes.includes(damageTypeStr)) {
              damage.damageType = damageTypeStr as 'كلي' | 'جزئي';
            } else {
              errors.push({
                row: rowNumber, 
                field: 'نوع الضرر', 
                message: `نوع الضرر غير صحيح: "${damageTypeStr}". الأنواع المتاحة: ${damageTypes.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // الملاحظات (اختياري)
          damage.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validDamages.push(damage);
          }
        });

        resolve({ validDamages, errors });
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
export const exportDamagesErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'نوع الضرر' ? 'خطأ في نوع الضرر' : 
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
    { 'الحلول': '🏠 مشاكل نوع الضرر:' },
    { 'الحلول': '• استخدم الأنواع المحددة فقط: كلي أو جزئي' },
    { 'الحلول': '• تأكد من كتابة النوع بالضبط كما هو مكتوب' },
    { 'الحلول': '• لا تضع مسافات إضافية قبل أو بعد النوع' },
    { 'الحلول': '' },
    { 'الحلول': '👨‍👩‍👧‍👦 مشاكل ولي الأمر:' },
    { 'الحلول': '• تأكد من وجود ولي الأمر في النظام أولاً' },
    { 'الحلول': '• راجع ورقة "أولياء الأمور المتاحين" للتأكد' },
    { 'الحلول': '• تأكد من صحة رقم الهوية (بدون مسافات أو رموز)' },
    { 'الحلول': '' },
    { 'الحلول': '📝 نصائح عامة:' },
    { 'الحلول': '• لا تترك أي حقل مطلوب فارغاً' },
    { 'الحلول': '• استخدم أرقام الهوية كما هي بدون تنسيق' },
    { 'الحلول': '• في حالة استمرار المشاكل، راجع ورقة التعليمات في القالب' }
  ];

  const solutionsWorksheet = XLSX.utils.json_to_sheet(solutionsData);
  solutionsWorksheet['!dir'] = 'rtl';
  solutionsWorksheet['!cols'] = [{ wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أخطاء الاستيراد');
  XLSX.utils.book_append_sheet(workbook, solutionsWorksheet, 'الحلول والنصائح');

  workbook.Props = {
    Title: 'أخطاء استيراد أصحاب الأضرار',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد أصحاب الأضرار مع الحلول',
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