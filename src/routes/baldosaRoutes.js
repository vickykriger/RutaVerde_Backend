import express from 'express';
import { crearBaldosa } from '../controllers/baldosaController.js';
import { upload } from '../config/multer.js'; // <-- Importamos tu middleware de arriba

const router = express.Router();

// 'imagen' es el nombre clave (key) que el frontend usará en el FormData
router.post('/subir-baldosa', upload.single('imagen'), crearBaldosa);

export default router;