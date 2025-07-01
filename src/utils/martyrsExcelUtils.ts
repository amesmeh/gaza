import * as XLSX from 'xlsx';
import { Martyr } from '../types';

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

// إنشاء قالب Excel للشهداء
export const createMartyrsTemplate = () => {
  const templateData = [
    {
      'اسم الشهيد': 'مثال: أحمد محمد السالم',
      'رقم هوية الشهيد': '123456789',
      'تاريخ الاستشهاد': '2024-01-15',
      'اسم الوكيل': 'محمد أحمد السالم',
      'رقم هوية الوكيل': '987654321',
      'رقم جوال الوكيل': '0597123456',
      'صلة القرابة بالشهيد': 'والد',
      'ملاحظات': 'ملاحظات إضافية'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم الشهيد
    { wch: 20 }, // رقم هوية الشهيد
    { wch: 18 }, // تاريخ الاستشهاد
    { wch: 25 }, // اسم الوكيل
    { wch: 20 }, // رقم هوية الوكيل
    { wch: 18 }, // رقم جوال الوكيل
    { wch: 20 }, // صلة القرابة بالشهيد
    { wch: 30 }  // ملاحظات
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة صلات القرابة المتاحة
  const relationshipsData = [
    { 'صلة القرابة': 'والد', 'الوصف': 'والد الشهيد' },
    { 'صلة القرابة': 'والدة', 'الوصف': 'والدة الشهيد' },
    { 'صلة القرابة': 'زوج', 'الوصف': 'زوج الشهيدة' },
    { 'صلة القرابة': 'زوجة', 'الوصف': 'زوجة الشهيد' },
    { 'صلة القرابة': 'ابن', 'الوصف': 'ابن الشهيد' },
    { 'صلة القرابة': 'ابنة', 'الوصف': 'ابنة الشهيد' },
    { 'صلة القرابة': 'أخ', 'الوصف': 'أخ الشهيد' },
    { 'صلة القرابة': 'أخت', 'الوصف': 'أخت الشهيد' },
    { 'صلة القرابة': 'عم', 'الوصف': 'عم الشهيد' },
    { 'صلة القرابة': 'عمة', 'الوصف': 'عمة الشهيد' },
    { 'صلة القرابة': 'خال', 'الوصف': 'خال الشهيد' },
    { 'صلة القرابة': 'خالة', 'الوصف': 'خالة الشهيد' },
    { 'صلة القرابة': 'جد', 'الوصف': 'جد الشهيد' },
    { 'صلة القرابة': 'جدة', 'الوصف': 'جدة الشهيد' },
    { 'صلة القرابة': 'حفيد', 'الوصف': 'حفيد الشهيد' },
    { 'صلة القرابة': 'حفيدة', 'الوصف': 'حفيدة الشهيد' },
    { 'صلة القرابة': 'صديق', 'الوصف': 'صديق الشهيد' },
    { 'صلة القرابة': 'قريب', 'الوصف': 'قريب الشهيد' },
    { 'صلة القرابة': 'أخرى', 'الوصف': 'صلة قرابة أخرى' }
  ];

  const relationshipsWorksheet = XLSX.utils.json_to_sheet(relationshipsData);
  relationshipsWorksheet['!dir'] = 'rtl';
  relationshipsWorksheet['!cols'] = [
    { wch: 20 }, // صلة القرابة
    { wch: 30 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء بيانات الشهداء:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. اسم الشهيد (مطلوب)' },
    { 'التعليمات': '2. رقم هوية الشهيد (مطلوب)' },
    { 'التعليمات': '3. تاريخ الاستشهاد (مطلوب)' },
    { 'التعليمات': '4. اسم الوكيل (مطلوب)' },
    { 'التعليمات': '5. رقم هوية الوكيل (مطلوب)' },
    { 'التعليمات': '6. رقم جوال الوكيل (مطلوب)' },
    { 'التعليمات': '7. صلة القرابة بالشهيد (مطلوب)' },
    { 'التعليمات': '8. الملاحظات (اختياري)' },
    { 'التعليمات': '' },
    { 'التعليمات': '📅 صيغ التاريخ المدعومة:' },
    { 'التعليمات': '• 2024-01-15 (السنة-الشهر-اليوم) - الأفضل' },
    { 'التعليمات': '• 15/1/2024 (اليوم/الشهر/السنة)' },
    { 'التعليمات': '• 15-1-2024 (اليوم-الشهر-السنة)' },
    { 'التعليمات': '• 15.1.2024 (اليوم.الشهر.السنة)' },
    { 'التعليمات': '' },
    { 'التعليمات': '👥 صلات القرابة المتاحة:' },
    { 'التعليمات': '• والد، والدة، زوج، زوجة' },
    { 'التعليمات': '• ابن، ابنة، أخ، أخت' },
    { 'التعليمات': '• عم، عمة، خال، خالة' },
    { 'التعليمات': '• جد، جدة، حفيد، حفيدة' },
    { 'التعليمات': '• صديق، قريب، أخرى' },
    { 'التعليمات': '• راجع ورقة "صلات القرابة المتاحة" للتفاصيل' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• استخدم صيغة التاريخ المفضلة: YYYY-MM-DD' },
    { 'التعليمات': '• تأكد من كتابة صلة القرابة بالضبط كما هو مكتوب' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' },
    { 'التعليمات': '' },
    { 'التعليمات': '🔄 معلومات تلقائية:' },
    { 'التعليمات': '• تاريخ التسجيل سيتم إضافته تلقائياً' },
    { 'التعليمات': '• رقم الشهيد سيتم توليده تلقائياً' },
    { 'التعليمات': '• يمكن ترك الملاحظات فارغة إذا لم تكن ضرورية' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الشهداء');
  XLSX.utils.book_append_sheet(workbook, relationshipsWorksheet, 'صلات القرابة المتاحة');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب الشهداء',
    Subject: 'قالب لاستيراد بيانات الشهداء',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات الشهداء إلى Excel
export const exportMartyrsToExcel = (martyrs: Martyr[]) => {
  const exportData = martyrs.map(martyr => ({
    'اسم الشهيد': martyr.name,
    'رقم هوية الشهيد': martyr.nationalId,
    'تاريخ الاستشهاد': martyr.martyrdomDate,
    'اسم الوكيل': martyr.agentName,
    'رقم هوية الوكيل': martyr.agentNationalId,
    'رقم جوال الوكيل': martyr.agentPhone,
    'صلة القرابة بالشهيد': martyr.relationshipToMartyr,
    'ملاحظات': martyr.notes || '',
    'تاريخ التسجيل': new Date(martyr.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(martyr.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم الشهيد
    { wch: 20 }, // رقم هوية الشهيد
    { wch: 18 }, // تاريخ الاستشهاد
    { wch: 25 }, // اسم الوكيل
    { wch: 20 }, // رقم هوية الوكيل
    { wch: 18 }, // رقم جوال الوكيل
    { wch: 20 }, // صلة القرابة بالشهيد
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الشهداء');

  workbook.Props = {
    Title: 'بيانات الشهداء',
    Subject: 'تصدير بيانات الشهداء',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات الشهداء مع التحقق من الأخطاء
export const importMartyrsFromExcel = (file: File): Promise<{
  validMartyrs: Partial<Martyr>[];
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

        const validMartyrs: Partial<Martyr>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // صلات القرابة المتاحة
        const relationships = [
          'والد', 'والدة', 'زوج', 'زوجة', 'ابن', 'ابنة', 'أخ', 'أخت',
          'عم', 'عمة', 'خال', 'خالة', 'جد', 'جدة', 'حفيد', 'حفيدة',
          'صديق', 'قريب', 'أخرى'
        ];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const martyr: Partial<Martyr> = {};
          let hasErrors = false;

          // اسم الشهيد (مطلوب)
          const name = row['اسم الشهيد'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الشهيد', message: 'اسم الشهيد مطلوب'});
            hasErrors = true;
          } else {
            martyr.name = name.toString().trim();
          }

          // رقم هوية الشهيد (مطلوب)
          const nationalId = row['رقم هوية الشهيد'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الشهيد', message: 'رقم هوية الشهيد مطلوب'});
            hasErrors = true;
          } else {
            martyr.nationalId = nationalId.toString().trim();
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
              martyr.martyrdomDate = parsedDate;
            }
          }

          // اسم الوكيل (مطلوب)
          const agentName = row['اسم الوكيل'] || '';
          if (!agentName || agentName.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الوكيل', message: 'اسم الوكيل مطلوب'});
            hasErrors = true;
          } else {
            martyr.agentName = agentName.toString().trim();
          }

          // رقم هوية الوكيل (مطلوب)
          const agentNationalId = row['رقم هوية الوكيل'] || '';
          if (!agentNationalId || agentNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الوكيل', message: 'رقم هوية الوكيل مطلوب'});
            hasErrors = true;
          } else {
            martyr.agentNationalId = agentNationalId.toString().trim();
          }

          // رقم جوال الوكيل (مطلوب)
          const agentPhone = row['رقم جوال الوكيل'] || '';
          if (!agentPhone || agentPhone.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم جوال الوكيل', message: 'رقم جوال الوكيل مطلوب'});
            hasErrors = true;
          } else {
            martyr.agentPhone = agentPhone.toString().trim();
          }

          // صلة القرابة بالشهيد (مطلوب)
          const relationshipToMartyr = row['صلة القرابة بالشهيد'] || '';
          if (!relationshipToMartyr || relationshipToMartyr.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'صلة القرابة بالشهيد', message: 'صلة القرابة بالشهيد مطلوبة'});
            hasErrors = true;
          } else {
            const relationshipStr = relationshipToMartyr.toString().trim();
            if (relationships.includes(relationshipStr)) {
              martyr.relationshipToMartyr = relationshipStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'صلة القرابة بالشهيد', 
                message: `صلة القرابة غير صحيحة: "${relationshipStr}". الصلات المتاحة: ${relationships.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // الملاحظات (اختياري)
          martyr.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validMartyrs.push(martyr);
          }
        });

        resolve({ validMartyrs, errors });
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
export const exportMartyrsErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'تاريخ الاستشهاد' ? 'خطأ في التاريخ' : 
                  error.field.includes('الوكيل') ? 'خطأ في بيانات الوكيل' : 
                  error.field === 'صلة القرابة بالشهيد' ? 'خطأ في صلة القرابة' : 'خطأ في البيانات'
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
    { 'الحلول': '• تأكد من استخدام صيغة صحيحة: 2024-01-15 أو 15/1/2024' },
    { 'الحلول': '• تجنب ترك خانة التاريخ فارغة' },
    { 'الحلول': '• استخدم تواريخ منطقية (2020-2030)' },
    { 'الحلول': '' },
    { 'الحلول': '👥 مشاكل صلة القرابة:' },
    { 'الحلول': '• استخدم الصلات المحددة فقط من ورقة "صلات القرابة المتاحة"' },
    { 'الحلول': '• تأكد من كتابة الصلة بالضبط كما هو مكتوب' },
    { 'الحلول': '• لا تضع مسافات إضافية قبل أو بعد الصلة' },
    { 'الحلول': '' },
    { 'الحلول': '📝 مشاكل البيانات العامة:' },
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
    Title: 'أخطاء استيراد الشهداء',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد الشهداء مع الحلول',
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