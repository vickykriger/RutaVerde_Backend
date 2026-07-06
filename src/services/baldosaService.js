import { supabase } from '../config/supabase.js';

/**
 * Sube la imagen al storage e inserta una nueva fila en la tabla 'Baldosa'
 */
export async function subirBaldosa(nombrePlanta, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
    try {
        // Validación de respaldo por si no llegó el archivo desde Multer
        if (!archivoImagen) {
            return { success: false, error: "La imagen es obligatoria." };
        }

        // 1. Generar un nombre único para el archivo (así evitamos colisiones de nombres)
        const nombreArchivo = `${Date.now()}_${archivoImagen.originalname}`;
        
        // ⚠️ IMPORTANTE: Poné acá el nombre del Bucket público que hayas creado en tu panel de Supabase
        const nombreBucket = 'imagenes-baldosas'; 

        // 2. Subir el archivo de la imagen al Storage de Supabase
        const { data: storageData, error: storageError } = await supabase.storage
            .from(nombreBucket)
            .upload(nombreArchivo, archivoImagen.buffer, {
                contentType: archivoImagen.mimetype,
                upsert: false
            });

        if (storageError) {
            return { success: false, error: `Error al subir imagen al Storage: ${storageError.message}` };
        }

        // 3. Obtener la URL pública de la imagen recién subida
        const { data: urlData } = supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        const urlImagen = urlData.publicUrl;

        // 4. Insertar la información en tu tabla 'Baldosa'
        // Dejamos fuera 'id_baldosa' para que actúe tu restricción autoincremental de la BD
        const { data: dbData, error: dbError } = await supabase
            .from('Baldosa')
            .insert([
                {
                    id_region: idRegion,
                    tamanio: tamanio,
                    comentarios: comentarios,
                    url_imagen: urlImagen,
                    id_usuario: idUsuario ? parseInt(idUsuario) : null, // Mapeamos la FK numérica del usuario creador
                    nombrePlanta: nombrePlanta
                }
            ])
            .select(); // Le pedimos a Supabase que nos devuelva la fila creada

        if (dbError) {
            return { success: false, error: `Error al guardar la baldosa en BD: ${dbError.message}` };
        }

        // Retornamos el objeto insertado con éxito (incluye la id_baldosa numérica generada)
        return { success: true, data: dbData[0] };

    } catch (error) {
        return { success: false, error: error.message };
    }
}