import * as authService from '../services/authService.js';
import { enviarCodigoVerificacion } from '../services/emailService.js';

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
        
        // Llamada a solicitarLogin
        const resultado = await authService.solicitarLogin(email, contrasenia);
        
        if (!resultado.success) {
            return res.status(401).json({ success: false, error: resultado.error });
        }

        // Envío del mail con el código
        await enviarCodigoVerificacion(email, resultado.usuario.nombreC, resultado.codigo);

        return res.status(200).json({ 
            success: true, 
            requiereCodigo: true, 
            message: 'Se ha enviado un código de verificación a tu correo.' 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
// NUEVO CONTROLADOR: Para validar el código ingresado por el usuario en el frontend
export async function confirmarCodigo(req, res) {
    try {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).json({ success: false, error: 'El email y el código son obligatorios.' });
        }

        const resultado = await authService.verificarCodigoLogin(email, codigo);

        if (resultado.success) {
            return res.status(200).json({ 
                success: true, 
                message: 'Inicio de sesión verificado con éxito.', 
                data: resultado.usuario 
            });
        } else {
            return res.status(400).json(resultado);
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
