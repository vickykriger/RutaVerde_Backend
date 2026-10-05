import { supabase } from '../config/supabase.js';

export async function crearNoticia(titulo, cuerpo, subtitulo, archivoImagen, idUsuario) {
    try {
        // 1. Validaciones básicas
        if (!titulo || !titulo.trim()) {
            return { success: false, error: 'El título es obligatorio.' };
        }
        if (!cuerpo || !cuerpo.trim()) {
            return { success: false, error: 'El contenido es obligatorio.' };
        }
        if (!archivoImagen) {
            return { success: false, error: 'La foto de portada es obligatoria.' };
        }

        // 2. Subir imagen a Supabase Storage
        const extension = archivoImagen.originalname.split('.').pop();
        const nombreArchivo = `noticia_${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`;

        // Subir directamente al bucket 'noticias' usando solo el nombre del archivo
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('Noticias')
            .upload(nombreArchivo, archivoImagen.buffer, {
                contentType: archivoImagen.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('❌ Error al subir imagen a Storage:', uploadError);
            return { success: false, error: `Error subiendo la imagen: ${uploadError.message}` };
        }

        // Obtener la URL pública de la imagen
        const { data: publicUrlData } = supabase
            .storage
            .from('noticias')
            .getPublicUrl(nombreArchivo);

        const urlFoto = publicUrlData.publicUrl;

        // 3. Insertar la noticia en la base de datos
        const { data: nuevaNoticia, error: dbError } = await supabase
            .from('Noticias')
            .insert([
                {
                    titulo: titulo.trim(),
                    subtitulo: subtitulo ? subtitulo.trim() : null,
                    cuerpo: cuerpo.trim(),
                    url_foto: urlFoto,
                    id_usuario: idUsuario ? parseInt(idUsuario) : null,
                    fecha_publicacion: new Date().toISOString()
                }
            ])
            .select();

        if (dbError) {
            console.error('❌ Error al insertar en la tabla Noticias:', dbError);
            return { success: false, error: `Error al guardar la noticia: ${dbError.message}` };
        }

        return { 
            success: true, 
            message: 'Noticia creada con éxito.', 
            data: nuevaNoticia && nuevaNoticia.length > 0 ? nuevaNoticia[0] : null 
        };

    } catch (error) {
        console.error('❌ Error inesperado en crearNoticia:', error);
        return { success: false, error: error.message };
    }
}