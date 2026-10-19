import express from 'express';
import multer from 'multer';
import { registrarUsuario, loginUsuario, confirmarCodigoUsuario, cambiarNombre, cambiarFotoPerfil } from '../controllers/authController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/confirmar-codigo', confirmarCodigoUsuario);
router.put('/cambiar-nombre', cambiarNombre);
router.put('/cambiar-foto', cambiarFotoPerfil);
export default router;

