import * as baldosaService from '../services/baldosaService.js';



export async function listarTodasLasBaldosas(req, res) {
    const resu = await baldosaService.obtenerTodasLasBaldosas();
    return res.status(resu.success ? 200 : 400).json(resu);
}
export async function listarBaldosasAprobadas(req, res) {
    const resu = await baldosaService.obtenerBaldosasAprobadas();
    return res.status(resu.success ? 200 : 400).json(resu);
}
export async function cambiarEstado(req, res) {
    const { id } = req.params;
    const { aprobada } = req.body; // true o false
    const resu = await baldosaService.actualizarEstadoBaldosa(id, aprobada);
    return res.status(resu.success ? 200 : 400).json(resu);
}
export async function crearBaldosa(req, res) {
    console.log("--- 📥 BODY RECIBIDO EN BALDOSA ---", req.body);
    console.log("--- 📁 ARCHIVO RECIBIDO ---", req.file ? req.file.originalname : 'SIN ARCHIVO');
    try {
        const { nombrePlanta, idRegion, tamanio, comentarios } = req.body;
        const archivoImagen = req.file;

        if (!nombrePlanta || !nombrePlanta.trim()) {
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

        const resultado = await baldosaService.subirBaldosa(
            nombrePlanta.trim(),
            parseInt(idRegion),
            tamanioNumero,
            comentarios ? comentarios.trim() : null,
            archivoImagen
        );

        console.log("--- 📤 RESULTADO SERVICE ---", resultado);
        
        if (resultado.success) {
            return res.status(201).json(resultado);
        } else {
            return res.status(400).json(resultado);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

