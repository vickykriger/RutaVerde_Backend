import * as baldosaService from '../services/baldosaService.js';

export async function crearBaldosa(req, res) {
    try {
        const { nombrePlanta, idRegion, tamanio, comentarios } = req.body;
        const archivoImagen = req.file;

        if (!tamanio || isNaN(tamanio) || tamanio < 10 || tamanio > 100) { 
            return res.status(400).json({ success: false, error: "El tamaño debe ser entre 10 y 100." });
        }

        const resultado = await baldosaService.subirBaldosa(
            nombrePlanta, 
            parseInt(idRegion), 
            parseInt(tamanio), 
            comentarios, 
            archivoImagen
        );
        
        if (resultado.success) {
            return res.status(201).json(resultado);
        } else {
            return res.status(400).json(resultado);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}