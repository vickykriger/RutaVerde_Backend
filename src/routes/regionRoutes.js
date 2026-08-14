// src/routes/regionRoutes.js
import { Router } from 'express';
import { obtenerRegiones, getRegiones } from '../controllers/regionController.js';

const router = Router();

router.get('/regiones', obtenerRegiones);
router.get('/regiones', getRegiones);

export default router;