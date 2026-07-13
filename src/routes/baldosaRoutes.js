import express from 'express';
import { crearBaldosa } from '../controllers/baldosaController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.post('/subir-baldosa', upload.single('imagen'), crearBaldosa);

export default router;