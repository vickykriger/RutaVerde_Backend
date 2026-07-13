/* import { supabase } from './src/config/supabase.js';

export async function login(email, contrasenia) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            .eq('contrasena', contrasenia)
            .single();

        if (error) {
            console.error('Error en el login:', error.message);
            alert('Correo o contraseña incorrectos.');
            return null;
        }

        console.log('Inicio de sesión exitoso:', data);
        alert(`¡Bienvenido/a de nuevo, ${data.nombreC}!`);
        
        return data;

    } catch (err) {
        console.error('Error inesperado:', err);
        return null;
    }
} */