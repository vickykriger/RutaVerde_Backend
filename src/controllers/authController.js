import * as authService from '../services/authService.js';

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