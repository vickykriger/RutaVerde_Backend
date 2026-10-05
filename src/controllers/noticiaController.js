import * as noticiaService from '../services/noticiaService.js';

export async function publicarNoticia(req, res) {
    try {
        const { titulo, contenido, subtitulo } = req.body;
        const archivoImagen = req.file;

        // req.usuario?.id viene de tu middleware de autenticación (si lo utilizas)
        const idUsuario = req.usuario?.id || req.body.id_usuario;

        const resultado = await noticiaService.crearNoticia(
            titulo,
            contenido,
            subtitulo,
            archivoImagen,
            idUsuario
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