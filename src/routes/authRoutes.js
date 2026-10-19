import express from 'express';
import multer from 'multer';
import { registrarUsuario, loginUsuario, confirmarCodigo, cambiarNombre, cambiarFoto } from '../controllers/authController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/confirmar-codigo', confirmarCodigo); // <-- NUEVA RUTA DE VERIFICACIÓN
router.put('/perfil/nombre', cambiarNombre);
router.put('/perfil/foto', upload.single('foto'), cambiarFoto);

export default router;