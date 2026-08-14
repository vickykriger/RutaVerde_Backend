import express from 'express';
import { crearBaldosa } from '../controllers/baldosaController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload.single('imagen'), crearBaldosa);

export default router;