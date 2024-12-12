import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    clockIn: {
      type: Date,
      required: true,
    },
    clockOut: {
      type: Date,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Timesheet = mongoose.model('Timesheet', timesheetSchema);
export default Timesheet;
