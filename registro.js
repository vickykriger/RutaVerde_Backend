import { supabase } from './supabase.js';

async function validar(email, contrasenia) {

    if (contrasenia.length < 8) {
        console.error('Error: La contraseña debe tener al menos 8 caracteres.');
        return { valido: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
    }

    if (contrasenia.includes(' ')) {
        console.error('Error: La contraseña no puede contener espacios.');
        return { valido: false, error: 'La contraseña no puede contener espacios.' };
    }

    // Validar comas en la contraseña
    if (contrasenia.includes(',')) {
        console.error('Error: La contraseña no puede contener comas.');
        return { valido: false, error: 'La contraseña no puede contener comas (,).' };
    }

    const { data, error } = await supabase
        .from('Usuarios')
        .select('email')
        .eq('email', email); 

    if (error) {
        console.error('Error al verificar el email en Supabase:', error.message);
        return { valido: false, error: 'Error de conexión al verificar el email.' };
    }

    if (email.includes(' ')) {
        console.error('Error: El correo electrónico no puede contener espacios.');
        return { valido: false, error: 'El correo electrónico no puede contener espacios.' };
    }

    // Validar comas en el email
    if (email.includes(',')) {
        console.error('Error: El correo electrónico no puede contener comas.');
        return { valido: false, error: 'El correo electrónico no puede contener comas (,).' };
    }

    if (data && data.length > 0) {
        console.error('El email ya está registrado:', email);
        return { valido: false, error: 'El correo electrónico ya está registrado.' };
    }

    return { valido: true };
}

async function registro(nombre, email, contrasenia, region) {

    const validacion = await validar(email, contrasenia);
    if (!validacion.valido) {
        return { success: false, error: validacion.error };
    }

    console.log("Enviando datos a Supabase...", { nombre, email, region });
    const fechaHoraActual = new Date();
    const { data, error } = await supabase
        .from('Usuarios')
        .insert([
            {
                nombreC: nombre,
                email: email,
                contrasena: contrasenia, 
                fechaR: fechaHoraActual,
                id_rol: 1, 
                id_region: region
            }
        ])
        .select();

    if (error) {
        console.error('Error en Supabase al registrar:', error.message);
        return { success: false, error: error.message };
    }

    console.log('🎉 Usuario registrado con éxito:', data);
    return { success: true, data: data };
}

export { registro };