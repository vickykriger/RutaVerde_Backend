import { Router } from 'express';
import { obtenerRegiones, obtenerRegionesPorPlanta } from '../controllers/regionController.js';

const router = Router();

// Endpoint para obtener las regiones registradas en la BD Supabase
router.get('/regiones-db', obtenerRegiones);

// Endpoint para filtrar por planta
router.get('/regiones/por-planta', obtenerRegionesPorPlanta);

export default router;