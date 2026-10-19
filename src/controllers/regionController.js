// src/controllers/regionController.js
import { getRegionesConPlantas, getRegionesPorPlanta } from '../services/regionService.js';

export const obtenerRegiones = async (req, res) => {
  try {
    const regiones = await getRegionesConPlantas();
    res.status(200).json(regiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerRegionesPorPlanta = async (req, res) => {
  try {
    const { planta } = req.query; // Recibe el nombre de la planta por query string (?planta=...)
    
    if (!planta) {
      return res.status(400).json({ success: false, error: "El nombre de la planta es requerido." });
    }

    const regiones = await getRegionesPorPlanta(planta);
    return res.status(200).json({ success: true, data: regiones });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};