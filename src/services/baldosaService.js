import {supabase} from '../config/supabase.js';
export async function subirBaldosa(plantaEntrada, idRegion, tamanio, comentarios, archivoImagen, idUsuario) {
    try {
        if (!plantaEntrada) {
            return { success: false, error: "La planta es obligatoria." };
        }
        if (!archivoImagen) {
            return { success: false, error: "La imagen es obligatoria." };
        }

        // 1. UNA SOLA BÚSQUEDA: Buscar por ID si es número, o por Nombre si es texto
        let query = supabase.from('Plantas_Nativas').select('nombre');

        if (!isNaN(Number(plantaEntrada))) {
            query = query.eq('id_planta', parseInt(plantaEntrada));
        } else {
            query = query.ilike('nombre', plantaEntrada.trim());
        }

        const { data: plantaValida, error: errorBusqueda } = await query.maybeSingle();

        if (errorBusqueda) {
            return { success: false, error: `Error buscando la planta: ${errorBusqueda.message}` };
        }

        if (!plantaValida) {
            return { 
                success: false, 
                error: `No se pudo registrar. La planta "${plantaEntrada}" no existe en el listado.` 
            };
        }

        const nombrePlanta = plantaValida.nombre;

        // 2. Subida de imagen al Storage
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
        const { data: urlData } = supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        const urlImagen = urlData?.publicUrl;
        if (!urlImagen) {
            return { success: false, error: 'No se pudo obtener la URL pública de la imagen.' };
        }

        // 3. Guardar baldosa en la BD
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