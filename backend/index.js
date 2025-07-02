import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// الاتصال بقاعدة البيانات (Atlas أو من متغير البيئة)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aid-system';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((err) => console.error('فشل الاتصال بقاعدة البيانات:', err));

// تعريف نموذج المساعدة
const AidSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  guardianNationalId: String,
  guardianName: String,
  areaName: String,
  guardianPhone: String,
  aidType: String,
  aidDate: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware لتحديث updatedAt
AidSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

AidSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Aid = mongoose.model('Aid', AidSchema);

// تعريف نموذج ولي الأمر
const GuardianSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  maritalStatus: { type: String, required: true },
  childrenCount: { type: Number, default: 0 },
  wivesCount: { type: Number, default: 0 },
  familyMembersCount: { type: Number, default: 0 },
  currentJob: String,
  residenceStatus: { type: String, enum: ['resident', 'displaced'], required: true },
  originalGovernorate: String,
  originalCity: String,
  displacementAddress: String,
  areaId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware لتحديث updatedAt
GuardianSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

GuardianSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Guardian = mongoose.model('Guardian', GuardianSchema);

// تعريف نموذج المنطقة
const AreaSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  representativeName: String,
  representativeId: String,
  representativePhone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware لتحديث updatedAt
AreaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

AreaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Area = mongoose.model('Area', AreaSchema);

// تعريف نموذج الابن
const ChildSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: Number, required: true },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ChildSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

ChildSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Child = mongoose.model('Child', ChildSchema);

// تعريف نموذج الشهيد
const MartyrSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: Number, required: true },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  martyrdomDate: { type: String, required: true },
  martyrdomLocation: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MartyrSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

MartyrSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Martyr = mongoose.model('Martyr', MartyrSchema);

// تعريف نموذج الجريح
const InjuredSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: Number, required: true },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  injuryDate: { type: String, required: true },
  injuryType: String,
  injuryLocation: String,
  treatmentStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InjuredSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

InjuredSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Injured = mongoose.model('Injured', InjuredSchema);

// تعريف نموذج البيانات الطبية
const MedicalDataSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  medicalCondition: String,
  medications: [String],
  allergies: [String],
  bloodType: String,
  emergencyContact: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MedicalDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

MedicalDataSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const MedicalData = mongoose.model('MedicalData', MedicalDataSchema);

// تعريف نموذج اليتيم
const OrphanSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: Number, required: true },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  orphanageStatus: String,
  supportType: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrphanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

OrphanSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Orphan = mongoose.model('Orphan', OrphanSchema);

// تعريف نموذج الضرر
const DamageSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  guardianId: { type: String, required: true },
  guardianName: String,
  guardianNationalId: String,
  areaId: String,
  areaName: String,
  damageType: { type: String, required: true },
  damageDate: { type: String, required: true },
  damageLocation: String,
  damageDescription: String,
  estimatedCost: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DamageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

DamageSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Damage = mongoose.model('Damage', DamageSchema);

// تعريف نموذج طلب التسجيل
const RegistrationRequestSchema = new mongoose.Schema({
  _id: { type: String, default: () => Math.random().toString(36).substr(2, 9) },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  areaId: String,
  areaName: String,
  requestType: { type: String, required: true },
  requestDetails: String,
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RegistrationRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

RegistrationRequestSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const RegistrationRequest = mongoose.model('RegistrationRequest', RegistrationRequestSchema);

const app = express();
app.use(cors());
app.use(express.json());

// ===== ROUTES للمساعدات =====
// جلب كل المساعدات
app.get('/aids', async (req, res) => {
  try {
    const aids = await Aid.find();
    res.json(aids);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المساعدات' });
  }
});

// إضافة مساعدة جديدة
app.post('/aids', async (req, res) => {
  try {
    const aid = new Aid(req.body);
    await aid.save();
    res.json(aid);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة المساعدة' });
  }
});

// تعديل مساعدة
app.put('/aids/:id', async (req, res) => {
  try {
    const aid = await Aid.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(aid);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث المساعدة' });
  }
});

// حذف مساعدة
app.delete('/aids/:id', async (req, res) => {
  try {
    await Aid.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف المساعدة' });
  }
});

// ===== ROUTES لأولياء الأمور =====
// جلب كل أولياء الأمور
app.get('/guardians', async (req, res) => {
  try {
    const guardians = await Guardian.find();
    res.json(guardians);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب أولياء الأمور' });
  }
});

// إضافة ولي أمر جديد
app.post('/guardians', async (req, res) => {
  try {
    const guardian = new Guardian(req.body);
    await guardian.save();
    res.json(guardian);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة ولي الأمر' });
  }
});

// تعديل ولي أمر
app.put('/guardians/:id', async (req, res) => {
  try {
    const guardian = await Guardian.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(guardian);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث ولي الأمر' });
  }
});

// حذف ولي أمر
app.delete('/guardians/:id', async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف ولي الأمر' });
  }
});

// ===== ROUTES للمناطق =====
// جلب كل المناطق
app.get('/areas', async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المناطق' });
  }
});

// إضافة منطقة جديدة
app.post('/areas', async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة المنطقة' });
  }
});

// تعديل منطقة
app.put('/areas/:id', async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث المنطقة' });
  }
});

// حذف منطقة
app.delete('/areas/:id', async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف المنطقة' });
  }
});

// ===== ROUTES للأبناء =====
// جلب كل الأبناء
app.get('/children', async (req, res) => {
  try {
    const children = await Child.find();
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الأبناء' });
  }
});

// إضافة ابن جديد
app.post('/children', async (req, res) => {
  try {
    const child = new Child(req.body);
    await child.save();
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة الابن' });
  }
});

// تعديل ابن
app.put('/children/:id', async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الابن' });
  }
});

// حذف ابن
app.delete('/children/:id', async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الابن' });
  }
});

// حذف مجموعة من الأبناء
app.delete('/children', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'يجب توفير مصفوفة من المعرفات' });
    }
    await Child.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الأبناء' });
  }
});

// ===== ROUTES للشهداء =====
// جلب كل الشهداء
app.get('/martyrs', async (req, res) => {
  try {
    const martyrs = await Martyr.find();
    res.json(martyrs);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الشهداء' });
  }
});

// إضافة شهيد جديد
app.post('/martyrs', async (req, res) => {
  try {
    const martyr = new Martyr(req.body);
    await martyr.save();
    res.json(martyr);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة الشهيد' });
  }
});

// تعديل شهيد
app.put('/martyrs/:id', async (req, res) => {
  try {
    const martyr = await Martyr.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(martyr);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الشهيد' });
  }
});

// حذف شهيد
app.delete('/martyrs/:id', async (req, res) => {
  try {
    await Martyr.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الشهيد' });
  }
});

// حذف مجموعة من الشهداء
app.delete('/martyrs', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'يجب توفير مصفوفة من المعرفات' });
    }
    await Martyr.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الشهداء' });
  }
});

// ===== ROUTES للجرحى =====
// جلب كل الجرحى
app.get('/injured', async (req, res) => {
  try {
    const injured = await Injured.find();
    res.json(injured);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الجرحى' });
  }
});

// إضافة جريح جديد
app.post('/injured', async (req, res) => {
  try {
    const injured = new Injured(req.body);
    await injured.save();
    res.json(injured);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة الجريح' });
  }
});

// تعديل جريح
app.put('/injured/:id', async (req, res) => {
  try {
    const injured = await Injured.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(injured);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الجريح' });
  }
});

// حذف جريح
app.delete('/injured/:id', async (req, res) => {
  try {
    await Injured.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الجريح' });
  }
});

// حذف مجموعة من الجرحى
app.delete('/injured', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'يجب توفير مصفوفة من المعرفات' });
    }
    await Injured.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الجرحى' });
  }
});

// ===== ROUTES للبيانات الطبية =====
// جلب كل البيانات الطبية
app.get('/medical-data', async (req, res) => {
  try {
    const medicalData = await MedicalData.find();
    res.json(medicalData);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب البيانات الطبية' });
  }
});

// إضافة بيانات طبية جديدة
app.post('/medical-data', async (req, res) => {
  try {
    const medicalData = new MedicalData(req.body);
    await medicalData.save();
    res.json(medicalData);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة البيانات الطبية' });
  }
});

// تعديل بيانات طبية
app.put('/medical-data/:id', async (req, res) => {
  try {
    const medicalData = await MedicalData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(medicalData);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث البيانات الطبية' });
  }
});

// حذف بيانات طبية
app.delete('/medical-data/:id', async (req, res) => {
  try {
    await MedicalData.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف البيانات الطبية' });
  }
});

// ===== ROUTES للأيتام =====
// جلب كل الأيتام
app.get('/orphans', async (req, res) => {
  try {
    const orphans = await Orphan.find();
    res.json(orphans);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الأيتام' });
  }
});

// إضافة يتيم جديد
app.post('/orphans', async (req, res) => {
  try {
    const orphan = new Orphan(req.body);
    await orphan.save();
    res.json(orphan);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة اليتيم' });
  }
});

// تعديل يتيم
app.put('/orphans/:id', async (req, res) => {
  try {
    const orphan = await Orphan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(orphan);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث اليتيم' });
  }
});

// حذف يتيم
app.delete('/orphans/:id', async (req, res) => {
  try {
    await Orphan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف اليتيم' });
  }
});

// ===== ROUTES للأضرار =====
// جلب كل الأضرار
app.get('/damages', async (req, res) => {
  try {
    const damages = await Damage.find();
    res.json(damages);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الأضرار' });
  }
});

// إضافة ضرر جديد
app.post('/damages', async (req, res) => {
  try {
    const damage = new Damage(req.body);
    await damage.save();
    res.json(damage);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة الضرر' });
  }
});

// تعديل ضرر
app.put('/damages/:id', async (req, res) => {
  try {
    const damage = await Damage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(damage);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الضرر' });
  }
});

// حذف ضرر
app.delete('/damages/:id', async (req, res) => {
  try {
    await Damage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الضرر' });
  }
});

// ===== ROUTES لطلبات التسجيل =====
// جلب كل طلبات التسجيل
app.get('/registration-requests', async (req, res) => {
  try {
    const requests = await RegistrationRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلبات التسجيل' });
  }
});

// إضافة طلب تسجيل جديد
app.post('/registration-requests', async (req, res) => {
  try {
    const request = new RegistrationRequest(req.body);
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إضافة طلب التسجيل' });
  }
});

// تعديل طلب تسجيل
app.put('/registration-requests/:id', async (req, res) => {
  try {
    const request = await RegistrationRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث طلب التسجيل' });
  }
});

// حذف طلب تسجيل
app.delete('/registration-requests/:id', async (req, res) => {
  try {
    await RegistrationRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف طلب التسجيل' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)); 