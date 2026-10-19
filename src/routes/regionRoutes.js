// src/routes/regionRoutes.js
import { Router } from 'express';
import { obtenerRegiones, obtenerRegionesPorPlanta } from '../controllers/regionController.js';

const router = Router();

router.get('/regiones/ecorregiones', obtenerRegiones);
router.get('/regiones/por-planta', obtenerRegionesPorPlanta);
export default router;