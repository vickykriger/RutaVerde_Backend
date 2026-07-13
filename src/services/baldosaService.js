import { supabase } from '../config/supabase.js';

export async function subirBaldosa(nombrePlanta, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
    try {
        // 1. Validaciones básicas iniciales
        if (!nombrePlanta) {
            return { success: false, error: "El nombre de la planta es obligatorio." };
        }
        if (!archivoImagen) {
            return { success: false, error: "La imagen es obligatoria." };
        }

        // 2. COMPARACIÓN CON LA TABLA Plantas_Nativas
        // Buscamos si existe alguna planta nativa con ese nombre (sin importar mayúsculas/minúsculas)
        const { data: plantaValida, error: errorValidacion } = await supabase
            .from('Plantas_Nativas')
            .select('nombre') // Asegúrate de que tu columna se llame 'nombre' en Supabase
            .ilike('nombre', nombrePlanta.trim())
            .maybeSingle(); // Devuelve el registro si lo encuentra, o null si no existe

        if (errorValidacion) {
            return { success: false, error: `Error al validar la planta nativa: ${errorValidacion.message}` };
        }

        // 3. Si NO existe en la base de datos, rechazamos la subida inmediatamente
        if (!plantaValida) {
            return { 
                success: false, 
                error: `No se pudo registrar. La planta "${nombrePlanta}" no existe en nuestro listado de plantas nativas.` 
            };
        }

        // 4. Si existe, ¡genial! El flujo continúa con normalidad...
        const nombreArchivo = `${Date.now()}_${archivoImagen.originalname}`;
        const nombreBucket = 'imagenes-baldosas'; 

        // Subida de imagen al storage
        const { data: storageData, error: storageError } = await supabase.storage
            .from(nombreBucket)
            .upload(nombreArchivo, archivoImagen.buffer, {
                contentType: archivoImagen.mimetype,
                upsert: false
            });

        if (storageError) {
            return { success: false, error: `Error al subir imagen al Storage: ${storageError.message}` };
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        const urlImagen = urlData.publicUrl;

        // Guardar baldosa en la BD
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