// Packages
import asyncHandler from 'express-async-handler';
// Models
import adminModel from '../models/adminModel.js';
import employeeModel from '../models/employeeModel.js';
// Helper
import { verifyToken } from '../helpers/authHelper.js';

// --------------------------------------------------------------------------

// User Auth
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(' ')[1];

      //verify the token
      const decoded = verifyToken(token);

      if (decoded.role !== 'admin' && decoded.role !== 'employee') {
        res.status(401);
        throw new Error('Not authorized, No Role');
      }

      if (decoded.role === 'admin') {
        //get user from token
        req.user = await adminModel.findOne({ _id: decoded.id });
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized');
        }
        next();
      }
      if (decoded.role === 'employee') {
        //get user from token
        req.user = await employeeModel.findOne({ _id: decoded.id });
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized');
        }
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, No Token');
  }
});

// Authorization
export const authorizeUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    res.status(403);
    throw new Error(`${req.user.role} is not allowed to access this resource`);
  }
  next();
};

// Admin or Not
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error(`${req.user.role} is not allowed to access this resource`);
  }
  next();
};
