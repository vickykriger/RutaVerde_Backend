// src/routes/regionRoutes.js
import { Router } from 'express';
import { obtenerRegiones } from '../controllers/regionController.js';

const router = Router();

router.get('/regiones', obtenerRegiones);

export default router;