import { getRegionesConPlantas, getRegionesPorPlanta } from '../services/regionService.js';

// Controller para obtener todas las ecorregiones (usado por el Mapa y la Lista)
export const obtenerRegiones = async (req, res) => {
  try {
    const ecorregiones = await getRegionesConPlantas();
    return res.status(200).json({
      success: true,
      data: ecorregiones
    });
  } catch (error) {
    console.error('Error en obtenerRegiones:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener las ecorregiones: ' + error.message
    });
  }
};

// Controller para filtrar ecorregiones por el nombre de la planta (usado en SubirBaldosa)
export const obtenerRegionesPorPlanta = async (req, res) => {
  try {
    // Soporta recibir la planta como query param ?planta=Ceibo o ?nombrePlanta=Ceibo
    const nombrePlanta = req.query.planta || req.query.nombrePlanta || '';

    if (!nombrePlanta) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const regiones = await getRegionesPorPlanta(nombrePlanta);
    return res.status(200).json({
      success: true,
      data: regiones
    });
  } catch (error) {
    console.error('Error en obtenerRegionesPorPlanta:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener ecorregiones por planta: ' + error.message
    });
  }
};