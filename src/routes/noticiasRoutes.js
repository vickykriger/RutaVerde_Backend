import { Router } from 'express';
import { crearNoticia, obtenerNoticias } from '../controllers/noticiasController.js';
import upload from '../middlewares/multer.js'; 

const router = Router();

router.get('/', obtenerNoticias);
router.post('/', upload.single('foto'), crearNoticia);

export default router;