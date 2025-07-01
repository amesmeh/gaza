import * as XLSX from 'xlsx';
import { Guardian, Area } from '../types';

// إنشاء قالب Excel لأولياء الأمور
export const createGuardiansTemplate = (areas: Area[]) => {
  const templateData = [
    {
      'الاسم': 'مثال: محمد أحمد السالم',
      'رقم الهوية': '123456789',
      'رقم الجوال': '0597123456',
      'الجنس': 'ذكر',
      'الحالة الاجتماعية': 'متزوج',
      'عدد الأبناء': 3,
      'عدد الزوجات': 1,
      'الحي': areas[0]?.name || 'الرباط',
      'حالة الإقامة': 'مقيم',
      'المحافظة الأصلية': 'غزة',
      'المدينة الأصلية': 'غزة',
      'عنوان النزوح': '',
      'الوظيفة الحالية': 'موظف'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 20 }, // الاسم
    { wch: 15 }, // رقم الهوية
    { wch: 15 }, // رقم الجوال
    { wch: 10 }, // الجنس
    { wch: 15 }, // الحالة الاجتماعية
    { wch: 12 }, // عدد الأبناء
    { wch: 12 }, // عدد الزوجات
    { wch: 15 }, // الحي
    { wch: 15 }, // حالة الإقامة
    { wch: 15 }, // المحافظة الأصلية
    { wch: 15 }, // المدينة الأصلية
    { wch: 20 }, // عنوان النزوح
    { wch: 15 }  // الوظيفة الحالية
  ];
  worksheet['!cols'] = columnWidths;

  // إنشاء ورقة الأحياء المتاحة
  const areasData = areas.map(area => ({
    'رقم الحي': area.id,
    'اسم الحي': area.name,
    'اسم المندوب': area.representativeName,
    'رقم هاتف المندوب': area.representativePhone
  }));

  const areasWorksheet = XLSX.utils.json_to_sheet(areasData);
  areasWorksheet['!dir'] = 'rtl';
  areasWorksheet['!cols'] = [
    { wch: 12 }, // رقم الحي
    { wch: 20 }, // اسم الحي
    { wch: 20 }, // اسم المندوب
    { wch: 15 }  // رقم هاتف المندوب
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': 'ملاحظات مهمة لملء البيانات:' },
    { 'التعليمات': '1. الاسم ورقم الهوية مطلوبان' },
    { 'التعليمات': '2. الجنس: ذكر أو أنثى' },
    { 'التعليمات': '3. الحالة الاجتماعية: متزوج، أرمل، مطلق، أعزب' },
    { 'التعليمات': '4. حالة الإقامة: مقيم أو نازح' },
    { 'التعليمات': '5. في حالة النزوح، يجب ملء بيانات المحافظة والمدينة الأصلية' },
    { 'التعليمات': '6. الحي يجب أن يكون من الأحياء الموجودة في ورقة الأحياء' },
    { 'التعليمات': '7. عدد أفراد العائلة سيتم حسابه تلقائياً (عدد الأبناء + عدد الزوجات + 1)' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 60 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب أولياء الأمور');
  XLSX.utils.book_append_sheet(workbook, areasWorksheet, 'الأحياء المتاحة');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب أولياء الأمور',
    Subject: 'قالب لاستيراد بيانات أولياء الأمور',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير بيانات أولياء الأمور إلى Excel
export const exportGuardiansToExcel = (guardians: Guardian[]) => {
  const exportData = guardians.map(guardian => ({
    'الاسم': guardian.name,
    'رقم الهوية': guardian.nationalId,
    'رقم الجوال': guardian.phone,
    'الجنس': guardian.gender === 'male' ? 'ذكر' : 'أنثى',
    'الحالة الاجتماعية': guardian.maritalStatus,
    'عدد الأبناء': guardian.childrenCount,
    'عدد الزوجات': guardian.wivesCount,
    'الحي': guardian.area?.name || '',
    'حالة الإقامة': guardian.residenceStatus === 'resident' ? 'مقيم' : 'نازح',
    'المحافظة الأصلية': guardian.originalGovernorate || '',
    'المدينة الأصلية': guardian.originalCity || '',
    'عنوان النزوح': guardian.displacementAddress || '',
    'الوظيفة الحالية': guardian.currentJob || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 20 }, // الاسم
    { wch: 15 }, // رقم الهوية
    { wch: 15 }, // رقم الجوال
    { wch: 10 }, // الجنس
    { wch: 15 }, // الحالة الاجتماعية
    { wch: 12 }, // عدد الأبناء
    { wch: 12 }, // عدد الزوجات
    { wch: 15 }, // الحي
    { wch: 15 }, // حالة الإقامة
    { wch: 15 }, // المحافظة الأصلية
    { wch: 15 }, // المدينة الأصلية
    { wch: 20 }, // عنوان النزوح
    { wch: 15 }  // الوظيفة الحالية
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أولياء الأمور');

  workbook.Props = {
    Title: 'بيانات أولياء الأمور',
    Subject: 'تصدير بيانات أولياء الأمور',
    Author: 'نظام مساعدات غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد البيانات مع التحقق من الأخطاء
export const importGuardiansFromExcel = (file: File, areas: Area[]): Promise<{
  validGuardians: Partial<Guardian>[];
  errors: Array<{row: number, field: string, message: string}>;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        console.log('قراءة ملف Excel...');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          reject(new Error('الملف لا يحتوي على أوراق عمل'));
          return;
        }
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('البيانات المقروءة من Excel:', jsonData);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          reject(new Error('الملف لا يحتوي على بيانات صحيحة'));
          return;
        }

        const validGuardians: Partial<Guardian>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // +2 لأن الصف الأول هو العناوين
          const guardian: Partial<Guardian> = {};
          let hasErrors = false;

          console.log(`معالجة الصف ${rowNumber}:`, row);

          // الاسم (مطلوب)
          const name = row['الاسم'] || '';
          if (!name || name.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'الاسم', message: 'الاسم مطلوب'});
            hasErrors = true;
          } else {
            guardian.name = name.toString().trim();
          }

          // رقم الهوية (مطلوب)
          const nationalId = row['رقم الهوية'] || '';
          if (!nationalId || nationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم الهوية', message: 'رقم الهوية مطلوب'});
            hasErrors = true;
          } else {
            guardian.nationalId = nationalId.toString().trim();
          }

          // رقم الجوال
          guardian.phone = (row['رقم الجوال'] || '').toString().trim();

          // الجنس
          const gender = (row['الجنس'] || 'ذكر').toString().trim();
          if (gender === 'ذكر' || gender.toLowerCase() === 'male') {
            guardian.gender = 'male';
          } else if (gender === 'أنثى' || gender.toLowerCase() === 'female') {
            guardian.gender = 'female';
          } else {
            guardian.gender = 'male'; // القيمة الافتراضية
          }

          // الحالة الاجتماعية
          const maritalStatus = (row['الحالة الاجتماعية'] || 'أعزب').toString().trim();
          guardian.maritalStatus = maritalStatus;

          // عدد الأبناء
          const childrenCount = parseInt(row['عدد الأبناء']);
          guardian.childrenCount = isNaN(childrenCount) ? 0 : Math.max(0, childrenCount);

          // عدد الزوجات
          const wivesCount = parseInt(row['عدد الزوجات']);
          guardian.wivesCount = isNaN(wivesCount) ? 0 : Math.max(0, wivesCount);

          // حساب عدد أفراد العائلة
          guardian.familyMembersCount = guardian.childrenCount + guardian.wivesCount + 1;

          // الوظيفة الحالية
          guardian.currentJob = (row['الوظيفة الحالية'] || '').toString().trim();

          // حالة الإقامة
          const residenceStatus = (row['حالة الإقامة'] || 'مقيم').toString().trim();
          if (residenceStatus === 'نازح' || residenceStatus.toLowerCase() === 'displaced') {
            guardian.residenceStatus = 'displaced';
          } else {
            guardian.residenceStatus = 'resident';
          }

          // المحافظة والمدينة الأصلية
          guardian.originalGovernorate = (row['المحافظة الأصلية'] || '').toString().trim();
          guardian.originalCity = (row['المدينة الأصلية'] || '').toString().trim();
          guardian.displacementAddress = (row['عنوان النزوح'] || '').toString().trim();

          // الحي - البحث بالاسم
          const areaName = (row['الحي'] || '').toString().trim();
          if (areaName) {
            const foundArea = areas.find(area => area.name === areaName);
            if (foundArea) {
              guardian.areaId = foundArea.id;
            } else {
              // إذا لم يتم العثور على الحي، استخدم الحي الأول كافتراضي
              guardian.areaId = areas[0]?.id || 1;
              errors.push({row: rowNumber, field: 'الحي', message: `الحي "${areaName}" غير موجود، تم استخدام الحي الافتراضي`});
            }
          } else {
            guardian.areaId = areas[0]?.id || 1;
          }

          if (!hasErrors) {
            validGuardians.push(guardian);
            console.log(`تم إضافة ولي الأمر: ${guardian.name}`);
          }
        });

        console.log(`تم معالجة ${jsonData.length} صف، ${validGuardians.length} صحيح، ${errors.length} خطأ`);
        resolve({ validGuardians, errors });
      } catch (error) {
        console.error('خطأ في قراءة الملف:', error);
        reject(new Error('خطأ في قراءة الملف. تأكد من أن الملف بصيغة Excel صحيحة.'));
      }
    };

    reader.onerror = () => {
      console.error('خطأ في قراءة الملف');
      reject(new Error('خطأ في قراءة الملف.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// تصدير ملف الأخطاء
export const exportErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
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
    { wch: 40 }  // رسالة الخطأ
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'أخطاء الاستيراد');

  workbook.Props = {
    Title: 'أخطاء استيراد أولياء الأمور',
    Subject: 'تقرير الأخطاء في عملية الاستيراد',
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