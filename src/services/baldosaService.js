import { supabase } from '../config/supabase.js';

export async function obtenerTodasLasBaldosas() {
    try {
        const { data, error } = await supabase
            .from('Baldosa')
            .select(`
                id_baldosa,
                tamanio,
                comentarios,
                url_imagen,
                nombrePlanta,
                id_region,
                aprobada,
                Usuarios ( nombreC, email )
            `)
            .order('id_baldosa', { ascending: false });

        if (error) return { success: false, error: error.message };

        // Mapeo de campos de BD -> Frontend
       const aportesFormateados = data.map(b => {
    let estadoTexto = 'pendiente';
    
    if (b.aprobada === true) {
        estadoTexto = 'aprobado';
    } else if (b.aprobada === false) {
        // Cambia esto según tu convención: 
        // Si 'false' significa 'pendiente de aprobación', asigna 'pendiente'
        estadoTexto = 'pendiente'; 
    }

    return {
        id: b.id_baldosa,
        id_baldosa: b.id_baldosa,
        planta: b.nombrePlanta || 'Sin nombre',
        nombrePlanta: b.nombrePlanta,
        foto: b.url_imagen,
        url_imagen: b.url_imagen,
        tamanio: b.tamanio,
        comentarios: b.comentarios,
        estado: estadoTexto,
        aprobada: b.aprobada,
        usuario: b.Usuarios?.nombreC || 'Anónimo',
        emailUsuario: b.Usuarios?.email || ''
    };
});
        return { success: true, data: aportesFormateados };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// --- Obtener solo baldosas APROBADAS (Para el Mapa y Vista Pública) ---
export async function obtenerBaldosasAprobadas() {
    try {
        const { data, error } = await supabase
            .from('Baldosa')
            .select(`
                id_baldosa,
                tamanio,
                comentarios,
                url_imagen,
                nombrePlanta,
                id_region,
                aprobada,
                Usuarios ( nombreC, email )
            `)
            .eq('aprobada', true);

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// --- Obtener baldosas PENDIENTES (Para el Backoffice) ---
export async function obtenerBaldosasPendientes() {
    try {
        const { data, error } = await supabase
            .from('Baldosa')
            .select(`
                id_baldosa,
                tamanio,
                comentarios,
                url_imagen,
                nombrePlanta,
                id_region,
                aprobada,
                Usuarios ( nombreC, email )
            `)
            .or('aprobada.is.null,aprobada.eq.false')
            .order('id_baldosa', { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// --- Aprobar o Rechazar una Baldosa (Desde Backoffice) ---
export async function actualizarEstadoBaldosa(idBaldosa, aprobada) {
    try {
        const { data, error } = await supabase
            .from('Baldosa')
            .update({ aprobada: aprobada })
            .eq('id_baldosa', idBaldosa)
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// --- Subida de Baldosas corregida ---
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
        const { data: plantaValida, error: errorValidacion } = await supabase
            .from('Plantas_Nativas')
            .select('nombre')
            .ilike('nombre', nombrePlanta.trim())
            .limit(1);

        if (errorValidacion) {
            return { success: false, error: `Error al validar la planta nativa: ${errorValidacion.message}` };
        }

        // CORRECCIÓN: Se comprueba la longitud del array (.length === 0)
        if (!plantaValida || plantaValida.length === 0) {
            return {
                success: false,
                error: `No se pudo registrar. La planta "${nombrePlanta}" no existe en nuestro listado de plantas nativas.`
            };
        }

        // 3. Subida de imagen al storage (se limpian caracteres especiales del nombre)
        const nombreLimpio = archivoImagen.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const nombreArchivo = `${Date.now()}_${nombreLimpio}`;
        const nombreBucket = 'imagenes_baldosas';

        const { error: storageError } = await supabase.storage
            .from(nombreBucket)
            .upload(nombreArchivo, archivoImagen.buffer, {
                contentType: archivoImagen.mimetype,
                upsert: false
            });

        if (storageError) {
            return { success: false, error: `Error al subir imagen al Storage: ${storageError.message}` };
        }

        // 4. Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(nombreBucket)
            .getPublicUrl(nombreArchivo);

        const urlImagen = urlData?.publicUrl;
        if (!urlImagen) {
            return { success: false, error: 'No se pudo obtener la URL pública de la imagen.' };
        }

        // 5. Guardar baldosa en la BD con estado 'aprobada: false' por defecto
        const { data: dbData, error: dbError } = await supabase
            .from('Baldosa')
            .insert([
                {
                    id_region: parseInt(idRegion),
                    tamanio: Number(tamanio),
                    comentarios: comentarios ? comentarios.trim() : null,
                    url_imagen: urlImagen,
                    id_usuario: idUsuario ? parseInt(idUsuario) : null,
                    nombrePlanta: nombrePlanta.trim(), // <-- SI EN SUPABASE SE LLAMA 'nombre_planta', CAMBIALO A: nombre_planta: nombrePlanta.trim()
                    aprobada: false
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