import multer from 'multer';

// Guardamos el archivo temporalmente en la memoria RAM del servidor
const storage = multer.memoryStorage();

// Filtro opcional: Validamos que el archivo subido sea únicamente una imagen
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo debe ser una imagen válida.'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter, // <-- ¡FALTABA AGREGAR ESTO AQUÍ!
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño: 5MB máximo
});