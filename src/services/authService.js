import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';

/**
 * Registra un nuevo usuario normi (id_rol: 2) directamente en la tabla 'Usuarios'
 */
export async function registro(nombre, email, contrasenia, region) {
    try {
        // 1. Verificar si el email ya existe
        const { data: usuarioExistente } = await supabase
            .from('Usuarios')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (usuarioExistente) {
            return { success: false, error: 'El correo electrónico ya está registrado.' };
        }

        // 2. Encriptar la contraseña
        const saltRounds = 10;
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, saltRounds);

        // 3. Insertar el usuario asignándole por defecto el rol "normi" (ID: 2)
        const { data: nuevoUsuario, error: dbError } = await supabase
            .from('Usuarios')
            .insert([
                { 
                    nombreC: nombre,
                    email: email, 
                    contrasena: contraseniaEncriptada,
                    id_region: parseInt(region),
                    id_rol: 2 // <-- Asignación automática: Rol de usuario común/normi
                }
            ])
            .select();

        if (dbError) {
            return { success: false, error: `Error en BD: ${dbError.message}` };
        }

        return { success: true, message: "Usuario registrado con éxito.", data: nuevoUsuario[0] };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Loguea un usuario y trae su perfil completo (incluyendo el id_rol)
 */
export async function login(email, contrasenia) {
    // 1. Buscar al usuario por email
    const { data: usuario, error } = await supabase
        .from('Usuarios')
        .select('*') // Esto va a traer 'id_usuario', 'nombreC', 'email', 'id_rol', etc.
        .eq('email', email)
        .maybeSingle();

    if (!usuario) {
        return null; 
    }

    // 2. Comparar la contraseña
    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);

    if (!contraseniaValida) {
        return null; 
    }

    // 3. Limpiar la contraseña antes de mandarlo al front por seguridad
    const { contrasena, ...usuarioSeguro } = usuario;
    
    // Al retornar esto, el front recibirá el 'id_rol' (1 o 2) para saber qué pantallas mostrarle
    return usuarioSeguro; 
}