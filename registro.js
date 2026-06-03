import { supabase } from './supabase.js';

async function registro(nombre, email, contrasenia, region) {
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