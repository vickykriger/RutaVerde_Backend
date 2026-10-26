import { supabase } from '../config/supabase.js';

export async function listarUsuarios(req, res) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select(`
                id_usuario,
                nombreC,
                email,
                id_rol,
                id_region,
                fotoPerfil,
                fechaR,
                Roles ( nombreRol )
            `)
            .order('id_usuario', { ascending: true });

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        const usuariosFormateados = data.map(u => {
            // Aseguramos que siempre haya una cadena de texto para evitar el crash de charAt()
            const nombreValido = u.nombreC || u.email || 'Usuario';

            return {
                id: u.id_usuario,
                id_usuario: u.id_usuario,
                nombre: nombreValido,       // <-- Requerido por Usuarios.tsx para charAt()
                nombreC: nombreValido,      // <-- Compatibilidad
                email: u.email || '',
                id_rol: u.id_rol,
                rol: u.Roles?.nombreRol || (u.id_rol === 1 ? 'Administrador' : 'Usuario'),
                id_region: u.id_region,
                fotoPerfil: u.fotoPerfil || null,
                fechaRegistro: u.fechaR,
                activo: true
            };
        });

        return res.status(200).json({ success: true, data: usuariosFormateados });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}