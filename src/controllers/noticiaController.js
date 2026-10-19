import * as noticiaService from '../services/noticiaService.js';

export async function publicarNoticia(req, res) {
    try {
        const { titulo, contenido } = req.body;
        const archivoFoto = req.file;

        const resultado = await noticiaService.crearNoticia(titulo, contenido, archivoFoto);

        if (resultado.success) {
            return res.status(201).json(resultado);
        } else {
            return res.status(400).json(resultado);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}