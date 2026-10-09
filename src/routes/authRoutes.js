import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';
import upload from '../middlewares/multer.js';
import { validarRegistro } from '../middlewares/authMiddleware.js';
import { cambiarNombre, cambiarFotoPerfil } from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', loginUsuario);
router.put('/perfil/nombre', cambiarNombre);
router.put('/perfil/foto', upload.single('foto'), cambiarFotoPerfil);

export default router;