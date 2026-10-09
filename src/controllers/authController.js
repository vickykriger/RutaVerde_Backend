import * as authService from '../services/authService.js';
import { 
  actualizarNombreUsuarioService, 
  actualizarFotoPerfilService 
} from '../services/authService.js';

export async function registrarUsuario(req, res) {
    try {
        const { nombre, email, contrasenia, region } = req.body;
        
        const resultado = await authService.registro(nombre, email, contrasenia, region);
        
        if (resultado.success) {
            // 201 es el estado HTTP correcto para la creación exitosa de un recurso
            return res.status(201).json(resultado);
        } else {
            // Devuelve 400 con el mensaje de error de la validación
            return res.status(400).json(resultado); 
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function loginUsuario(req, res) {
    try {
        const { email, contrasenia } = req.body;

        // Validación inicial para evitar procesar consultas vacías
        if (!email || !contrasenia) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debes proporcionar un correo y una contraseña.' 
            });
        }
        
        const usuario = await authService.login(email, contrasenia);
        
        if (usuario) {
            return res.status(200).json({ success: true, data: usuario });
        } else {
            return res.status(401).json({ success: false, error: 'Correo o contraseña incorrectos.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const cambiarNombre = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || req.body.id_usuario;
    const { nombre } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta el ID del usuario.' });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    }

    const usuarioActualizado = await actualizarNombreUsuarioService(idUsuario, nombre);

    if (!usuarioActualizado) {
      return res.status(404).json({ error: `No se encontró ningún usuario con id_usuario ${idUsuario}.` });
    }

    return res.status(200).json({
      mensaje: 'Nombre actualizado con éxito',
      nombre: usuarioActualizado.nombreC
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para cambiar foto de perfil
export const cambiarFotoPerfil = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id || req.body.id_usuario;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta el ID del usuario.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Debes seleccionar una imagen.' });
    }

    const { urlFoto } = await actualizarFotoPerfilService(idUsuario, req.file);

    return res.status(200).json({
      mensaje: 'Foto de perfil actualizada con éxito',
      fotoPerfil: urlFoto
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};