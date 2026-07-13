import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js'; 
import baldosaRoutes from './src/routes/baldosaRoutes.js'; 

const app = express();
const PORT = 5000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Enlazar las rutas de tu API
app.use('/api/auth', authRoutes);
app.use('/api/baldosas', baldosaRoutes);

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`==================================================`);
});

/* import { supabase } from './src/config/supabase.js';
import {registro } from './registro.js';
import {login} from './login.js';
import { subirBaldosa } from './subirBaldosa.js';

//registro
async function manejarRegistro() {
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const contrasenia = document.getElementById('regContrasena').value;
    const regionId = parseInt(document.getElementById('regProvincia').value); 

    if(!nombre || !email || !contrasenia || !regionId) {
        alert("Por favor, completa todos los campos, incluyendo tu provincia.");
        return;
    }

    await registro(nombre, email, contrasenia, regionId);
}

document.getElementById('btnRegistrar').addEventListener('click', manejarRegistro);

//login
async function manejarLogin() {
    const email = document.getElementById('loginEmail').value;
    const contrasenia = document.getElementById('loginContrasena').value;
    
    if(!email || !contrasenia) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    const usuarioLogueado = await login(email, contrasenia);
    
    if (usuarioLogueado) {
        console.log("Datos del usuario activo:", usuarioLogueado);
    }
}

document.getElementById('btnIngresar').addEventListener('click', manejarLogin);

//subirBaldosa
const inputNombrePlanta = document.getElementById('input-nombre-planta');
const btnSubirImagenVisual = document.getElementById('btn-subir-imagen-visual');
const inputArchivoOculto = document.getElementById('input-archivo-oculto');
const nombreArchivoSeleccionado = document.getElementById('nombre-archivo-seleccionado');
const btnSubirBaldosaGrande = document.getElementById('btn-subir-baldosa-grande');
const mensajeEstado = document.getElementById('mensaje-estado'); 

// Rango permitido para el tamaño
const TAMANIO_MIN = 1;
const TAMANIO_MAX = 500;

// Bloquear números y caracteres especiales
inputNombrePlanta.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
});

// Manejo del input de imagen
btnSubirImagenVisual.addEventListener('click', () => {
    inputArchivoOculto.click();
});

inputArchivoOculto.addEventListener('change', () => {
    if (inputArchivoOculto.files.length > 0) {
        nombreArchivoSeleccionado.textContent = inputArchivoOculto.files[0].name;
    } else {
        nombreArchivoSeleccionado.textContent = "Ningún archivo seleccionado";
    }
});

// Evento principal de subida
btnSubirBaldosaGrande.addEventListener('click', async () => {
    // Limpiar el mensaje de la pantalla al hacer un nuevo intento
    mensajeEstado.textContent = "";

    const nombrePlanta = inputNombrePlanta.value.trim();
    const idRegion = document.getElementById('select-region').value;
    const tamanioRaw = document.getElementById('input-tamanio').value;
    const comentarios = document.getElementById('comentarios').value.trim();
    const archivoImagen = inputArchivoOculto.files[0] || null;

    //Validación de existencia
    if (!nombrePlanta || !idRegion || !tamanioRaw || !archivoImagen) {
        mensajeEstado.style.color = "red";
        mensajeEstado.textContent = "Por favor, completa los campos obligatorios: Planta, Provincia, Tamaño y la Imagen.";
        return;
    }

    //Validación de formato de texto
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regexLetras.test(nombrePlanta)) {
        mensajeEstado.style.color = "red";
        mensajeEstado.textContent = "El nombre de la planta solo puede contener letras y espacios.";
        return;
    }

    //Validación del rango de tamaño
    const tamanio = parseFloat(tamanioRaw);
    if (isNaN(tamanio) || tamanio < TAMANIO_MIN || tamanio > TAMANIO_MAX) {
        mensajeEstado.style.color = "red";
        mensajeEstado.textContent = `El tamaño debe ser un número válido entre ${TAMANIO_MIN} y ${TAMANIO_MAX}.`;
        return;
    }

    // Modificaciones silenciosas para la interfaz, pero informativas para la consola
    btnSubirBaldosaGrande.disabled = true;
    
    console.log("Iniciando proceso...");
    console.log("Enviando datos a Supabase...");

    const resultado = await subirBaldosa(nombrePlanta, parseInt(idRegion), tamanio, comentarios, archivoImagen);

    btnSubirBaldosaGrande.disabled = false;

    if (resultado.success) {
        mensajeEstado.style.color = "green";
        mensajeEstado.textContent = "¡Baldosa guardada con éxito en la base de datos!";
        
        console.log("¡Éxito! Datos guardados en Supabase:", resultado.data);
        
        inputNombrePlanta.value = '';
        document.getElementById('select-region').value = '';
        document.getElementById('input-tamanio').value = '';
        document.getElementById('comentarios').value = '';
        inputArchivoOculto.value = '';
        nombreArchivoSeleccionado.textContent = "Ningún archivo seleccionado";
    } else {
        // ERROR DE SERVIDOR: No le mostramos detalles técnicos al usuario, solo en consola
        mensajeEstado.style.color = "red";
        mensajeEstado.textContent = "Hubo un problema al subir la baldosa.";
        
        console.error("Error devuelto por Supabase:", resultado.error);
    }
}); */