import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function enviarCodigoVerificacion(emailUsuario, nombreUsuario, codigo) {
  try {
    const info = await transporter.sendMail({
      from: `"Ruta Verde" <${process.env.EMAIL_USUARIO}>`,
      to: emailUsuario,
      subject: 'Código de verificación de inicio de sesión',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border: 1px solid #eee; border-radius: 8px;">
          <h2>Código de verificación</h2>
          <p>Hola, <strong>${nombreUsuario || 'Usuario'}</strong>.</p>
          <p>Usa el siguiente código para completar tu inicio de sesión en Ruta Verde:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #2e7d32; padding: 10px 0;">
            ${codigo}
          </div>
          <p>Este código vencerá en 10 minutos.</p>
          <p style="color: #888; font-size: 12px;">Si no intentaste iniciar sesión, ignora este correo.</p>
        </div>
      `
    });
    return { success: true, info };
  } catch (error) {
    console.error('Error enviando código por correo:', error);
    return { success: false, error: error.message };
  }
}