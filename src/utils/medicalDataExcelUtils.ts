import * as XLSX from 'xlsx';
import { MedicalData, Guardian } from '../types';

// إنشاء قالب Excel للبيانات المرضية
export const createMedicalDataTemplate = (guardians: Guardian[]) => {
  const templateData = [
    {
      'اسم المريض': 'مثال: أحمد محمد السالم',
      'رقم هوية المريض': '123456789',
      'رقم هوية ولي الأمر': guardians[0]?.nationalId || '123456789',
      'نوع المرض': 'مرض مزمن',
      'رقم الجوال': '0597123456',
      'ملاحظات': 'ملاحظات إضافية'
    }
  ];

  // إنشاء ورقة العمل
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // تعيين اتجاه RTL للورقة
  worksheet['!dir'] = 'rtl';

  // تعيين عرض الأعمدة
  const columnWidths = [
    { wch: 25 }, // اسم المريض
    { wch: 20 }, // رقم هوية المريض
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 20 }, // نوع المرض
    { wch: 15 }, // رقم الجوال
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

  // إنشاء ورقة أنواع الأمراض
  const diseaseTypesData = [
    { 'نوع المرض': 'مرض مزمن', 'الوصف': 'أمراض مزمنة متنوعة' },
    { 'نوع المرض': 'مرض قلب', 'الوصف': 'أمراض القلب والأوعية الدموية' },
    { 'نوع المرض': 'مرض الربو', 'الوصف': 'الربو وأمراض الجهاز التنفسي' },
    { 'نوع المرض': 'مرض الصرع', 'الوصف': 'الصرع وأمراض الأعصاب' },
    { 'نوع المرض': 'مرض السكري', 'الوصف': 'داء السكري بأنواعه' },
    { 'نوع المرض': 'مرض الكلى', 'الوصف': 'أمراض الكلى والمسالك البولية' },
    { 'نوع المرض': 'مرض الضغط', 'الوصف': 'ارتفاع ضغط الدم' },
    { 'نوع المرض': 'مرض الغدة الدرقية', 'الوصف': 'اضطرابات الغدة الدرقية' },
    { 'نوع المرض': 'مرض الكبد', 'الوصف': 'أمراض الكبد' },
    { 'نوع المرض': 'مرض السرطان', 'الوصف': 'الأورام السرطانية' },
    { 'نوع المرض': 'مرض الجهاز الهضمي', 'الوصف': 'أمراض المعدة والأمعاء' },
    { 'نوع المرض': 'مرض الجهاز التنفسي', 'الوصف': 'أمراض الرئة والجهاز التنفسي' },
    { 'نوع المرض': 'مرض العظام', 'الوصف': 'أمراض العظام والمفاصل' },
    { 'نوع المرض': 'مرض العيون', 'الوصف': 'أمراض العيون' },
    { 'نوع المرض': 'مرض الأعصاب', 'الوصف': 'أمراض الجهاز العصبي' },
    { 'نوع المرض': 'مرض نفسي', 'الوصف': 'الاضطرابات النفسية' },
    { 'نوع المرض': 'مرض جلدي', 'الوصف': 'أمراض الجلد' },
    { 'نوع المرض': 'مرض آخر', 'الوصف': 'أمراض أخرى غير مصنفة' }
  ];

  const diseaseTypesWorksheet = XLSX.utils.json_to_sheet(diseaseTypesData);
  diseaseTypesWorksheet['!dir'] = 'rtl';
  diseaseTypesWorksheet['!cols'] = [
    { wch: 25 }, // نوع المرض
    { wch: 40 }  // الوصف
  ];

  // إنشاء ورقة التعليمات
  const instructionsData = [
    { 'التعليمات': '📋 ملاحظات مهمة لملء البيانات المرضية:' },
    { 'التعليمات': '' },
    { 'التعليمات': '✅ الحقول المطلوبة:' },
    { 'التعليمات': '1. اسم المريض (مطلوب)' },
    { 'التعليمات': '2. رقم هوية المريض (مطلوب)' },
    { 'التعليمات': '3. رقم هوية ولي الأمر (مطلوب)' },
    { 'التعليمات': '4. نوع المرض (مطلوب)' },
    { 'التعليمات': '5. رقم الجوال (مطلوب)' },
    { 'التعليمات': '6. الملاحظات (اختياري)' },
    { 'التعليمات': '' },
    { 'التعليمات': '🏥 أنواع الأمراض المتاحة:' },
    { 'التعليمات': '• مرض مزمن، مرض قلب، مرض الربو، مرض الصرع' },
    { 'التعليمات': '• مرض السكري، مرض الكلى، مرض الضغط، مرض الغدة الدرقية' },
    { 'التعليمات': '• مرض الكبد، مرض السرطان، مرض الجهاز الهضمي، مرض الجهاز التنفسي' },
    { 'التعليمات': '• مرض العظام، مرض العيون، مرض الأعصاب، مرض نفسي، مرض جلدي، مرض آخر' },
    { 'التعليمات': '• راجع ورقة "أنواع الأمراض" للتفاصيل' },
    { 'التعليمات': '' },
    { 'التعليمات': '👨‍👩‍👧‍👦 شروط ولي الأمر:' },
    { 'التعليمات': '• رقم هوية ولي الأمر يجب أن يكون موجود في النظام' },
    { 'التعليمات': '• راجع ورقة "أولياء الأمور المتاحين" للتأكد' },
    { 'التعليمات': '' },
    { 'التعليمات': '🔄 معلومات تلقائية:' },
    { 'التعليمات': '• اسم ولي الأمر سيتم قراءته تلقائياً من بيانات ولي الأمر' },
    { 'التعليمات': '• رقم الجوال يمكن أن يكون رقم المريض أو رقم ولي الأمر' },
    { 'التعليمات': '• لا تترك خانات فارغة في الحقول المطلوبة' },
    { 'التعليمات': '' },
    { 'التعليمات': '💡 نصائح لتجنب الأخطاء:' },
    { 'التعليمات': '• تأكد من صحة أرقام الهوية قبل الاستيراد' },
    { 'التعليمات': '• تأكد من كتابة نوع المرض بالضبط كما هو مكتوب' },
    { 'التعليمات': '• في حالة وجود أخطاء، سيتم تحميل ملف الأخطاء تلقائياً' }
  ];

  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!dir'] = 'rtl';
  instructionsWorksheet['!cols'] = [{ wch: 80 }];

  // إنشاء كتاب العمل
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب البيانات المرضية');
  XLSX.utils.book_append_sheet(workbook, guardiansWorksheet, 'أولياء الأمور المتاحين');
  XLSX.utils.book_append_sheet(workbook, diseaseTypesWorksheet, 'أنواع الأمراض');
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'التعليمات');

  // تعيين خصائص RTL للكتاب
  workbook.Props = {
    Title: 'قالب البيانات المرضية',
    Subject: 'قالب لاستيراد البيانات المرضية',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// تصدير البيانات المرضية إلى Excel
export const exportMedicalDataToExcel = (medicalData: MedicalData[]) => {
  const exportData = medicalData.map(data => ({
    'اسم المريض': data.patientName,
    'رقم هوية المريض': data.patientNationalId,
    'رقم هوية ولي الأمر': data.guardianNationalId,
    'اسم ولي الأمر': data.guardianName || '',
    'نوع المرض': data.diseaseType,
    'رقم الجوال': data.phone || '',
    'ملاحظات': data.notes || '',
    'تاريخ التسجيل': new Date(data.createdAt).toLocaleDateString('ar-EG'),
    'آخر تحديث': new Date(data.updatedAt).toLocaleDateString('ar-EG')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!dir'] = 'rtl';
  
  // تعيين عرض الأعمدة
  worksheet['!cols'] = [
    { wch: 25 }, // اسم المريض
    { wch: 20 }, // رقم هوية المريض
    { wch: 20 }, // رقم هوية ولي الأمر
    { wch: 25 }, // اسم ولي الأمر
    { wch: 20 }, // نوع المرض
    { wch: 15 }, // رقم الجوال
    { wch: 30 }, // ملاحظات
    { wch: 15 }, // تاريخ التسجيل
    { wch: 15 }  // آخر تحديث
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات المرضية');

  workbook.Props = {
    Title: 'البيانات المرضية',
    Subject: 'تصدير البيانات المرضية',
    Author: 'نظام المساعدات - قطاع غزة',
    CreatedDate: new Date()
  };

  return workbook;
};

// قراءة ملف Excel واستيراد البيانات المرضية مع التحقق من الأخطاء
export const importMedicalDataFromExcel = (file: File, guardians: Guardian[]): Promise<{
  validMedicalData: Partial<MedicalData>[];
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

        const validMedicalData: Partial<MedicalData>[] = [];
        const errors: Array<{row: number, field: string, message: string}> = [];

        // أنواع الأمراض المتاحة
        const diseaseTypes = [
          'مرض مزمن',
          'مرض قلب',
          'مرض الربو',
          'مرض الصرع',
          'مرض السكري',
          'مرض الكلى',
          'مرض الضغط',
          'مرض الغدة الدرقية',
          'مرض الكبد',
          'مرض السرطان',
          'مرض الجهاز الهضمي',
          'مرض الجهاز التنفسي',
          'مرض العظام',
          'مرض العيون',
          'مرض الأعصاب',
          'مرض نفسي',
          'مرض جلدي',
          'مرض آخر'
        ];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2;
          const medicalDataItem: Partial<MedicalData> = {};
          let hasErrors = false;

          // اسم المريض (مطلوب)
          const patientName = row['اسم المريض'] || '';
          if (!patientName || patientName.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'اسم المريض', message: 'اسم المريض مطلوب'});
            hasErrors = true;
          } else {
            medicalDataItem.patientName = patientName.toString().trim();
          }

          // رقم هوية المريض (مطلوب)
          const patientNationalId = row['رقم هوية المريض'] || '';
          if (!patientNationalId || patientNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية المريض', message: 'رقم هوية المريض مطلوب'});
            hasErrors = true;
          } else {
            medicalDataItem.patientNationalId = patientNationalId.toString().trim();
          }

          // رقم هوية ولي الأمر (مطلوب)
          const guardianNationalId = row['رقم هوية ولي الأمر'] || '';
          if (!guardianNationalId || guardianNationalId.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'رقم هوية ولي الأمر', message: 'رقم هوية ولي الأمر مطلوب'});
            hasErrors = true;
          } else {
            const guardianNationalIdStr = guardianNationalId.toString().trim();
            medicalDataItem.guardianNationalId = guardianNationalIdStr;

            // البحث عن ولي الأمر
            const guardian = guardians.find(g => g.nationalId === guardianNationalIdStr);
            if (guardian) {
              medicalDataItem.guardianName = guardian.name;
              
              // استخدام رقم هاتف ولي الأمر إذا لم يتم توفير رقم هاتف آخر
              if (!row['رقم الجوال'] || row['رقم الجوال'].toString().trim() === '') {
                medicalDataItem.phone = guardian.phone;
              }
            } else {
              errors.push({
                row: rowNumber, 
                field: 'رقم هوية ولي الأمر', 
                message: `لم يتم العثور على ولي أمر برقم الهوية: ${guardianNationalIdStr}`
              });
              hasErrors = true;
            }
          }

          // نوع المرض (مطلوب)
          const diseaseType = row['نوع المرض'] || '';
          if (!diseaseType || diseaseType.toString().trim() === '') {
            errors.push({row: rowNumber, field: 'نوع المرض', message: 'نوع المرض مطلوب'});
            hasErrors = true;
          } else {
            const diseaseTypeStr = diseaseType.toString().trim();
            if (diseaseTypes.includes(diseaseTypeStr)) {
              medicalDataItem.diseaseType = diseaseTypeStr;
            } else {
              errors.push({
                row: rowNumber, 
                field: 'نوع المرض', 
                message: `نوع المرض غير صحيح: "${diseaseTypeStr}". الأنواع المتاحة: ${diseaseTypes.join(', ')}`
              });
              hasErrors = true;
            }
          }

          // رقم الجوال (مطلوب)
          const phone = row['رقم الجوال'] || '';
          if (phone && phone.toString().trim() !== '') {
            medicalDataItem.phone = phone.toString().trim();
          } else if (!medicalDataItem.phone) {
            errors.push({row: rowNumber, field: 'رقم الجوال', message: 'رقم الجوال مطلوب'});
            hasErrors = true;
          }

          // الملاحظات (اختياري)
          medicalDataItem.notes = (row['ملاحظات'] || '').toString().trim();

          if (!hasErrors) {
            validMedicalData.push(medicalDataItem);
          }
        });

        resolve({ validMedicalData, errors });
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
export const exportMedicalDataErrorsToExcel = (errors: Array<{row: number, field: string, message: string}>) => {
  const errorData = errors.map((error, index) => ({
    'رقم الخطأ': index + 1,
    'رقم الصف في الملف': error.row,
    'الحقل المتأثر': error.field,
    'وصف المشكلة': error.message,
    'نوع الخطأ': error.field === 'نوع المرض' ? 'خطأ في نوع المرض' : 
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
    { 'الحلول': '🏥 مشاكل نوع المرض:' },
    { 'الحلول': '• استخدم الأنواع المحددة فقط من ورقة "أنواع الأمراض"' },
    { 'الحلول': '• تأكد من كتابة النوع بالضبط كما هو مكتوب' },
    { 'الحلول': '• لا تضع مسافات إضافية قبل أو بعد النوع' },
    { 'الحلول': '' },
    { 'الحلول': '👨‍👩‍👧‍👦 مشاكل ولي الأمر:' },
    { 'الحلول': '• تأكد من وجود ولي الأمر في النظام أولاً' },
    { 'الحلول': '• راجع ورقة "أولياء الأمور المتاحين" للتأكد' },
    { 'الحلول': '• تأكد من صحة رقم الهوية (بدون مسافات أو رموز)' },
    { 'الحلول': '' },
    { 'الحلول': '📱 مشاكل رقم الجوال:' },
    { 'الحلول': '• تأكد من إدخال رقم جوال صحيح' },
    { 'الحلول': '• يمكن الاستفادة من بيانات أولياء الأمور الموجودين' },
    { 'الحلول': '• إذا كان المريض مسجلاً كولي أمر، استخدم نفس رقم الهوية' },
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
    Title: 'أخطاء استيراد البيانات المرضية',
    Subject: 'تقرير مفصل للأخطاء في عملية استيراد البيانات المرضية مع الحلول',
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