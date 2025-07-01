const mongoose = require('mongoose');

// نموذج المستخدمين
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'representative', 'observer'], default: 'observer' },
  name: { type: String, required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  createdAt: { type: Date, default: Date.now }
});

// نموذج المناطق
const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  representativeName: { type: String, required: true },
  representativeId: { type: String, required: true },
  representativePhone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج أولياء الأمور
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
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الزوجات
const WifeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  husbandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', required: true },
  husbandNationalId: { type: String, required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الأبناء
const ChildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true },
  guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج المساعدات
const AidSchema = new mongoose.Schema({
  guardianNationalId: { type: String, required: true },
  guardianName: String,
  guardianPhone: String,
  aidType: { type: String, required: true },
  aidDate: { type: Date, required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الشهداء
const MartyrSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  martyrdomDate: { type: Date, required: true },
  agentName: { type: String, required: true },
  agentNationalId: { type: String, required: true },
  agentPhone: { type: String, required: true },
  relationshipToMartyr: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الجرحى
const InjuredSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  injuryDate: { type: Date, required: true },
  injuryType: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج البيانات الطبية
const MedicalDataSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientNationalId: { type: String, required: true, unique: true },
  guardianNationalId: { type: String, required: true },
  guardianName: String,
  diseaseType: { type: String, required: true },
  phone: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الأيتام
const OrphanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true },
  healthStatus: { type: String, required: true },
  educationalStage: { type: String, required: true },
  martyrNationalId: { type: String, required: true },
  martyrName: { type: String, required: true },
  martyrdomDate: { type: Date, required: true },
  maleSiblingsCount: { type: Number, default: 0 },
  femaleSiblingsCount: { type: Number, default: 0 },
  guardianName: { type: String, required: true },
  guardianRelationship: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج الأضرار
const DamageSchema = new mongoose.Schema({
  guardianNationalId: { type: String, required: true },
  guardianName: String,
  guardianPhone: String,
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  damageType: { type: String, enum: ['كلي', 'جزئي'], required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// نموذج طلبات التسجيل
const RegistrationRequestSchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  // بيانات ولي الأمر
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  maritalStatus: { type: String, required: true },
  currentJob: String,
  residenceStatus: { type: String, enum: ['resident', 'displaced'], required: true },
  originalGovernorate: String,
  originalCity: String,
  displacementAddress: String,
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  // بيانات الزوجات والأبناء
  wives: [{
    name: { type: String, required: true },
    nationalId: { type: String, required: true }
  }],
  children: [{
    name: { type: String, required: true },
    nationalId: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true }
  }],
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: String
});

// إنشاء النماذج
const User = mongoose.model('User', UserSchema);
const Area = mongoose.model('Area', AreaSchema);
const Guardian = mongoose.model('Guardian', GuardianSchema);
const Wife = mongoose.model('Wife', WifeSchema);
const Child = mongoose.model('Child', ChildSchema);
const Aid = mongoose.model('Aid', AidSchema);
const Martyr = mongoose.model('Martyr', MartyrSchema);
const Injured = mongoose.model('Injured', InjuredSchema);
const MedicalData = mongoose.model('MedicalData', MedicalDataSchema);
const Orphan = mongoose.model('Orphan', OrphanSchema);
const Damage = mongoose.model('Damage', DamageSchema);
const RegistrationRequest = mongoose.model('RegistrationRequest', RegistrationRequestSchema);

module.exports = {
  User,
  Area,
  Guardian,
  Wife,
  Child,
  Aid,
  Martyr,
  Injured,
  MedicalData,
  Orphan,
  Damage,
  RegistrationRequest
}; 