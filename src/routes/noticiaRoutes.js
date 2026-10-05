import express from 'express';
import { publicarNoticia } from '../controllers/noticiaController.js';
import { upload } from '../middlewares/multer.js'; // Reutiliza tu middleware de multer existente

const router = express.Router();

// El nombre 'foto' debe coincidir con el campo de FormData en tu frontend
router.post('/', upload.single('foto'), publicarNoticia);

export default router;