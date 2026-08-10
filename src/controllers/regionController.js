// src/controllers/regionController.js
import { getRegionesConPlantas } from '../services/regionService.js';

export const obtenerRegiones = async (req, res) => {
  try {
    const regiones = await getRegionesConPlantas();
    res.status(200).json(regiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};