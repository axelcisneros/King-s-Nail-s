const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Configuración para Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar la configuración
    await transporter.verify();
    console.log('✅ Servidor de email configurado correctamente');

    // Definir las opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado exitosamente:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Error al enviar email:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

module.exports = sendEmail;