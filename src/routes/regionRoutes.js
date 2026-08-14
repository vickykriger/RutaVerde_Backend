import { Router } from 'express';
import { getRegiones } from '../controllers/regionController.js';

const router = Router();

router.get('/regiones', getRegiones);

export default router;