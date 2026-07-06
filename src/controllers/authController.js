import * as authService from '../services/authService.js';

// Controlador para el Registro de Usuarios
export async function registrarUsuario(req, res) {
    try {
        const { nombre, email, contrasenia, region } = req.body;
        
        // Llamamos al servicio de autenticación para procesar el registro
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

// Controlador para el Login de Usuarios
export async function loginUsuario(req, res) {
    try {
        const { email, contrasenia } = req.body;
        
        // Llamamos al servicio para verificar las credenciales en Supabase
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