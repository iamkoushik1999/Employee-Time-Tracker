import { Router } from 'express';
const router = Router();
// Controllers
import {
  register,
  login,
  listEmployees,
} from '../controllers/employeeController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

// ---------------------------------------------------------------

// POST
router.post('/register', register);

// POST
router.post('/login', login);

// GETs
router.get('/', isAuthenticated, listEmployees);

export default router;
