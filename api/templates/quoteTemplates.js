const { createEmailTemplate } = require('./emailTemplate');

// Template para notificar al cliente que su cotización fue respondida
const quoteRespondedTemplate = (quoteData) => {
  const { clientName, service, adminPrice, adminComment, status, notes } = quoteData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  let statusMessage = '';
  let statusColor = '#10b981'; // verde por defecto
  
  if (status === 'quoted') {
    statusMessage = '¡Tu cotización está lista!';
    statusColor = '#10b981';
  } else if (status === 'declined') {
    statusMessage = 'Cotización no disponible';
    statusColor = '#ef4444';
  }
  
  const content = `
    <div class="message">
      ${statusMessage} Hemos revisado tu solicitud de cotización y tenemos una respuesta para ti.
    </div>
    
    <div class="highlight-box">
      <h3>💰 Tu Cotización</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value">${service}</span>
      </div>
      ${notes ? `
      <div class="detail-item">
        <span class="detail-label">Tus notas:</span>
        <span class="detail-value">${notes}</span>
      </div>
      ` : ''}
      ${adminPrice ? `
      <div class="detail-item">
        <span class="detail-label">Precio estimado:</span>
        <span class="detail-value" style="color: ${statusColor}; font-weight: bold;">$${adminPrice.toFixed(2)} MXN</span>
      </div>
      ` : ''}
      ${adminComment ? `
      <div class="detail-item">
        <span class="detail-label">Comentarios del equipo:</span>
        <span class="detail-value">${adminComment}</span>
      </div>
      ` : ''}
    </div>
    
    ${status === 'quoted' ? `
    <div class="message">
      <strong>🎉 ¡Genial! Estamos listos para atenderte.</strong><br><br>
      
      <strong>Próximos pasos:</strong><br>
      • Inicia sesión en tu cuenta<br>
      • Ve a la sección "Mis Cotizaciones"<br>
      • Haz clic en "Agendar cita" para seleccionar fecha y hora<br><br>
      
      <a href="${baseUrl}/client/mis-cotizaciones" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600;">
        Ver mis cotizaciones
      </a>
    </div>
    ` : ''}
    
    ${status === 'declined' ? `
    <div class="message">
      Lamentamos no poder ofrecer este servicio en este momento. Esto puede deberse a disponibilidad, complejidad del diseño o recursos necesarios.<br><br>
      
      <strong>¿Qué puedes hacer?</strong><br>
      • Modifica tu solicitud con un diseño diferente<br>
      • Contáctanos para explorar alternativas<br>
      • Envía una nueva cotización cuando gustes<br><br>
      
      Siempre estamos aquí para ayudarte a crear el look perfecto.
    </div>
    ` : ''}
  `;
  
  return createEmailTemplate(content, clientName);
};

// Template para notificar al admin de nueva cotización
const newQuoteAdminTemplate = (quoteData) => {
  const { clientName, clientEmail, service, notes, designs } = quoteData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      📋 <strong>Nueva solicitud de cotización recibida</strong><br>
      Un cliente ha enviado una nueva solicitud que requiere tu atención.
    </div>
    
    <div class="highlight-box">
      <h3>👤 Información del Cliente</h3>
      <div class="detail-item">
        <span class="detail-label">Nombre:</span>
        <span class="detail-value">${clientName}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${clientEmail}</span>
      </div>
    </div>
    
    <div class="highlight-box">
      <h3>🎨 Detalles de la Solicitud</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value">${service}</span>
      </div>
      ${notes ? `
      <div class="detail-item">
        <span class="detail-label">Notas del cliente:</span>
        <span class="detail-value">${notes}</span>
      </div>
      ` : ''}
      ${designs && designs.length > 0 ? `
      <div class="detail-item">
        <span class="detail-label">Diseños adjuntos:</span>
        <span class="detail-value">${designs.length} imagen(es) de referencia</span>
      </div>
      ` : ''}
    </div>
    
    <div class="message">
      <strong>⏰ Acción requerida:</strong><br>
      Ingresa al panel de administración para revisar la solicitud completa y proporcionar una cotización.<br><br>
      
      <a href="${baseUrl}/admin/cotizaciones" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 606;">
        Revisar cotización
      </a>
    </div>
  `;
  
  return createEmailTemplate(content, 'Equipo Admin');
};

module.exports = {
  quoteRespondedTemplate,
  newQuoteAdminTemplate,
};