// Packages
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Models
import employeeModel from '../models/employeeModel.js';

// ---------------------------------------------------------------

// Register a new employee
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await employeeModel.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: 'Employee registered successfully',
    employee,
  });
});

// Employee login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const employee = await employeeModel.findOne({ email });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.SECRET_KEY,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
  });
});

// List all employees
export const listEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeModel.find({}, { name: 1, email: 1 });
  const totalEmployees = employeeModel.countDocuments();

  res.status(200).json({
    data: employees,
    total: totalEmployees,
  });
});
