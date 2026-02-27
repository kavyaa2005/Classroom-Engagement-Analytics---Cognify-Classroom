require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Find all students — fetch with raw password field
  const students = await User.find({ role: 'student' }).select('+password');
  let fixed = 0;

  for (const s of students) {
    // Unconditionally re-hash to correct value — bypasses Mongoose pre-save hook
    const fresh = await bcrypt.hash('student123', 12);
    await User.collection.updateOne({ _id: s._id }, { $set: { password: fresh } });
    fixed++;
    console.log('Fixed:', s.email);
  }

  console.log(`\nDone. Fixed ${fixed} student password(s).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
