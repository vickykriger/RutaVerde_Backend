import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';

const router = express.Router();

// Define la ruta para registrarse: POST http://localhost:5174/api/auth/registro
router.post('/registro', registrarUsuario);

// Define la ruta para iniciar sesión: POST http://localhost:5174/api/auth/login
router.post('/login', loginUsuario);

export default router;