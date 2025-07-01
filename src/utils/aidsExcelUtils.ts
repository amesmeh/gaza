import * as XLSX from 'xlsx';
import { Aid, Guardian } from '../types';

// إنشاء قالب Excel للمساعدات
export const createAidsTemplate = (guardians: Guardian[]) => {
  const templateData = [
    {
      'رقم هوية ولي الأمر': guardians[0]?.nationalId || '123456789',
      'اسم ولي الأمر': guardians[0]?.name || 'أحمد محمد',
      'رقم الجوال': guardians[0]?.phone || '0599123456',
      'نوع المساعدة': 'مساعدة غذائية',
      'تاريخ المساعدة': '2024-03-15'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 18 }, // رقم الجوال
    { wch: 20 }, // نوع المساعدة
    { wch: 15 }  // تاريخ المساعدة
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
    'حالة الإقامة': guardian.residenceStatus === 'displaced' ? 'نازح' : 'مقيم',
    'عدد أفراد العائلة': guardian.familyMembersCount
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
    { wch: 15 }, // حالة الإقامة
    { wch: 18 }  // عدد أفراد العائلة
  ];

  // إنشاء ورقة أمثلة لأنواع المساعدات
  const aidTypesData = [
    { 'نوع المساعدة': 'مساعدة غذائية', 'الوصف': 'طرود غذائية وأغذية أساسية' },
    { 'نوع المساعدة': 'مساعدة طبية', 'الوصف': 'أدوية وعلاجات طبية' },
    { 'نوع المساعدة': 'مساعدة نقدية', 'الوصف': 'مساعدات مالية نقدية' },
    { 'نوع المساعدة': 'مساعدة تعليمية', 'الوصف': 'قرطاسية وكتب ومواد تعليمية' },
    { 'نوع المساعدة': 'مساعدة إيوائية', 'الوصف': 'مساعدات سكن وإيواء' },
    { 'نوع المساعدة': 'مساعدة ملابس', 'الوصف': 'ملابس وأحذية' },
    { 'نوع المساعدة': 'مساعدة أدوات منزلية', 'الوصف': 'أدوات ومعدات منزلية' },
    { 'نوع المساعدة': 'مساعدة وقود', 'الوصف': 'وقود للطبخ والتدفئة' },
    { 'نوع المساعدة': 'مساعدة مواصلات', 'الوصف': 'مساعدات نقل ومواصلات' },
    { 'نوع المساعدة': 'مساعدة أخرى', 'الوصف': 'أنواع مساعدات أخرى' }
  ];

  const aidTypesWorksheet = XLSX.utils.json_to_sheet(aidTypesData);
  aidTypesWorksheet['!dir'] = 'rtl';
  aidTypesWorksheet['!cols'] = [
    { wch: 25 }, // نوع المساعدة
    { wch: 40 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات المساعدات:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. رقم هوية ولي الأمر (مطلوب)' },
    { 'التعليمات': '2. نوع المساعدة (مطلوب)' },
    { 'التعليمات': '3. تاريخ المساعدة (مطلوب)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📝 الحقول الاختيارية (للأشخاص غير المسجلين):' },
    { 'التعليمات': '4. اسم ولي الأمر (اختياري - إذا لم يكن مسجل في النظام)' },
    { 'التعليمات': '5. رقم الجوال (اختياري - إذا لم يكن مسجل في النظام)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📋 ملاحظة مهمة:' },
    { 'التعليمات': '• إذا كان ولي الأمر مسجل في النظام: سيتم قراءة بياناته تلقائياً' },
    { 'التعليمات': '• إذا لم يكن مسجل: سيتم قراءة الاسم من الملف بدقة' },
    { 'التعليمات': '' },
    { 'التعليمات': '📅 صيغ التاريخ المدعومة:' },
    { 'التعليمات': '• 2024-03-15 (السنة-الشهر-اليوم) - الأفضل' },
    { 'التعليمات': '• 15/3/2024 (اليوم/الشهر/السنة)' },
    { 'التعليمات': '• 15-3-2024 (اليوم-الشهر-السنة)' },
    { 'التعليمات': '' },
    { 'التعليمات': '🎯 أنواع المساعدات:' },
    { 'التعليمات': '• يمكنك كتابة أي نوع مساعدة تريده' },
    { 'التعليمات': '• راجع ورقة "أمثلة لأنواع المساعدات" للاسترشاد' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• استخدم صيغة التاريخ المفضلة: YYYY-MM-DD' },
    { 'التعليمات': '• يمكن تكرار المساعدة لنفس ولي الأمر في تواريخ مختلفة' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب المساعدات');
  XLSX.utils.book_append_sheet(workbook, guardiansWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, aidTypesWorksheet, 'أمثلة لأنواع المساعدات');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب المساعدات',
    Subject: 'قالب لاستيراد بيانات المساعدات',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات المساعدات إلى Excel
export const exportAidsToExcel = (aids: Aid[]) => {
  const exportData = aids.map(aid => ({
    'رقم هوية ولي الأمر': aid.guardianNationalId,
    'اسم ولي الأمر': aid.guardianName || '',
    'رقم الهاتف': aid.guardianPhone || '',
    'نوع المساعدة': aid.aidType,
    'تاريخ المساعدة': aid.aidDate,
    'المنطقة': aid.areaName || '',
    'ملاحظات': aid.notes || '',
    'تاريخ التسجيل': new Date(aid.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(aid.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 15 }, // رقم الهاتف
    { wch: 20 }, // نوع المساعدة
    { wch: 15 }, // تاريخ المساعدة
    { wch: 20 }, // المنطقة
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات المساعدات');

  workbook.Props = {
    Title: 'بيانات المساعدات',
    Subject: 'تصدير بيانات المساعدات',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تحويل رقم Excel التسلسلي إلى تاريخ
const excelDateToJSDate = (excelDate: number): Date => {
  const excelEpoch = new Date(1899, 11, 30);
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
  return jsDate;
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
          
          if (year >= 2020 && year <= 2030 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
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

// دالة مساعدة لقراءة البيانات من الملف مع دعم أسماء الأعمدة المختلفة
const getFieldValue = (row: any, fieldNames: string[]): string => {
  for (const fieldName of fieldNames) {
    const value = row[fieldName];
    if (value !== undefined && value !== null && value.toString().trim() !== '') {
      return value.toString().trim();
    }
  }
  return '';
};

// قراءة ملف Excel واستيراد بيانات المساعدات مع التحقق من الأخطاء
export const importAidsFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validAids: Partial<Aid>[];
  errors: Array<{row: number, field: string, message: string}>;
  warnings: Array<{row: number, field: string, message: string}>;
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

        const validAids: Partial<Aid>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];
        const warnings: Array<{row: number, field: string, message: string}> = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const aid: Partial<Aid> = {};
          let hasErrors = false;

          // رقم هوية ولي الأمر (مطلوب)
          const guardianNationalId = getFieldValue(row, ['رقم هوية ولي الأمر']) || '';
          if (!guardianNationalId || guardianNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية ولي الأمر', message: 'رقم هوية ولي الأمر مطلوب'});
            hasErrors = true;
          } else {
            const guardianNationalIdStr = guardianNationalId.toString().trim();
            aid.guardianNationalId = guardianNationalIdStr;

            // البحث عن ولي الأمر
            const guardian = guardians.find(g => g.nationalId === guardianNationalIdStr);
            if (guardian) {
              // إذا وجد ولي الأمر، استخدم بياناته
              aid.guardianName = guardian.name;
              aid.guardianPhone = guardian.phone;
              aid.areaId = guardian.areaId;
              aid.areaName = guardian.area?.name;
            } else {
              // إذا لم يجد ولي الأمر، استخدم البيانات من الملف أو قيم افتراضية
              aid.guardianName = getFieldValue(row, [
                'اسم ولي الأمر', 
                'اسم ولي الأمر (اختياري)',
                'اسم ولي الأمر (اختياري)',
                'الاسم',
                'اسم صاحب الطلب',
                'اسم المستفيد'
              ]) || 'غير محدد';
              aid.guardianPhone = getFieldValue(row, [
                'رقم الجوال',
                'رقم الجوال (اختياري)',
                'رقم الهاتف',
                'رقم الهاتف (اختياري)',
                'رقم التليفون',
                'رقم الاتصال'
              ]) || '';
              aid.areaId = undefined;
              aid.areaName = getFieldValue(row, [
                'المنطقة',
                'المنطقة (اختياري)',
                'الحي',
                'المحافظة',
                'العنوان'
              ]) || 'غير محدد';
              
              // إضافة تحذير بدلاً من خطأ
              warnings.push({
                row: rowNumber, 
                field: 'رقم هوية ولي الأمر', 
                message: `تحذير: لم يتم العثور على ولي أمر برقم الهوية: ${guardianNationalIdStr}. سيتم استيراد البيانات مع المعلومات المتوفرة.`
              });
            }
          }

          // نوع المساعدة (مطلوب)
          const aidType = row['نوع المساعدة'] || '';
          if (!aidType || aidType.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'نوع المساعدة', message: 'نوع المساعدة مطلوب'});
            hasErrors = true;
          } else {
            aid.aidType = aidType.toString().trim();
          }

          // تاريخ المساعدة (مطلوب)
          const aidDateValue = row['تاريخ المساعدة'];
          if (!aidDateValue) {
            errors.push({row: rowNumber, field: 'تاريخ المساعدة', message: 'تاريخ المساعدة مطلوب'});
            hasErrors = true;
          } else {
            const parsedDate = parseAnyDateFormat(aidDateValue);
            if (!parsedDate) {
              errors.push({
                row: rowNumber, 
                field: 'تاريخ المساعدة', 
                message: `تاريخ المساعدة غير صحيح: "${aidDateValue}". استخدم صيغة مثل: 2024-03-15 أو 15/3/2024`
              });
              hasErrors = true;
            } else {
              aid.aidDate = parsedDate;
            }
          }

          // الملاحظات (اختياري)
          aid.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validAids.push(aid);
          }
        });

        resolve({ validAids, errors, warnings });
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
export const exportAidsErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'تاريخ المساعدة' ? 'خطأ في التاريخ' : 
                  error.field.includes('ولي الأمر') ? 'خطأ في بيانات ولي الأمر' : 
                  error.field === 'نوع المساعدة' ? 'خطأ في نوع المساعدة' : 'خطأ في البيانات'
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
    { 'الحلول': '• تأكد من استخدام صيغة صحيحة: 2024-03-15 أو 15/3/2024' },
    { 'الحلول': '• تجنب ترك خانة التاريخ فارغة' },
    { 'الحلول': '• استخدم تواريخ منطقية (2020-2030)' },
    { 'الحلول': '' },
    { 'الحلول': '👨‍👩‍👧‍👦 مشاكل ولي الأمر:' },
    { 'الحلول': '• تأكد من وجود ولي الأمر في النظام أولاً' },
    { 'الحلول': '• راجع ورقة "أولياء الأمور المتاحين" في القالب' },
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
    Title: 'أخطاء استيراد المساعدات',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد المساعدات مع الحلول',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير ملف التحذيرات
export const exportAidsWarningsToExcel = (warnings: Array<{row: number, field: string, message: string}>) => {
  const warningData = warnings.map((warning, index) => ({
    'رقم التحذير': index + 1,
    'رقم الصف في الملف': warning.row,
    'الحقل المتأثر': warning.field,
    'وصف التحذير': warning.message,
    'نوع التحذير': 'تحذير - بيانات غير مكتملة'
  }));

  const worksheet = XLSX.utils.json_to_sheet(warningData);
  worksheet['!dir'] = 'rtl';
  worksheet['!cols'] = [
    { wch: 15 }, // رقم التحذير
    { wch: 15 }, // رقم الصف في الملف
    { wch: 20 }, // الحقل المتأثر
    { wch: 70 }, // وصف التحذير
    { wch: 25 }  // نوع التحذير
  ];

  // إضافة ورقة معلومات عن التحذيرات
  const infoData = [
    { 'معلومات': '📋 معلومات عن التحذيرات:' },
    { 'معلومات': '' },
    { 'معلومات': '⚠️ ما هي التحذيرات؟' },
    { 'معلومات': '• التحذيرات هي مشاكل غير حرجة في البيانات' },
    { 'معلومات': '• البيانات تم استيرادها بنجاح رغم التحذيرات' },
    { 'معلومات': '• يمكنك مراجعة هذه التحذيرات لتحسين البيانات' },
    { 'معلومات': '' },
    { 'معلومات': '👨‍👩‍👧‍👦 تحذيرات ولي الأمر:' },
    { 'معلومات': '• تحدث عندما لا يكون ولي الأمر مسجل في النظام' },
    { 'معلومات': '• سيتم استخدام البيانات من ملف Excel بدلاً من النظام' },
    { 'معلومات': '• يمكنك تسجيل ولي الأمر لاحقاً في النظام' },
    { 'معلومات': '' },
    { 'معلومات': '✅ ما يجب فعله:' },
    { 'معلومات': '• راجع التحذيرات للتأكد من صحة البيانات' },
    { 'معلومات': '• سجل أولياء الأمور المفقودين في النظام' },
    { 'معلومات': '• يمكنك تجاهل التحذيرات إذا كانت البيانات صحيحة' },
    { 'معلومات': '' },
    { 'معلومات': '💡 ملاحظة مهمة:' },
    { 'معلومات': '• النظام يدعم استيراد المساعدات حتى لو لم يكن ولي الأمر مسجل' },
    { 'معلومات': '• هذا يسمح بتسجيل المساعدات للأشخاص الجدد' },
    { 'معلومات': '• يمكن تحديث البيانات لاحقاً عند تسجيل ولي الأمر' }
  ];

  const infoWorksheet = XLSX.utils.json_to_sheet(infoData);
  infoWorksheet['!dir'] = 'rtl';
  infoWorksheet['!cols'] = [{ wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'تحذيرات الاستيراد');
  XLSX.utils.book_append_sheet(workbook, infoWorksheet, 'معلومات عن التحذيرات');

  workbook.Props = {
    Title: 'تحذيرات استيراد المساعدات',
    Subject: 'تقرير التحذيرات في عملية استيراد المساعدات',
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