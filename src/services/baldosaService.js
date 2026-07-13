import { supabase } from '../config/supabase.js';

export async function subirBaldosa(nombrePlanta, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
    try {
        if (!archivoImagen) {
            return { success: false, error: "La imagen es obligatoria." };
        }

        const nombreArchivo = `${Date.now()}_${archivoImagen.originalname}`;
        
        const nombreBucket = 'imagenes-baldosas'; 

        const { data: storageData, error: storageError } = await supabase.storage
            .from(nombreBucket)
            .upload(nombreArchivo, archivoImagen.buffer, {
                contentType: archivoImagen.mimetype,
                upsert: false
            });

        if (storageError) {
            return { success: false, error: `Error al subir imagen al Storage: ${storageError.message}` };
        }

        const { data: urlData } = supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        const urlImagen = urlData.publicUrl;

        const { data: dbData, error: dbError } = await supabase
            .from('Baldosa')
            .insert([
                {
                    id_region: idRegion,
                    tamanio: tamanio,
                    comentarios: comentarios,
                    url_imagen: urlImagen,
                    id_usuario: idUsuario ? parseInt(idUsuario) : null, 
                    nombrePlanta: nombrePlanta
                }
            ])
            .select(); 

        if (dbError) {
            return { success: false, error: `Error al guardar la baldosa en BD: ${dbError.message}` };
        }

        return { success: true, data: dbData[0] };

    } catch (error) {
        return { success: false, error: error.message };
    }
}