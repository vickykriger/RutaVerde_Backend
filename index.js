import { supabase } from './supabase.js';

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