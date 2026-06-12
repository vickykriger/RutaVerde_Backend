import { supabase } from './supabase.js';
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
const btnSubirImagenVisual = document.getElementById('btn-subir-imagen-visual');
const inputArchivoOculto = document.getElementById('input-archivo-oculto');
const nombreArchivoSeleccionado = document.getElementById('nombre-archivo-seleccionado');

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

const btnSubirBaldosaGrande = document.getElementById('btn-subir-baldosa-grande');

btnSubirBaldosaGrande.addEventListener('click', async () => {
    const nombrePlanta = document.getElementById('input-nombre-planta').value.trim();
    const idRegion = document.getElementById('select-region').value;
    const tamanioRaw = document.getElementById('input-tamanio').value;
    const comentarios = document.getElementById('comentarios').value.trim();
    const archivoImagen = inputArchivoOculto.files[0] || null;

    if (!nombrePlanta || !idRegion || !tamanioRaw || !archivoImagen) {
        alert("Por favor, completa los campos obligatorios: Planta, Provincia, Tamaño y la Imagen.");
        return;
    }

    const tamanio = parseFloat(tamanioRaw);

    btnSubirBaldosaGrande.disabled = true;
    btnSubirBaldosaGrande.textContent = "Subiendo...";

    console.log("Enviando datos a Supabase...");

    const resultado = await subirBaldosa(nombrePlanta, parseInt(idRegion), tamanio, comentarios, archivoImagen);

    btnSubirBaldosaGrande.disabled = false;
    btnSubirBaldosaGrande.textContent = "Subir baldosa";

    if (resultado.success) {
        alert("¡Baldosa guardada con éxito en la base de datos!");
        console.log("Datos guardados:", resultado.data);
        
        document.getElementById('input-nombre-planta').value = '';
        document.getElementById('select-region').value = '';
        document.getElementById('input-tamanio').value = '';
        document.getElementById('comentarios').value = '';
        inputArchivoOculto.value = '';
        nombreArchivoSeleccionado.textContent = "Ningún archivo seleccionado";
    } else {
        alert("Hubo un problema al subir la baldosa.");
        console.error("Error devuelto por Supabase:", resultado.error);
    }
});