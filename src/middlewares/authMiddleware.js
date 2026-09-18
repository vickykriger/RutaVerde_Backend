// src/middlewares/authMiddleware.js

export const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body;
  const errores = [];

  // 1. Validar Campos Obligatorios
  if (!nombre || !nombre.trim()) {
    errores.push('El nombre es obligatorio.');
  }

  if (!email || !email.trim()) {
    errores.push('El correo electrónico es obligatorio.');
  }

  if (!password) {
    errores.push('La contraseña es obligatoria.');
  }

  // Si faltan campos básicos, respondemos de inmediato
  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  // 2. Validar Formato de Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.trim())) {
    errores.push('El formato del correo electrónico no es válido.');
  }

  // 3. Validar Fortaleza de Contraseña (mínimo 8 caracteres, al menos 1 letra y 1 número)
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  
  const regexPasswordSegura = /^(?=.*[A-Za-z])(?=.*\d)/;
  if (!regexPasswordSegura.test(password)) {
    errores.push('La contraseña debe contener al menos una letra y un número.');
  }

  // Si hay fallos de formato, cortamos el flujo
  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  next(); // Todo está bien, pasa al controller o servicio
};