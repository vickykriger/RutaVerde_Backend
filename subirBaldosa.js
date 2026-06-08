import { supabase } from './supabase.js';

async function subirImagenStorage(archivo) {
    const nombreArchivo = `${Date.now()}_${archivo.name}`;
    const { data, error } = await supabase.storage.from('imagenes_baldosas').upload(nombreArchivo, archivo);
    if (error) throw new Error('No se pudo subir la imagen.');
    const { data: urlData } = supabase.storage.from('imagenes_baldosas').getPublicUrl(nombreArchivo);
    return urlData.publicUrl;
}

 async function subirBaldosa(nombrePlanta, idRegion, tamanio, comentarios, archivoImagen) {
    try {
        let urlImagenFinal = null;
        if (archivoImagen) {
            urlImagenFinal = await subirImagenStorage(archivoImagen);
        }

        const { data, error } = await supabase
            .from('Baldosa')
            .insert([{
                nombrePlanta: nombrePlanta,
                id_region: idRegion,
                tamanio: tamanio,
                comentarios: comentarios,
                url_imagen: urlImagenFinal
            }])
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: data };
    } catch (err) {
        return { success: false, error: err.message };
    }

}

export{subirBaldosa};
