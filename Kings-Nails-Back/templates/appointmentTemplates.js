const { createEmailTemplate } = require('./emailTemplate');

// Template para confirmación de cita
const appointmentConfirmedTemplate = (appointmentData) => {
  const { clientName, service, date, notes } = appointmentData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      🎉 <strong>¡Excelentes noticias!</strong> Tu cita ha sido confirmada por nuestro equipo y estamos emocionados de atenderte.
    </div>
    
    <div class="highlight-box">
      <h3>📅 Detalles de tu Cita Confirmada</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value" style="color: #10b981; font-weight: bold;">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha y Hora:</span>
        <span class="detail-value" style="color: #10b981; font-weight: bold;">${date}</span>
      </div>
      ${notes ? `
      <div class="detail-item">
        <span class="detail-label">Notas especiales:</span>
        <span class="detail-value">${notes}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="message">
      <strong>✨ ¿Qué esperar el día de tu cita?</strong><br><br>
      
      <strong>Antes de llegar:</strong><br>
      • Llega 10 minutos antes de tu cita<br>
      • Trae una foto de referencia si tienes un diseño específico en mente<br>
      • Usa ropa cómoda que permita acceso fácil a tus uñas<br><br>
      
      <strong>Durante tu visita:</strong><br>
      • Relájate y disfruta la experiencia<br>
      • No dudes en comunicar cualquier preferencia<br>
      • Siéntete libre de hacer preguntas sobre el cuidado<br><br>
      
      <a href="${baseUrl}/client/mis-citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Ver mis citas
      </a>
    </div>
    
    <div class="message" style="background-color: #fef3f2; border-left: 4px solid #f87171; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>📱 ¿Necesitas reagendar?</strong><br>
      Puedes hacerlo con al menos 3 días de anticipación desde tu perfil. También puedes contactarnos por WhatsApp si surge alguna urgencia.
    </div>
  `;
  
  return createEmailTemplate(content, clientName);
};

// Template para cancelación de cita por admin
const appointmentCancelledByAdminTemplate = (appointmentData) => {
  const { clientName, service, date, reason } = appointmentData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      😔 Lamentamos informarte que tu cita ha sido <strong>cancelada</strong> debido a circunstancias imprevistas en nuestro salón.
    </div>
    
    <div class="highlight-box">
      <h3>📅 Detalles de la Cita Cancelada</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value" style="color: #ef4444;">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha Original:</span>
        <span class="detail-value" style="color: #ef4444;">${date}</span>
      </div>
      ${reason ? `
      <div class="detail-item">
        <span class="detail-label">Motivo:</span>
        <span class="detail-value">${reason}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="message">
      <strong>💪 ¡No te preocupes! Aquí estamos para ayudarte.</strong><br><br>
      
      <strong>¿Qué puedes hacer ahora?</strong><br>
      • Reagenda tu cita directamente desde tu perfil<br>
      • Contáctanos por WhatsApp para asistencia personalizada<br>
      • Ofrecemos flexibilidad total sin costo adicional<br><br>
      
      Sentimos mucho cualquier inconveniente. Estamos comprometidos a brindarte la mejor experiencia posible.
    </div>
    
    <a href="${baseUrl}/client/mis-citas" 
       class="button" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
      Reagendar mi cita
    </a>
    
    <div class="message" style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>💡 Tip profesional:</strong><br>
      Para evitar futuras cancelaciones, te recomendamos confirmar tu cita 24 horas antes. ¡Estamos aquí para hacer tu experiencia perfecta!
    </div>
  `;
  
  return createEmailTemplate(content, clientName);
};

// Template para reagendación de cita
const appointmentRescheduledTemplate = (appointmentData) => {
  const { clientName, service, oldDate, newDate, rescheduledBy } = appointmentData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      📅 <strong>¡Perfecto!</strong> Tu cita ha sido reagendada exitosamente ${rescheduledBy === 'client' ? 'según tu solicitud' : 'por nuestro equipo'}.
    </div>
    
    <div class="highlight-box">
      <h3>📅 Cambios en tu Cita</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value" style="color: #10b981; font-weight: bold;">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha Anterior:</span>
        <span class="detail-value" style="text-decoration: line-through; opacity: 0.6; color: #6b7280;">${oldDate}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Nueva Fecha:</span>
        <span class="detail-value" style="color: #10b981; font-weight: bold; font-size: 16px;">${newDate}</span>
      </div>
    </div>
    
    <div class="message">
      <strong>✅ Todo listo para tu nueva cita</strong><br><br>
      
      <strong>Confirmaciones importantes:</strong><br>
      • Tu nueva cita está 100% confirmada y reservada<br>
      • Recibirás un recordatorio automático 24 horas antes<br>
      • Nuestro equipo ya está preparado para atenderte<br><br>
      
      <a href="${baseUrl}/client/mis-citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Ver mis citas
      </a>
    </div>
    
    <div class="message" style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>🎯 ¡Estamos emocionados de verte!</strong><br>
      Si tienes alguna pregunta sobre tu nueva cita o necesitas hacer algún ajuste adicional, no dudes en contactarnos por WhatsApp.
    </div>
  `;
  
  return createEmailTemplate(content, clientName);
};

// Template para nueva solicitud de cita
const newAppointmentRequestTemplate = (appointmentData) => {
  const { clientName, service, date, notes } = appointmentData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      🙏 <strong>¡Gracias por elegir King's Nail's!</strong> Hemos recibido tu solicitud de cita y estamos emocionados de poder atenderte.
    </div>
    
    <div class="highlight-box">
      <h3>📅 Detalles de tu Solicitud</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio Solicitado:</span>
        <span class="detail-value" style="color: #6366f1; font-weight: bold;">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha Solicitada:</span>
        <span class="detail-value" style="color: #6366f1; font-weight: bold;">${date}</span>
      </div>
      ${notes ? `
      <div class="detail-item">
        <span class="detail-label">Notas Especiales:</span>
        <span class="detail-value">${notes}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="message">
      <strong>⏱️ ¿Qué sigue ahora?</strong><br><br>
      
      <strong>Nuestro proceso:</strong><br>
      • Revisaremos tu solicitud en las próximas 24 horas<br>
      • Verificaremos disponibilidad en la fecha solicitada<br>
      • Te contactaremos para confirmar los detalles<br>
      • Recibirás un email de confirmación completo<br><br>
      
      <a href="${baseUrl}/client/mis-citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Ver estado de mi solicitud
      </a>
    </div>
    
    <div class="message" style="background-color: #fef7f0; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>💡 Consejo profesional:</strong><br>
      Mientras esperás la confirmación, podés revisar nuestras redes sociales para ver trabajos recientes y obtener inspiración para tu cita.
    </div>
  `;
  
  return createEmailTemplate(content, clientName);
};

module.exports = {
  appointmentConfirmedTemplate,
  appointmentCancelledByAdminTemplate,
  appointmentRescheduledTemplate,
  newAppointmentRequestTemplate
};