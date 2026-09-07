import { Router } from 'express';
import { getRegiones, obtenerRegiones} from '../controllers/regionController.js';

const router = Router();

router.get('/regiones', getRegiones);
router.get('/ecoregiones', obtenerRegiones);

export default router;