import * as noticiasService from '../services/noticiasService.js';

export async function crearNoticia (req, res) {
  try {
    const { titulo, subtitulo, cuerpo } = req.body;
    
    // Obtenemos id_usuario del token de autenticación (si usas authMiddleware) o del body
    const id_usuario = req.usuario?.id || req.body.id_usuario;

    if (!titulo || !cuerpo || !id_usuario) {
      return res.status(400).json({ 
        error: 'El título, el cuerpo de la noticia y el id_usuario son obligatorios.' 
      });
    }

    const nuevaNoticia = await noticiasService.crearNoticia({
      titulo,
      subtitulo,
      cuerpo,
      id_usuario,
      file: req.file // El middleware de Multer inyecta req.file si se envió imagen
    });

    return res.status(201).json({
      mensaje: 'Noticia publicada con éxito',
      noticia: nuevaNoticia
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export async function obtenerNoticias (req, res){
  try {
    const noticias = await noticiasService.obtenerNoticias();
    return res.json(noticias);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};