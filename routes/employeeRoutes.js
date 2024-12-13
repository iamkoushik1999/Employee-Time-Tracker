import { Router } from 'express';
const router = Router();
// Controllers
import {
  register,
  login,
  listEmployees,
} from '../controllers/employeeController.js';

// ---------------------------------------------------------------

// POST
router.post('/register', register);

// POST
router.post('/login', login);

// GETs
router.get('/', listEmployees);

export default router;
