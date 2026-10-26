import express from 'express';
import { publicarNoticia, listarTodasLasNoticias } from '../controllers/noticiaController.js';import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Maneja la petición POST /api/Noticias
router.post('/', upload.single('foto'), publicarNoticia);
router.get('/todas', listarTodasLasNoticias); // <-- Resuelve /api/noticias/todas

export default router;