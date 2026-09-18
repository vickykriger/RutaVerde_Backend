import * as baldosaService from '../services/baldosaService.js';

export async function crearBaldosa(req, res) {
    try {
        // 1. Leemos 'idPlanta' (que manda el frontend) o 'nombrePlanta' (si viniera por nombre)
        const { idPlanta, nombrePlanta, idRegion, tamanio, comentarios } = req.body;
        const archivoImagen = req.file;

        // Tomamos idPlanta o nombrePlanta
        const plantaEntrada = idPlanta || nombrePlanta;

        // 2. Validamos que haya llegado alguno
        if (!plantaEntrada || (typeof plantaEntrada === 'string' && !plantaEntrada.trim())) {
            return res.status(400).json({ success: false, error: "El nombre o ID de la planta es obligatorio." });
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

        // 3. Le pasamos 'plantaEntrada' a baldosaService (tu servicio se encarga del resto)
        const resultado = await baldosaService.subirBaldosa(
            plantaEntrada,
            parseInt(idRegion),
            tamanioNumero,
            comentarios ? comentarios.trim() : null,
            archivoImagen,
            req.usuario?.id // o el idUsuario si lo tenés en la request
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