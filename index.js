import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/authRoutes.js'; 
import baldosaRoutes from './src/routes/baldosaRoutes.js'; 
import regionRoutes from './src/routes/regionRoutes.js';
import noticiaRoutes from './src/routes/noticiaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- ENDPOINT SERVIDOR DEL MAPA (GeoJSON) ---
app.get('/api/ecorregiones', (req, res) => {
  try {
    let rutaArchivo = path.join(__dirname, 'ecorregiones.json');
    if (!fs.existsSync(rutaArchivo)) {
      rutaArchivo = path.join(__dirname, 'src', 'ecorregiones.json');
    }

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
      if (err) {
        console.error("Error leyendo ecorregiones.json:", err);
        return res.status(500).json({ success: false, error: 'No se pudo leer el archivo GeoJSON' });
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rutas API suplementarias
app.use('/api', authRoutes);
app.use('/api/baldosas', baldosaRoutes); 
app.use('/api', regionRoutes); 
app.use('/api/Noticias', noticiaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});