// src/services/noticiaService.js
import { supabase } from '../config/supabase.js';

export async function crearNoticia(titulo, contenido, archivoFoto) {
    try {
        if (!titulo || !contenido) {
            return { success: false, error: "El título y el contenido son obligatorios." };
        }

        let urlImagen = null;

        if (archivoFoto) {
            const nombreArchivo = `${Date.now()}_${archivoFoto.originalname}`;
            const { data: storageData, error: storageError } = await supabase.storage
                .from('imagenes_noticias')
                .upload(nombreArchivo, archivoFoto.buffer, {
                    contentType: archivoFoto.mimetype,
                    upsert: false
                });

            if (storageError) {
                return { success: false, error: `Error al subir imagen: ${storageError.message}` };
            }

            const { data: urlData } = supabase.storage
                .from('imagenes_noticias')
                .getPublicUrl(nombreArchivo);

            urlImagen = urlData?.publicUrl;
        }

        // Insertar mapeando a las columnas reales de la tabla Noticias
        const { data, error } = await supabase
            .from('Noticias')
            .insert([
                {
                    titulo: titulo,
                    cuerpo: contenido,      // Mapea la variable 'contenido' a la columna 'cuerpo'
                    url_foto: urlImagen    // Mapea 'urlImagen' a la columna 'url_foto'
                }
            ])
            .select();

        if (error) {
            return { success: false, error: `Error en BD: ${error.message}` };
        }

        return { success: true, data: data[0] };

    } catch (error) {
        return { success: false, error: error.message };
    }
}