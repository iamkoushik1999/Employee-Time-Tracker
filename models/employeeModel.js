import mongoose from 'mongoose';
import {
  comparePassword,
  generateResetToken,
  hashPassword,
} from '../helpers/passwordHelper.js';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'employee',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash Password
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Match Password
employeeSchema.method('comparePassword', async function (enteredPassword) {
  return await comparePassword(enteredPassword, this.password);
});

// Reset Password Token
employeeSchema.methods.getResetToken = function () {
  const { resetToken, hashedToken, expireTime } = generateResetToken();
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = expireTime;
  return resetToken;
};

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
