# Backend - نظام إدارة المساعدات

## التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 16 أو أحدث)
- MongoDB (محلي أو Atlas)

### التثبيت
```bash
npm install
```

### إعداد متغيرات البيئة
1. أنشئ ملف `.env` في مجلد `backend`
2. أضف المتغيرات التالية:

```env
# رابط الاتصال بقاعدة البيانات MongoDB
MONGODB_URI=mongodb://localhost:27017/aid-system

# منفذ السيرفر
PORT=4000
```

### التشغيل المحلي
```bash
npm start
```

### التشغيل في بيئة التطوير
```bash
npm run dev
```

## API Endpoints

### المساعدات (Aids)
- `GET /aids` - جلب جميع المساعدات
- `POST /aids` - إضافة مساعدة جديدة
- `PUT /aids/:id` - تحديث مساعدة
- `DELETE /aids/:id` - حذف مساعدة

### أولياء الأمور (Guardians)
- `GET /guardians` - جلب جميع أولياء الأمور
- `POST /guardians` - إضافة ولي أمر جديد
- `PUT /guardians/:id` - تحديث ولي أمر
- `DELETE /guardians/:id` - حذف ولي أمر

### المناطق (Areas)
- `GET /areas` - جلب جميع المناطق
- `POST /areas` - إضافة منطقة جديدة
- `PUT /areas/:id` - تحديث منطقة
- `DELETE /areas/:id` - حذف منطقة

## النشر على Render

1. ارفع الكود إلى GitHub
2. أنشئ خدمة جديدة على Render
3. اربط الخدمة بمستودع GitHub
4. اضبط متغيرات البيئة في Render:
   - `MONGODB_URI`: رابط Atlas
   - `PORT`: اتركه فارغاً (Render يضبطه تلقائياً)
5. اضبط Build Command: `npm install`
6. اضبط Start Command: `node index.js` 