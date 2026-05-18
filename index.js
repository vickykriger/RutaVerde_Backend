import { supabase } from "./supabase.js";
document.getElementById('registro-form').addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const nombre = document.getElementById('regNombre').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const mensajeDiv = document.getElementById('registro-mensaje');

            mensajeDiv.style.color = 'black';
            mensajeDiv.innerText = 'Registrando...';

            // Registro en Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        nombre_completo: nombre // Guardamos el nombre dentro de los metadatos del usuario
                    }
                }
            });

            if (error) {
                mensajeDiv.style.color = 'red';
                mensajeDiv.innerText = 'Error: ' + error.message;
                console.error('Error al registrar:', error.message);
            } else {
                mensajeDiv.style.color = 'green';
                mensajeDiv.innerText = '¡Usuario creado con éxito!';
                console.log('Usuario creado:', data.user);
            }
        });

        // 3. Evento para controlar el Login
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('log-email').value;
            const password = document.getElementById('log-password').value;
            const mensajeDiv = document.getElementById('login-mensaje');

            mensajeDiv.style.color = 'black';
            mensajeDiv.innerText = 'Iniciando sesión...';

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                mensajeDiv.style.color = 'red';
                mensajeDiv.innerText = 'Error: ' + error.message;
                console.error('Error de login:', error.message);
            } else {
                mensajeDiv.style.color = 'green';
                mensajeDiv.innerText = '¡Sesión iniciada con éxito!';
                console.log('Sesión:', data.session);
            }
        });