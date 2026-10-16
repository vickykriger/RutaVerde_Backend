import * as authService from '../services/authService.js';

export async function registrarUsuario(req, res) {
    try {
        const { nombre, email, contrasenia, region } = req.body;
        
        const resultado = await authService.registro(nombre, email, contrasenia, region);
        
        if (resultado.success) {
            return res.status(200).json(resultado);
        } else {
            return res.status(400).json(resultado); 
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function loginUsuario(req, res) {
    try {
        const { email, contrasenia } = req.body;
        
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

// NUEVO CONTROLADOR
export async function cambiarNombre(req, res) {
    try {
        // Aceptamos las variaciones de nombres de clave que el frontend suele enviar
        const { idUsuario, id_usuario, id, nombre, nombreC } = req.body;

        const userId = idUsuario || id_usuario || id;
        const nuevoNombre = nombre || nombreC;

        if (!nuevoNombre || !nuevoNombre.trim()) {
            return res.status(400).json({ success: false, error: 'El nombre es obligatorio.' });
        }

        if (!userId) {
            return res.status(400).json({ success: false, error: 'El ID de usuario es obligatorio.' });
        }

        const resultado = await authService.actualizarNombreUsuario(userId, nuevoNombre.trim());

        if (resultado.success) {
            return res.status(200).json(resultado);
        } else {
            return res.status(400).json(resultado);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
export async function cambiarFoto(req, res) {
  try {
    const { id_usuario, idUsuario } = req.body;
    const userId = id_usuario || idUsuario;
    const archivo = req.file; // multer coloca aquí la imagen si coincide el nombre 'foto'

    if (!archivo) {
      return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen.' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, error: 'El ID de usuario es obligatorio.' });
    }

    const resultado = await authService.subirFotoPerfil(userId, archivo);

    if (resultado.success) {
      return res.status(200).json(resultado);
    } else {
      return res.status(400).json(resultado);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
