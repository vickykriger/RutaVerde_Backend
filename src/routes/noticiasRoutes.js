import { Router } from 'express';
import { crearNoticia, obtenerNoticias } from '../controllers/noticiasController.js';
import upload from '../middlewares/multer.js'; 
import { mejorarNoticia } from '../controllers/noticiasController.js';

const router = Router();

router.get('/', obtenerNoticias);
router.post('/', upload.single('foto'), crearNoticia);
router.post('/mejorar-ia', mejorarNoticia);

export default router;