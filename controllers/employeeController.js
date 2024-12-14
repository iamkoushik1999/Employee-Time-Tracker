// Packages
import asyncHandler from 'express-async-handler';
// Models
import employeeModel from '../models/employeeModel.js';
// Helper
import {
  generateAccessToken,
  generateRefreshToken,
} from '../helpers/authHelper.js';

// ---------------------------------------------------------------

// Register a new employee
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Required fields are missing(name, email, password)');
  }
  const employeeData = await employeeModel.findOne({ email });
  if (employeeData) {
    res.status(400);
    throw new Error('Employee already exists');
  }

  await employeeModel.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    message: 'Employee registered successfully',
    success: true,
  });
});

// Employee login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Required fields are missing(email, password)');
  }
  const employeeData = await employeeModel.findOne({ email });
  if (!employeeData) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const { password: pass, ...employee } = employeeData._doc;

  const checkPassword = await employeeData.comparePassword(password);
  if (!checkPassword) {
    res.status(400);
    throw new Error('Invalid employee credential');
  }

  const accessToken = generateAccessToken(employee, 'employee');
  const refreshToken = generateRefreshToken(employee, 'employee');

  res.status(200).json({
    message: 'Login successful',
    success: true,
    accessToken,
    refreshToken,
  });
});

// List all employees
export const listEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeModel
    .find()
    .select('name email role createdAt');

  const totalEmployees = await employeeModel.countDocuments();

  res.status(200).json({
    data: employees,
    total: totalEmployees,
  });
});
