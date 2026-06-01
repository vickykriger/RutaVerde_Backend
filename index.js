import { supabase } from './supabase.js';
import {registro } from './registro.js';

async function listarRoles() {
    const { data, error } = await supabase
        .from('Roles')
        .select('*');

    if (error) {
        console.error('Error al obtener los roles:', error.message);
        return;
    }

    console.table(data);
}

document.getElementById('btnRoles').addEventListener('click', listarRoles);

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