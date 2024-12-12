import mongoose from 'mongoose';

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

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
