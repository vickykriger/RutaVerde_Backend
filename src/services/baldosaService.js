import { supabase } from '../config/supabase.js';

export async function subirBaldosa(plantaEntrada, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
    try {
        let nombrePlanta = plantaEntrada;

        // Si lo que llega es un número/ID o una cadena numérica (como '24'), buscamos su nombre en la BD
        if (plantaEntrada && !isNaN(Number(plantaEntrada))) {
            const { data: plantaEncontrada, error: errorBusqueda } = await supabase
                .from('Plantas_Nativas')
                .select('nombre')
                .eq('id_planta', parseInt(plantaEntrada)) // Ajusta 'id_planta' si tu columna tiene otro nombre
                .maybeSingle();

            if (errorBusqueda) {
                return { success: false, error: `Error buscando la planta por ID: ${errorBusqueda.message}` };
            }

            if (plantaEncontrada) {
                nombrePlanta = plantaEncontrada.nombre;
            }
        }

        // 1. Validaciones básicas iniciales
        if (!nombrePlanta) {
            return { success: false, error: "El nombre de la planta es obligatorio." };
        }
        if (!archivoImagen) {
            return { success: false, error: "La imagen es obligatoria." };
        }

        // 2. COMPARACIÓN CON LA TABLA Plantas_Nativas
        const { data: plantaValida, error: errorValidacion } = await supabase
            .from('Plantas_Nativas')
            .select('nombre')
            .ilike('nombre', nombrePlanta.trim())
            .maybeSingle();

        if (errorValidacion) {
            return { success: false, error: `Error al validar la planta nativa: ${errorValidacion.message}` };
        }

        // 3. Rechazo si no existe en el listado
        if (!plantaValida) {
            return { 
                success: false, 
                error: `No se pudo registrar. La planta "${nombrePlanta}" no existe en nuestro listado de plantas nativas.` 
            };
        }

        // 4. Subida de imagen al storage
        const nombreArchivo = `${Date.now()}_${archivoImagen.originalname}`;
        const nombreBucket = 'imagenes_baldosas';

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
        const { data: urlData, error: urlError } = await supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        if (urlError) {
            return { success: false, error: `Error obteniendo la URL pública: ${urlError.message}` };
        }

        const urlImagen = urlData?.publicUrl;
        if (!urlImagen) {
            return { success: false, error: 'No se pudo obtener la URL pública de la imagen.' };
        }

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