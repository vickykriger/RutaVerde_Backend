import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';

export async function registro(nombre, email, contrasenia, region) {
    try {
        // --- 1. VALIDACIONES DE ENTRADA ---
        
        // Campos requeridos
        if (!nombre || !nombre.trim()) {
            return { success: false, error: 'El nombre es obligatorio.' };
        }
        if (!email || !email.trim()) {
            return { success: false, error: 'El correo electrónico es obligatorio.' };
        }
        if (!contrasenia) {
            return { success: false, error: 'La contraseña es obligatoria.' };
        }
        if (!region || isNaN(parseInt(region))) {
            return { success: false, error: 'Debes seleccionar una región válida.' };
        }

        // Formato de Email
        const emailNormalizado = email.trim().toLowerCase();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(emailNormalizado)) {
            return { success: false, error: 'El formato del correo electrónico no es válido.' };
        }

        // Fortaleza de la Contraseña (mínimo 8 caracteres, al menos 1 letra y 1 número)
        if (contrasenia.length < 8) {
            return { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
        }
        const regexPasswordSegura = /^(?=.*[A-Za-z])(?=.*\d)/;
        if (!regexPasswordSegura.test(contrasenia)) {
            return { success: false, error: 'La contraseña debe contener al menos una letra y un número.' };
        }

        // --- 2. VALIDACIÓN DE DISPONIBILIDAD EN BD ---

        const { data: usuarioExistente } = await supabase
            .from('Usuarios')
            .select('email')
            .eq('email', emailNormalizado)
            .maybeSingle();

        if (usuarioExistente) {
            return { success: false, error: 'El correo electrónico ya está registrado.' };
        }

        // --- 3. INSERCIÓN DE DATOS ---

        const saltRounds = 10;
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, saltRounds);

        const { data: nuevoUsuario, error: dbError } = await supabase
            .from('Usuarios')
            .insert([
                { 
                    nombreC: nombre.trim(),
                    email: emailNormalizado, 
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
    if (!email || !contrasenia) {
        return null;
    }

    const emailNormalizado = email.trim().toLowerCase();

    const { data: usuario, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', emailNormalizado)
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