import express from 'express';
import multer from 'multer';
import { registrarUsuario, loginUsuario, cambiarNombre, cambiarFoto } from '../controllers/authController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.put('/perfil/nombre', cambiarNombre);
router.put('/perfil/foto', upload.single('foto'), cambiarFoto); // <-- Endpoint para foto de perfil

export default router;