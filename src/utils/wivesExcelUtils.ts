import * as XLSX from 'xlsx';
import { Wife, Guardian } from '../types';

// إنشاء قالب Excel للزوجات
export const createWivesTemplate = (guardians: Guardian[]) => {
  // فلترة أولياء الأمور الذكور المتزوجين فقط
  const marriedMaleGuardians = guardians.filter(g => 
    g.gender === 'male' && 
    (g.maritalStatus === 'متزوج' || g.wivesCount > 0)
  );

  const templateData = [
    {
      'اسم الزوجة': 'مثال: فاطمة أحمد محمد',
      'رقم هوية الزوجة': '987654321',
      'رقم هوية الزوج': marriedMaleGuardians[0]?.nationalId || '123456789',
      'اسم الزوج': marriedMaleGuardians[0]?.name || 'محمد أحمد السالم'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم الزوجة
    { wch: 20 }, // رقم هوية الزوجة
    { wch: 20 }, // رقم هوية الزوج
    { wch: 25 }  // اسم الزوج
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة أولياء الأمور المتاحين
  const husbandsData = marriedMaleGuardians.map(guardian => ({
    'رقم ولي الأمر': guardian.id,
    'اسم ولي الأمر': guardian.name,
    'رقم هوية ولي الأمر': guardian.nationalId,
    'رقم الهاتف': guardian.phone,
    'عدد الزوجات الحالي': guardian.wivesCount,
    'عدد الأطفال': guardian.childrenCount,
    'المنطقة': guardian.area?.name || 'غير محدد'
  }));

  const husbandsWorksheet = XLSX.utils.json_to_sheet(husbandsData);
  husbandsWorksheet['!dir'] = 'rtl';
  husbandsWorksheet['!cols'] = [
    { wch: 15 }, // رقم ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 15 }, // رقم الهاتف
    { wch: 18 }, // عدد الزوجات الحالي
    { wch: 15 }, // عدد الأطفال
    { wch: 20 }  // المنطقة
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': 'ملاحظات مهمة لملء بيانات الزوجات:' },
    { 'التعليمات': '1. اسم الزوجة ورقم هويتها مطلوبان' },
    { 'التعليمات': '2. رقم هوية الزوج يجب أن يكون موجود في جدول أولياء الأمور' },
    { 'التعليمات': '3. يجب أن يكون ولي الأمر ذكر ومتزوج' },
    { 'التعليمات': '4. اسم الزوج سيتم قراءته تلقائياً من جدول أولياء الأمور' },
    { 'التعليمات': '5. تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '6. راجع ورقة "أولياء الأمور المتاحين" لمعرفة الأزواج المتاحين' },
    { 'التعليمات': '7. لا تترك خانات فارغة في الحقول المطلوبة' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 70 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الزوجات');
  XLSX.utils.book_append_sheet(workbook, husbandsWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب الزوجات',
    Subject: 'قالب لاستيراد بيانات الزوجات',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات الزوجات إلى Excel
export const exportWivesToExcel = (wives: Wife[]) => {
  const exportData = wives.map(wife => ({
    'اسم الزوجة': wife.name,
    'رقم هوية الزوجة': wife.nationalId,
    'رقم هوية الزوج': wife.husbandNationalId,
    'اسم الزوج': wife.husbandName || '',
    'تاريخ التسجيل': new Date(wife.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(wife.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم الزوجة
    { wch: 20 }, // رقم هوية الزوجة
    { wch: 20 }, // رقم هوية الزوج
    { wch: 25 }, // اسم الزوج
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الزوجات');

  workbook.Props = {
    Title: 'بيانات الزوجات',
    Subject: 'تصدير بيانات الزوجات',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد بيانات الزوجات مع التحقق من الأخطاء
export const importWivesFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validWives: Partial<Wife>[];
  errors: Array<{row: number, field: string, message: string}>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validWives: Partial<Wife>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // فلترة أولياء الأمور الذكور المتزوجين فقط
        const marriedMaleGuardians = guardians.filter(g => 
          g.gender === 'male' && 
          (g.maritalStatus === 'متزوج' || g.wivesCount > 0)
        );

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // +2 لأن الصف الأول هو العناوين
          const wife: Partial<Wife> = {};
          let hasErrors = false;

          // اسم الزوجة (مطلوب)
          const name = row['اسم الزوجة'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم الزوجة', message: 'اسم الزوجة مطلوب'});
            hasErrors = true;
          } else {
            wife.name = name.toString().trim();
          }

          // رقم هوية الزوجة (مطلوب)
          const nationalId = row['رقم هوية الزوجة'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الزوجة', message: 'رقم هوية الزوجة مطلوب'});
            hasErrors = true;
          } else {
            wife.nationalId = nationalId.toString().trim();
          }

          // رقم هوية الزوج (مطلوب)
          const husbandNationalId = row['رقم هوية الزوج'] || '';
          if (!husbandNationalId || husbandNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية الزوج', message: 'رقم هوية الزوج مطلوب'});
            hasErrors = true;
          } else {
            const husbandNationalIdStr = husbandNationalId.toString().trim();
            wife.husbandNationalId = husbandNationalIdStr;

            // البحث عن الزوج في قائمة أولياء الأمور
            const husband = marriedMaleGuardians.find(g => g.nationalId === husbandNationalIdStr);
            if (husband) {
              wife.husbandId = husband.id;
              wife.husbandName = husband.name;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'رقم هوية الزوج', 
                message: `لم يتم العثور على ولي أمر ذكر متزوج برقم الهوية: ${husbandNationalIdStr}`
              });
              hasErrors = true;
            }
          }

          if (!hasErrors) {
            validWives.push(wife);
          }
        });

        resolve({ validWives, errors });
      } catch (error) {
        reject(new Error('خطأ في قراءة الملف. تأكد من أن الملف بصيغة Excel صحيحة.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('خطأ في قراءة الملف.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// تصدير ملف الأخطاء
export const exportWivesErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map(error => ({
    'رقم الصف': error.row,
    'الحقل': error.field,
    'رسالة الخطأ': error.message
  }));

  const worksheet = XLSX.utils.json_to_sheet(errorData);
  worksheet['!dir'] = 'rtl';
  worksheet['!cols'] = [
    { wch: 12 }, // رقم الصف
    { wch: 20 }, // الحقل
    { wch: 50 }  // رسالة الخطأ
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أخطاء استيراد الزوجات');

  workbook.Props = {
    Title: 'أخطاء استيراد الزوجات',
    Subject: 'تقرير الأخطاء في عملية استيراد الزوجات',
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