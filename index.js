import { supabase } from './supabase.js';
import { registro } from './registro.js';
import { login } from './login.js';
import { subirBaldosa } from './subirBaldosa.js';
import cors from 'cors';
import express from 'express';
import multer from 'multer';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// --- ENDPOINT PARA SERVIR EL MAPA DE ECORREGIONES ---
app.get('/api/ecorregiones', (req, res) => {
  try {
    const rutaArchivo = path.join(__dirname, 'ecorregiones.json');
    
    // Leemos el archivo JSON y lo enviamos
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
      if (err) {
        console.error("Error leyendo ecorregiones.json:", err);
        return res.status(500).json({ success: false, error: 'No se pudo leer el archivo del mapa' });
      }
      res.json(JSON.parse(data));
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- REGISTRO ---
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

// --- LOGIN ---
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

// --- SUBIR BALDOSA ---
app.post('/api/baldosas', upload.single('imagen'), async (req, res) => {
  try {
    const { nombrePlanta, idRegion, tamanio, comentarios } = req.body;
    const archivoImagen = req.file;

    const resultado = await subirBaldosa(
      nombrePlanta, 
      parseInt(idRegion), 
      parseFloat(tamanio), 
      comentarios, 
      archivoImagen
    );

    if (resultado.success) {
      return res.status(200).json(resultado);
    } else {
      return res.status(500).json(resultado);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// --- ENCENDIDO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`\n🚀 ¡Backend encendido con éxito!`);
  console.log(`📡 Escuchando peticiones en: http://localhost:${PORT}`);
});