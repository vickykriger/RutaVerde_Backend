import * as baldosaService from '../services/baldosaService.js';

export async function crearBaldosa(req, res) {
    try {
        // Capturamos el campo sin importar si el frontend envía 'idPlanta', 'nombrePlanta' o 'planta'
        const plantaEntrada = req.body.idPlanta || req.body.nombrePlanta || req.body.planta;
        const { idRegion, tamanio, comentarios } = req.body;
        const archivoImagen = req.file;

        // Validamos que venga algún valor en el campo de la planta
        if (!plantaEntrada || (typeof plantaEntrada === 'string' && !plantaEntrada.trim())) {
            return res.status(400).json({ success: false, error: "El nombre de la planta es obligatorio." });
        }

        if (!idRegion || isNaN(parseInt(idRegion))) {
            return res.status(400).json({ success: false, error: "La región es obligatoria." });
        }

        if (!archivoImagen) {
            return res.status(400).json({ success: false, error: "La imagen es obligatoria." });
        }

        const tamanioNumero = Number(tamanio);
        if (!tamanio || isNaN(tamanioNumero) || tamanioNumero < 1 || tamanioNumero > 500) {
            return res.status(400).json({ success: false, error: "El tamaño debe ser entre 1 y 500." });
        }

        // Le pasamos plantaEntrada al servicio (que ya sabe resolver si es un ID o un nombre)
        const resultado = await baldosaService.subirBaldosa(
            typeof plantaEntrada === 'string' ? plantaEntrada.trim() : plantaEntrada,
            parseInt(idRegion),
            tamanioNumero,
            comentarios ? comentarios.trim() : null,
            archivoImagen,
            req.usuarioId || null // opcional por si agregas autenticación después
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