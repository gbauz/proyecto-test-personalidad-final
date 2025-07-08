import nodemailer from 'nodemailer';

// ⚠️ Reemplaza con tu correo real y contraseña de app (NO la contraseña normal de Gmail)
const EMAIL_FROM = 'digitalwebdise@gmail.com';
const EMAIL_PASS = 'dnvc kubv cuyo neor';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
});

export const sendRecoveryEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    // console.log('📧 Correo de recuperación enviado a:', to);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
};
