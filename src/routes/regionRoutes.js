// src/routes/regionRoutes.js
import { Router } from 'express';
import { obtenerRegiones, obtenerRegionesPorPlanta } from '../controllers/regionController.js';

const router = Router();

// 1. Ruta que usa el mapa para cargar GeoJSON y la lista (Mantiene ambas URLs por compatibilidad)
router.get('/ecorregiones', obtenerRegiones);
router.get('/regiones/ecorregiones', obtenerRegiones);

// 2. Ruta para filtrar ecorregiones por planta en Subir Baldosa
router.get('/por-planta', obtenerRegionesPorPlanta);
router.get('/regiones/por-planta', obtenerRegionesPorPlanta);

export default router;