import { supabase } from './supabase.js';
import {registro } from './registro.js';
import {login} from './login.js';
import { subirBaldosa } from './subirBaldosa.js';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());
const PORT = 5174;

app.listen(PORT, () => {
  console.log(`\n🚀 ¡Backend encendido con éxito!`);
  console.log(`📡 Escuchando peticiones en: http://localhost:${PORT}`);
});

//registro
app.post('/api/registro', async (req, res) => {
  try {
    const { nombre, email, contrasenia, region } = req.body;
    const resultado = await registro(nombre, email, contrasenia, region);
    
    if (resultado.success) {
      return res.status(200).json(resultado);
    } else {
      return res.status(400).json(resultado); 
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//login
app.post('/api/login', async (req, res) => {
  try {
    const { email, contrasenia } = req.body;
    const usuarioLogueado = await login(email, contrasenia);
    
    if (usuarioLogueado) {
      return res.status(200).json({ success: true, usuario: usuarioLogueado });
    } else {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
 
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
});