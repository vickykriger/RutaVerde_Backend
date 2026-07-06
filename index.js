import { supabase } from './supabase.js';
import {registro } from './registro.js';
import {login} from './login.js';
import { subirBaldosa } from './subirBaldosa.js';
import cors from 'cors';
import express from 'express';
import multer from 'multer';

const app = express();
const PORT = 5000;
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());


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
app.post('/api/baldosas', upload.single('imagen'), async (req, res) => {
  try {
    const { nombrePlanta, idRegion, tamanio, comentarios } = req.body;
    const archivoImagen = req.file;

    if (!nombrePlanta || !idRegion || !tamanio || !archivoImagen) {
      return res.status(400).json({ success: false, error: 'Faltan campos obligatorios o la imagen.' });
    }
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