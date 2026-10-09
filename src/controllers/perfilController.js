import { supabase } from '../config/supabase.js';

export async function actualizarNombre(req, res) {
  try {
    const { id_usuario, nombre } = req.body;

    if (!id_usuario || !nombre) {
      return res.status(400).json({ error: 'El id_usuario y el nombre son obligatorios.' });
    }

    const { data, error } = await supabase
      .from('Usuarios')
      .update({ nombreC: nombre })
      .eq('id_usuario', Number(id_usuario))
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ nombre: data.nombreC });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function actualizarFoto(req, res) {
  try {
    // Inspeccionamos qué está recibiendo Node.js
    console.log('req.body recibido:', req.body);
    console.log('req.file recibido:', req.file);

    const id_usuario = req.body?.id_usuario;
    const archivoFoto = req.file;

    if (!id_usuario || !archivoFoto) {
      return res.status(400).json({ 
        error: 'El id_usuario y la foto son obligatorios.' 
      });
    }

    // 1. Subir la foto a Supabase Storage
    const fileName = `avatars/${id_usuario}_${Date.now()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, archivoFoto.buffer, { contentType: archivoFoto.mimetype });

    if (uploadError) throw uploadError;

    // 2. Obtener URL pública de la imagen
    const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(fileName);
    const fotoUrl = urlData.publicUrl;

    // 3. Guardar la URL en la columna fotoPerfil de la tabla Usuarios
    const { data, error } = await supabase
      .from('Usuarios')
      .update({ fotoPerfil: fotoUrl })
      .eq('id_usuario', Number(id_usuario))
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ fotoPerfil: data.fotoPerfil });
  } catch (error) {
    console.error('Error en actualizarFoto:', error);
    return res.status(500).json({ error: error.message });
  }
}