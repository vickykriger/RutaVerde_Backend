import express from 'express';
import { publicarNoticia } from '../controllers/noticiaController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Maneja la petición POST /api/Noticias
router.post('/', upload.single('foto'), publicarNoticia);

export default router;