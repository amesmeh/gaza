import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// الاتصال بقاعدة البيانات (محليًا)
mongoose.connect('mongodb://localhost:27017/aid-system', { useNewUrlParser: true, useUnifiedTopology: true });

// تعريف نموذج المساعدة
const AidSchema = new mongoose.Schema({
  guardianNationalId: String,
  guardianName: String,
  areaName: String,
  guardianPhone: String,
  aidType: String,
  aidDate: String
});
const Aid = mongoose.model('Aid', AidSchema);

// تعريف نموذج ولي الأمر
const GuardianSchema = new mongoose.Schema({
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
const Guardian = mongoose.model('Guardian', GuardianSchema);

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

app.listen(4000, () => console.log('API running on http://localhost:4000')); 