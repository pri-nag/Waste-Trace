const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['generator', 'recycler'], required: true },
  walletBalance: { type: Number, default: 0 },
  totalCreditsEarned: { type: Number, default: 0 },
  totalWasteSent: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  segregationScores: [{ type: Number }],
  avatar: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('segregationGrade').get(function () {
  if (!this.segregationScores || !this.segregationScores.length) return 'N/A';
  const avg = this.segregationScores.reduce((a, b) => a + b, 0) / this.segregationScores.length;
  if (avg > 0.9) return 'A';
  if (avg >= 0.7) return 'B';
  return 'C';
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
