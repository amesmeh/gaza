# نظام إدارة المساعدات لقطاع غزة

نظام شامل لإدارة المساعدات وأولياء الأمور في قطاع غزة، مبني باستخدام React و Node.js و MongoDB.

## المميزات

- **إدارة أولياء الأمور**: تسجيل وإدارة بيانات أولياء الأمور وعائلاتهم
- **إدارة المساعدات**: تتبع وتوزيع المساعدات على أولياء الأمور
- **إدارة المناطق**: تنظيم المناطق ومندوبيها
- **نظام صلاحيات**: صلاحيات مختلفة للمدير العام ومندوبي المناطق والمراقبين
- **تصدير واستيراد Excel**: إمكانية تصدير واستيراد البيانات بصيغة Excel
- **بحث متقدم**: بحث وفلاتر متقدمة للبيانات
- **واجهة مستخدم حديثة**: تصميم جميل وسهل الاستخدام

## التقنيات المستخدمة

### الواجهة الأمامية (Frontend)
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide React (الأيقونات)

### الخلفية (Backend)
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

### قاعدة البيانات
- MongoDB Atlas (سحابية)
- أو MongoDB محلي

## التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn
- MongoDB (محلي أو Atlas)

### تثبيت الواجهة الأمامية

```bash
# تثبيت الاعتماديات
npm install

# تشغيل في بيئة التطوير
npm run dev

# بناء للمنتج
npm run build

# معاينة البناء
npm run preview
```

### تثبيت الخلفية

```bash
# الانتقال إلى مجلد الخلفية
cd backend

# تثبيت الاعتماديات
npm install

# إعداد متغيرات البيئة
# أنشئ ملف .env وأضف:
# MONGODB_URI=mongodb://localhost:27017/aid-system
# PORT=4000

# تشغيل السيرفر
npm start

# تشغيل في بيئة التطوير
npm run dev
```

### إعداد متغيرات البيئة

#### الواجهة الأمامية
أنشئ ملف `.env` في المجلد الرئيسي:

```env
VITE_API_URL=http://localhost:4000
```

#### الخلفية
أنشئ ملف `.env` في مجلد `backend`:

```env
MONGODB_URI=mongodb://localhost:27017/aid-system
PORT=4000
```

## النشر

### نشر الخلفية على Render

1. ارفع مجلد `backend` إلى مستودع GitHub منفصل
2. أنشئ خدمة جديدة على Render
3. اربط الخدمة بمستودع GitHub
4. اضبط متغيرات البيئة:
   - `MONGODB_URI`: رابط MongoDB Atlas
   - `PORT`: اتركه فارغاً
5. اضبط Build Command: `npm install`
6. اضبط Start Command: `node index.js`

### نشر الواجهة الأمامية على Vercel

1. ارفع المشروع إلى GitHub
2. اربط المشروع بـ Vercel
3. اضبط متغير البيئة:
   - `VITE_API_URL`: رابط الخلفية على Render
4. اضبط Build Command: `npm run build`
5. اضبط Output Directory: `dist`

## هيكل المشروع

```
project/
├── src/                    # الواجهة الأمامية
│   ├── components/         # المكونات
│   ├── context/           # React Context
│   ├── hooks/             # Custom Hooks
│   ├── services/          # API Services
│   ├── types/             # TypeScript Types
│   └── utils/             # Utilities
├── backend/               # الخلفية
│   ├── index.js          # نقطة البداية
│   ├── models/           # نماذج MongoDB
│   └── package.json      # اعتماديات الخلفية
├── public/               # الملفات العامة
└── package.json          # اعتماديات الواجهة الأمامية
```

## API Endpoints

### المساعدات
- `GET /aids` - جلب جميع المساعدات
- `POST /aids` - إضافة مساعدة جديدة
- `PUT /aids/:id` - تحديث مساعدة
- `DELETE /aids/:id` - حذف مساعدة

### أولياء الأمور
- `GET /guardians` - جلب جميع أولياء الأمور
- `POST /guardians` - إضافة ولي أمر جديد
- `PUT /guardians/:id` - تحديث ولي أمر
- `DELETE /guardians/:id` - حذف ولي أمر

### المناطق
- `GET /areas` - جلب جميع المناطق
- `POST /areas` - إضافة منطقة جديدة
- `PUT /areas/:id` - تحديث منطقة
- `DELETE /areas/:id` - حذف منطقة

## المساهمة

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. أنشئ Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح issue في GitHub.