import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';

export async function registro(nombre, email, contrasenia, region) {
    try {
        const { data: usuarioExistente } = await supabase
            .from('Usuarios')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (usuarioExistente) {
            return { success: false, error: 'El correo electrónico ya está registrado.' };
        }
        const saltRounds = 10;
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, saltRounds);

        const { data: nuevoUsuario, error: dbError } = await supabase
            .from('Usuarios')
            .insert([
                { 
                    nombreC: nombre,
                    email: email, 
                    contrasena: contraseniaEncriptada,
                    id_region: parseInt(region),
                    id_rol: 2
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

export async function login(email, contrasenia) {
    const { data: usuario, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (!usuario) {
        return null; 
    }

    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);

    if (!contraseniaValida) {
        return null; 
    }

    const { contrasena, ...usuarioSeguro } = usuario;
    return usuarioSeguro; 
}