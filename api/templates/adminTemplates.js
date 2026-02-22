const { createEmailTemplate } = require('./emailTemplate');

// Template para nueva cita solicitada (notificación al admin)
const newAppointmentAdminTemplate = (appointmentData) => {
  const { clientName, clientEmail, clientPhone, service, date, notes } = appointmentData;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const content = `
    <div class="message">
      🔔 <strong>¡Nueva solicitud de cita recibida!</strong> Un cliente ha solicitado una cita a través del sitio web y necesita tu atención.
    </div>
    
    <div class="highlight-box">
      <h3>👤 Información del Cliente</h3>
      <div class="detail-item">
        <span class="detail-label">Nombre:</span>
        <span class="detail-value" style="color: #1f2937; font-weight: 600;">${clientName}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${clientEmail}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Teléfono:</span>
        <span class="detail-value" style="color: #059669; font-weight: 600;">${clientPhone}</span>
      </div>
    </div>
    
    <div class="highlight-box">
      <h3>📅 Detalles de la Cita Solicitada</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value" style="color: #7c3aed; font-weight: 600;">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha Solicitada:</span>
        <span class="detail-value" style="color: #dc2626; font-weight: 600;">${date}</span>
      </div>
      ${notes ? `
      <div class="detail-item">
        <span class="detail-label">Notas del Cliente:</span>
        <span class="detail-value" style="background-color: #f3f4f6; padding: 8px; border-radius: 4px; font-style: italic;">${notes}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="message">
      <strong>⚡ Acciones requeridas:</strong><br><br>
      
      <strong>Pasos a seguir:</strong><br>
      • Revisar disponibilidad en la fecha solicitada<br>
      • Confirmar o proponer alternativas de fecha/hora<br>
      • Contactar al cliente por teléfono si es necesario<br>
      • Actualizar el estado en el panel de administración<br><br>
      
      <a href="${baseUrl}/admin/citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Gestionar cita
      </a>
    </div>
    
    <div class="message" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>💡 Recordatorio:</strong><br>
      Se recomienda responder a las solicitudes de cita dentro de las 24 horas para brindar la mejor experiencia al cliente.
  `;
  
  return createEmailTemplate(content, 'Equipo Admin');
};

// Template para cita cancelada por cliente (notificación al admin)
const appointmentCancelledByClientAdminTemplate = (appointmentData) => {
  const { clientName, clientEmail, service, date } = appointmentData;
  
  const content = `
    <div class="message">
      <strong>Cita cancelada por el cliente</strong> - Se ha liberado un espacio en la agenda.
    </div>
    
    <div class="highlight-box">
      <h3>👤 Cliente que Canceló</h3>
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
      <h3>📅 Detalles de la Cita Cancelada</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha y Hora:</span>
        <span class="detail-value">${date}</span>
      </div>
    </div>
    
    <div class="message">
      <strong>💡 Oportunidades disponibles:</strong><br><br>
      
      <strong>Considera estas acciones:</strong><br>
      • Ofrecer este horario a clientes en lista de espera<br>
      • Contactar clientes que pidieron fechas similares<br>
      • Actualizar disponibilidad en redes sociales<br>
      • Revisar si hay solicitudes pendientes para esta fecha<br><br>
      
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Ver agenda disponible
      </a>
    </div>
    
    <div class="message" style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>✅ Todo automatizado:</strong><br>
      La cancelación fue procesada automáticamente. El horario ya está disponible para nuevas reservas.
    </div>
  `;
  
  return createEmailTemplate(content, 'Equipo Admin');
};

// Template para cita reagendada por cliente (notificación al admin)
const appointmentRescheduledByClientAdminTemplate = (appointmentData) => {
  const { clientName, clientEmail, service, oldDate, newDate, wasReactivated } = appointmentData;
  
  const content = `
    <div class="message">
      <strong>${wasReactivated ? 'Cita reactivada y reagendada' : 'Cita reagendada'} por el cliente</strong> - Requiere tu confirmación.
    </div>
    
    <div class="highlight-box">
      <h3>👤 Cliente</h3>
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
      <h3>📅 Cambios en la Cita</h3>
      <div class="detail-item">
        <span class="detail-label">Servicio:</span>
        <span class="detail-value">${service}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Estado Anterior:</span>
        <span class="detail-value">${wasReactivated ? 'Cancelada por admin' : 'Activa'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Fecha Anterior:</span>
        <span class="detail-value">${oldDate}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Nueva Fecha:</span>
        <span class="detail-value" style="color: #27ae60; font-weight: bold;">${newDate}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Estado Actual:</span>
        <span class="detail-value" style="color: #f39c12;">Pendiente de confirmación</span>
      </div>
    </div>
    
    <div class="message">
      <strong>⚡ Acción requerida:</strong><br><br>
      
      <strong>Pasos a seguir:</strong><br>
      • Revisar disponibilidad para la nueva fecha solicitada<br>
      • Confirmar o rechazar la reagendación en el sistema<br>
      ${wasReactivated ? '• Nota: La cliente ha reactivado una cita previamente cancelada<br>' : ''}
      • Contactar al cliente si hay conflictos de horario<br><br>
      
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/citas" 
         class="button" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 15px 0;">
        Revisar y confirmar
      </a>
    </div>
    
    <div class="message" style="background-color: ${wasReactivated ? '#fef3f2' : '#fefbf2'}; border-left: 4px solid ${wasReactivated ? '#f87171' : '#f59e0b'}; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong>${wasReactivated ? '🔄 Cita reactivada:' : '📝 Estado actual:'}</strong><br>
      ${wasReactivated ? 'La cliente ha reactivado una cita previamente cancelada y necesita confirmación.' : 'La cita está pendiente de confirmación para la nueva fecha.'}
    </div>
  `;
  
  return createEmailTemplate(content, 'Equipo Admin');
};

module.exports = {
  newAppointmentAdminTemplate,
  appointmentCancelledByClientAdminTemplate,
  appointmentRescheduledByClientAdminTemplate
};