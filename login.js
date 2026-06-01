import { supabase } from './supabase.js';

export async function login(email, contrasenia) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select('id_usuario, nombreC, email, id_rol') // Traemos los datos necesarios (evita traer la contraseña de vuelta)
            .eq('email', email)
            .eq('contrasena', contrasenia) // Nota: En tu BD dice 'contrasena' sin la 'ñ'
            .single(); // Esperamos un único resultado

        if (error) {
            // Si no encuentra el usuario o las credenciales no coinciden, Supabase suele lanzar un error PGRST116
            if (error.code === 'PGRST116') {
                return { success: false, message: 'Credenciales incorrectas.' };
            }
            throw error;
        }

        // Si todo sale bien, retornamos los datos del usuario logueado
        return { success: true, user: data };

    } catch (error) {
        console.error('Error en el proceso de login:', error.message);
        return { success: false, message: 'Ocurrió un error en el servidor.' };
    }
}