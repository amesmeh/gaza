import * as XLSX from 'xlsx';
import { Injured, Guardian } from '../types';

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

// إنشاء قالب Excel للجرحى
export const createInjuredTemplate = (guardians: Guardian[]) => {
  const templateData = [
    {
      'اسم الجريح': 'مثال: أحمد محمد السالم',
      'رقم هوية الجريح': '123456789',
      'رقم الجوال': '0597123456',
      'تاريخ الإصابة': '2024-03-15',
      'نوع الإصابة': 'إصابة متوسطة',
      'ملاحظات': 'ملاحظات إضافية'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم الجريح
    { wch: 20 }, // رقم هوية الجريح
    { wch: 15 }, // رقم الجوال
    { wch: 15 }, // تاريخ الإصابة
    { wch: 20 }, // نوع الإصابة
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

  // إنشاء ورقة أنواع الإصابات
  const injuryTypesData = [
    { 'نوع الإصابة': 'إصابة خطيرة', 'الوصف': 'إصابة خطيرة تهدد الحياة' },
    { 'نوع الإصابة': 'إصابة متوسطة', 'الوصف': 'إصابة متوسطة الخطورة' },
    { 'نوع الإصابة': 'إصابة بسيطة', 'الوصف': 'إصابة بسيطة غير خطيرة' },
    { 'نوع الإصابة': 'إصابة بالرأس', 'الوصف': 'إصابة في منطقة الرأس' },
    { 'نوع الإصابة': 'إصابة بالأطراف', 'الوصف': 'إصابة في الأطراف العلوية أو السفلية' },
    { 'نوع الإصابة': 'إصابة بالصدر', 'الوصف': 'إصابة في منطقة الصدر' },
    { 'نوع الإصابة': 'إصابة بالبطن', 'الوصف': 'إصابة في منطقة البطن' },
    { 'نوع الإصابة': 'إصابة بالعمود الفقري', 'الوصف': 'إصابة في العمود الفقري' },
    { 'نوع الإصابة': 'إصابة بالعين', 'الوصف': 'إصابة في العين' },
    { 'نوع الإصابة': 'حروق', 'الوصف': 'إصابة حروق من الدرجة الأولى أو الثانية أو الثالثة' },
    { 'نوع الإصابة': 'بتر', 'الوصف': 'بتر في أحد أجزاء الجسم' },
    { 'نوع الإصابة': 'إصابة أخرى', 'الوصف': 'أي نوع آخر من الإصابات' }
  ];

  const injuryTypesWorksheet = XLSX.utils.json_to_sheet(injuryTypesData);
  injuryTypesWorksheet['!dir'] = 'rtl';
  injuryTypesWorksheet['!cols'] = [
    { wch: 25 }, // نوع الإصابة
    { wch: 40 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات الجرحى:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. اسم الجريح (مطلوب)' },
    { 'التعليمات': '2. رقم هوية الجريح (مطلوب)' },
    { 'التعليمات': '3. رقم الجوال (مطلوب)' },
    { 'التعليمات': '4. تاريخ الإصابة (مطلوب)' },
    { 'التعليمات': '5. نوع الإصابة (مطلوب)' },
    { 'التعليمات': '6. الملاحظات (اختياري)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📅 صيغ التاريخ المدعومة:' },
    { 'التعليمات': '• 2024-03-15 (السنة-الشهر-اليوم) - الأفضل' },
    { 'التعليمات': '• 15/3/2024 (اليوم/الشهر/السنة)' },
    { 'التعليمات': '• 15-3-2024 (اليوم-الشهر-السنة)' },
    { 'التعليمات': '• 15.3.2024 (اليوم.الشهر.السنة)' },
    { 'التعليمات': '' },
    { 'التعليمات': '🩺 أنواع الإصابات المتاحة:' },
    { 'التعليمات': '• إصابة خطيرة، إصابة متوسطة، إصابة بسيطة' },
    { 'التعليمات': '• إصابة بالرأس، إصابة بالأطراف، إصابة بالصدر' },
    { 'التعليمات': '• إصابة بالبطن، إصابة بالعمود الفقري، إصابة بالعين' },
    { 'التعليمات': '• حروق، بتر، إصابة أخرى' },
    { 'التعليمات': '• راجع ورقة "أنواع الإصابات" للتفاصيل' },
    { 'التعليمات': '' },
    { 'التعليمات': '📱 رقم الجوال:' },
    { 'التعليمات': '• يمكن استخدام بيانات ولي أمر موجود في النظام' },
    { 'التعليمات': '• راجع ورقة "أولياء الأمور المتاحين" للاستفادة من بياناتهم' },
    { 'التعليمات': '• يمكن إدخال رقم جوال جديد إذا لم يكن الجريح مسجلاً كولي أمر' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• استخدم صيغة التاريخ المفضلة: YYYY-MM-DD' },
    { 'التعليمات': '• تأكد من كتابة نوع الإصابة بالضبط كما هو مكتوب' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الجرحى');
  XLSX.utils.book_append_sheet(workbook, guardiansWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, injuryTypesWorksheet, 'أنواع الإصابات');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب الجرحى',
    Subject: 'قالب لاستيراد بيانات الجرحى',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات الجرحى إلى Excel
export const exportInjuredToExcel = (injured: Injured[]) => {
  const exportData = injured.map(injuredPerson => ({
    'اسم الجريح': injuredPerson.name,
    'رقم هوية الجريح': injuredPerson.nationalId,
    'رقم الجوال': injuredPerson.phone,
    'تاريخ الإصابة': injuredPerson.injuryDate,
    'نوع الإصابة': injuredPerson.injuryType,
    'ملاحظات': injuredPerson.notes || '',
    'تاريخ التسجيل': new Date(injuredPerson.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(injuredPerson.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم الجريح
    { wch: 20 }, // رقم هوية الجريح
    { wch: 15 }, // رقم الجوال
    { wch: 15 }, // تاريخ الإصابة
    { wch: 20 }, // نوع الإصابة
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الجرحى');

  workbook.Props = {
    Title: 'بيانات الجرحى',
    Subject: 'تصدير بيانات الجرحى',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات الجرحى مع التحقق من الأخطاء
export const importInjuredFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validInjured: Partial<Injured>[];
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

        const validInjured: Partial<Injured>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // أنواع الإصابات المتاحة
        const injuryTypes = [
          'إصابة خطيرة',
          'إصابة متوسطة',
          'إصابة بسيطة',
          'إصابة بالرأس',
          'إصابة بالأطراف',
          'إصابة بالصدر',
          'إصابة بالبطن',
          'إصابة بالعمود الفقري',
          'إصابة بالعين',
          'حروق',
          'بتر',
          'إصابة أخرى'
        ];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const injuredPerson: Partial<Injured> = {};
          let hasErrors = false;

          // اسم الجريح (مطلوب)
          const name = row['اسم الجريح'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الجريح', message: 'اسم الجريح مطلوب'});
            hasErrors = true;
          } else {
            injuredPerson.name = name.toString().trim();
          }

          // رقم هوية الجريح (مطلوب)
          const nationalId = row['رقم هوية الجريح'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الجريح', message: 'رقم هوية الجريح مطلوب'});
            hasErrors = true;
          } else {
            injuredPerson.nationalId = nationalId.toString().trim();
            
            // التحقق من وجود ولي أمر بنفس رقم الهوية لاستخدام بياناته
            const guardian = guardians.find(g => g.nationalId === nationalId.toString().trim());
            if (guardian) {
              injuredPerson.phone = guardian.phone;
            }
          }

          // رقم الجوال (مطلوب)
          const phone = row['رقم الجوال'] || '';
          if (!phone || phone.toString().trim() === '') {
            if (!injuredPerson.phone) { // إذا لم يتم تعيينه من ولي الأمر
              errors.push({row: rowNumber, field: 'رقم الجوال', message: 'رقم الجوال مطلوب'});
              hasErrors = true;
            }
          } else {
            injuredPerson.phone = phone.toString().trim();
          }

          // تاريخ الإصابة (مطلوب)
          const injuryDateValue = row['تاريخ الإصابة'];
          if (!injuryDateValue) {
            errors.push({row: rowNumber, field: 'تاريخ الإصابة', message: 'تاريخ الإصابة مطلوب'});
            hasErrors = true;
          } else {
            const parsedDate = parseAnyDateFormat(injuryDateValue);
            if (!parsedDate) {
              errors.push({
                row: rowNumber, 
                field: 'تاريخ الإصابة', 
                message: `تاريخ الإصابة غير صحيح: "${injuryDateValue}". استخدم صيغة مثل: 2024-03-15 أو 15/3/2024`
              });
              hasErrors = true;
            } else {
              injuredPerson.injuryDate = parsedDate;
            }
          }

          // نوع الإصابة (مطلوب)
          const injuryType = row['نوع الإصابة'] || '';
          if (!injuryType || injuryType.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'نوع الإصابة', message: 'نوع الإصابة مطلوب'});
            hasErrors = true;
          } else {
            const injuryTypeStr = injuryType.toString().trim();
            if (injuryTypes.includes(injuryTypeStr)) {
              injuredPerson.injuryType = injuryTypeStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'نوع الإصابة', 
                message: `نوع الإصابة غير صحيح: "${injuryTypeStr}". الأنواع المتاحة: ${injuryTypes.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // الملاحظات (اختياري)
          injuredPerson.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validInjured.push(injuredPerson);
          }
        });

        resolve({ validInjured, errors });
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
export const exportInjuredErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'تاريخ الإصابة' ? 'خطأ في التاريخ' : 
                  error.field === 'نوع الإصابة' ? 'خطأ في نوع الإصابة' : 'خطأ في البيانات'
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
    { 'الحلول': '🩺 مشاكل نوع الإصابة:' },
    { 'الحلول': '• استخدم الأنواع المحددة فقط من ورقة "أنواع الإصابات"' },
    { 'الحلول': '• تأكد من كتابة النوع بالضبط كما هو مكتوب' },
    { 'الحلول': '• لا تضع مسافات إضافية قبل أو بعد النوع' },
    { 'الحلول': '' },
    { 'الحلول': '📱 مشاكل رقم الجوال:' },
    { 'الحلول': '• تأكد من إدخال رقم جوال صحيح' },
    { 'الحلول': '• يمكن الاستفادة من بيانات أولياء الأمور الموجودين' },
    { 'الحلول': '• إذا كان الجريح مسجلاً كولي أمر، استخدم نفس رقم الهوية' },
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
    Title: 'أخطاء استيراد الجرحى',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد الجرحى مع الحلول',
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