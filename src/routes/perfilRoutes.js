import express from 'express';
import { actualizarNombre, actualizarFoto } from '../controllers/perfilController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.put('/nombre', actualizarNombre);
router.put('/foto', upload.single('foto'), actualizarFoto);

export default router;