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

// 1. PRIMERA FASE DE LOGIN: Verificar credenciales y generar código
export async function solicitarLogin(email, contrasenia) {
    try {
        const { data: usuario, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !usuario) {
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        // Comparar la contraseña enviada con la contraseña encriptada (usuario.contrasena)
        const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);
        
        if (!contraseniaValida) {
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        // Generar código aleatorio de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // Expira en 10 min

        // Guardar código y expiración en Supabase
        const { error: updateError } = await supabase
            .from('Usuarios')
            .update({ codigo_2fa: codigo, expiracion_2fa: expiracion })
            .eq('id_usuario', usuario.id_usuario);

        if (updateError) {
            console.error('Error al guardar código en BD:', updateError.message);
            return { success: false, error: 'Error al generar el código de verificación.' };
        }

        const { contrasena, ...usuarioSeguro } = usuario;
        return { success: true, requiereCodigo: true, usuario: usuarioSeguro, codigo };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 2. SEGUNDA FASE DE LOGIN: Validar el código ingresado
export async function verificarCodigoLogin(email, codigoIngresado) {
    try {
        console.log("--- INTENTO DE LOGIN ---");
        console.log("Email recibido:", email);
        console.log("Contraseña recibida:", contrasenia);

        // 1. Buscar usuario
        const { data: usuario, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.log("Error de Supabase al buscar usuario:", error.message);
            return { success: false, error: 'Error al consultar la base de datos.' };
        }

        if (!usuario) {
            console.log("El usuario NO existe en la base de datos para el email:", email);
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        console.log("Usuario encontrado en BD:", usuario.email);
        console.log("Hash guardado en BD:", usuario.contrasena);

        // 2. Validar contraseña
        const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);
        console.log("¿La contraseña coincide con el Hash?:", contraseniaValida);

        if (!contraseniaValida) {
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        // 3. Generar código
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        // 4. Guardar código en BD
        const { error: updateError } = await supabase
            .from('Usuarios')
            .update({ codigo_2fa: codigo, expiracion_2fa: expiracion })
            .eq('id_usuario', usuario.id_usuario);

        if (updateError) {
            console.log("Error al guardar código 2FA en Supabase:", updateError.message);
            return { success: false, error: 'Error al generar el código de verificación.' };
        }

        console.log("Código generado con éxito:", codigo);

        const { contrasena, ...usuarioSeguro } = usuario;
        return { success: true, requiereCodigo: true, usuario: usuarioSeguro, codigo };

    } catch (error) {
        console.log("Error inesperado en solicitarLogin:", error.message);
        return { success: false, error: error.message };
    }
}
export async function actualizarNombreUsuario(idUsuario, nuevoNombre) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .update({ nombreC: nuevoNombre })
            .eq('id_usuario', parseInt(idUsuario))
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data || data.length === 0) {
            return { success: false, error: "Usuario no encontrado." };
        }

        const { contrasena, ...usuarioSeguro } = data[0];
        return { success: true, message: "Nombre actualizado correctamente.", data: usuarioSeguro };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function subirFotoPerfil(idUsuario, archivoFoto) {
    try {
        if (!archivoFoto) {
            return { success: false, error: 'No se recibió ninguna imagen.' };
        }

        const base64Imagen = `data:${archivoFoto.mimetype};base64,${archivoFoto.buffer.toString('base64')}`;

        const { data, error } = await supabase
            .from('Usuarios')
            .update({ fotoPerfil: base64Imagen })
            .eq('id_usuario', parseInt(idUsuario))
            .select();

        if (error) {
            return { success: false, error: `Error en BD: ${error.message}` };
        }

        return { success: true, fotoPerfil: base64Imagen };
    } catch (error) {
        return { success: false, error: error.message };
    }
}