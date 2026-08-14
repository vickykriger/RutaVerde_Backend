import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import baldosaRoutes from './src/routes/baldosaRoutes.js';
import regionRoutes from './src/routes/regionRoutes.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 5000;

// Middlewares obligatorios
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));
// Enlazar las rutas de tu API
app.use('/api', authRoutes);
app.use('/api/baldosas', baldosaRoutes);
app.use('/api', regionRoutes); // Disponibiliza GET /api/regiones

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`==================================================`);
});


app.get('/api/ecorregiones', (req, res) => {
  try {
    const rutaArchivo = path.join(__dirname, 'ecorregiones.json');
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
      if (err) {
        console.error("Error leyendo ecorregiones.json:", err);
        return res.status(500).json({ success: false, error: 'No se pudo leer el archivo' });
      }
      res.json(JSON.parse(data));
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
