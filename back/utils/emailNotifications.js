const sendEmail = require('./sendEmail');
const emailTemplates = require('../templates');

/**
 * Envía email usando templates predefinidos
 * @param {string} templateType - Tipo de template a usar
 * @param {Object} data - Datos para el template
 * @param {string} to - Email destinatario
 * @param {string} subject - Asunto del email
 */
const sendTemplatedEmail = async (templateType, data, to, subject) => {
  try {
    let htmlContent;
    
    switch (templateType) {
      // Templates para clientes
      case 'appointment-confirmed':
        htmlContent = emailTemplates.appointmentConfirmedTemplate(data);
        break;
        
      case 'appointment-cancelled-by-admin':
        htmlContent = emailTemplates.appointmentCancelledByAdminTemplate(data);
        break;
        
      case 'appointment-rescheduled':
        htmlContent = emailTemplates.appointmentRescheduledTemplate(data);
        break;
        
      case 'new-appointment-request':
        htmlContent = emailTemplates.newAppointmentRequestTemplate(data);
        break;
        
      // Templates para admin
      case 'new-appointment-admin':
        htmlContent = emailTemplates.newAppointmentAdminTemplate(data);
        break;
        
      case 'appointment-cancelled-by-client-admin':
        htmlContent = emailTemplates.appointmentCancelledByClientAdminTemplate(data);
        break;
        
      case 'appointment-rescheduled-by-client-admin':
        htmlContent = emailTemplates.appointmentRescheduledByClientAdminTemplate(data);
        break;
        
      // Templates para cotizaciones
      case 'quote-responded':
        htmlContent = emailTemplates.quoteRespondedTemplate(data);
        break;
        
      case 'new-quote-admin':
        htmlContent = emailTemplates.newQuoteAdminTemplate(data);
        break;
        
      default:
        throw new Error(`Template type "${templateType}" no encontrado`);
    }
    
    await sendEmail({
      to,
      subject,
      html: htmlContent
    });
    
    console.log(`✅ Email templado "${templateType}" enviado a ${to}`);
    
  } catch (error) {
    console.error(`❌ Error enviando email templado "${templateType}":`, error.message);
    throw error;
  }
};

/**
 * Envía notificación de nueva cita al cliente
 */
const sendNewAppointmentNotification = async (appointmentData) => {
  const { clientName, clientEmail, service, requestedDate, notes } = appointmentData;
  
  await sendTemplatedEmail(
    'new-appointment-request',
    {
      clientName,
      service,
      date: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      notes
    },
    clientEmail,
    'Solicitud de Cita Recibida - King\'s Nail\'s'
  );
};

/**
 * Envía notificación de nueva cita al admin
 */
const sendNewAppointmentAdminNotification = async (appointmentData) => {
  const { clientName, clientEmail, clientPhone, service, requestedDate, notes } = appointmentData;
  
  await sendTemplatedEmail(
    'new-appointment-admin',
    {
      clientName,
      clientEmail,
      clientPhone,
      service,
      date: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      notes
    },
    process.env.ADMIN_EMAIL,
    `Nueva Solicitud de Cita - ${clientName}`
  );
};

/**
 * Envía confirmación de cita al cliente
 */
const sendAppointmentConfirmation = async (appointmentData) => {
  const { user, service, requestedDate, notes } = appointmentData;
  
  await sendTemplatedEmail(
    'appointment-confirmed',
    {
      clientName: user.name,
      service,
      date: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      notes
    },
    user.email,
    'Cita Confirmada - King\'s Nail\'s'
  );
};

/**
 * Envía notificación de cancelación por admin al cliente
 */
const sendAppointmentCancelledByAdmin = async (appointmentData, reason = '') => {
  const { user, service, requestedDate } = appointmentData;
  
  await sendTemplatedEmail(
    'appointment-cancelled-by-admin',
    {
      clientName: user.name,
      service,
      date: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      reason
    },
    user.email,
    'Cita Cancelada - King\'s Nail\'s'
  );
};

/**
 * Envía notificación de cancelación por cliente al admin
 */
const sendAppointmentCancelledByClientAdmin = async (appointmentData) => {
  const { clientName, clientEmail, service, requestedDate } = appointmentData;
  
  await sendTemplatedEmail(
    'appointment-cancelled-by-client-admin',
    {
      clientName,
      clientEmail,
      service,
      date: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      })
    },
    process.env.ADMIN_EMAIL,
    `Cita Cancelada por Cliente - ${clientName}`
  );
};

/**
 * Envía notificación de reagendación al cliente
 */
const sendAppointmentRescheduled = async (appointmentData, oldDate, rescheduledBy) => {
  const { user, service, requestedDate } = appointmentData;
  
  await sendTemplatedEmail(
    'appointment-rescheduled',
    {
      clientName: user.name,
      service,
      oldDate: new Date(oldDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      newDate: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      rescheduledBy
    },
    user.email,
    'Cita Reagendada - King\'s Nail\'s'
  );
};

/**
 * Envía notificación de reagendación por cliente al admin
 */
const sendAppointmentRescheduledByClientAdmin = async (appointmentData, oldDate, wasReactivated = false) => {
  const { user, service, requestedDate } = appointmentData;
  
  await sendTemplatedEmail(
    'appointment-rescheduled-by-client-admin',
    {
      clientName: user.name,
      clientEmail: user.email,
      service,
      oldDate: new Date(oldDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      newDate: new Date(requestedDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      wasReactivated
    },
    process.env.ADMIN_EMAIL,
    `Cita ${wasReactivated ? 'Reactivada y ' : ''}Reagendada - ${user.name}`
  );
};

/**
 * Envía notificación al admin cuando se recibe nueva cotización
 */
const sendNewQuoteAdminNotification = async (quoteData) => {
  const { user, service, notes, designs } = quoteData;
  
  await sendTemplatedEmail(
    'new-quote-admin',
    {
      clientName: user.name,
      clientEmail: user.email,
      service,
      notes,
      designs
    },
    process.env.ADMIN_EMAIL,
    `Nueva Cotización - ${user.name} - ${service}`
  );
};

/**
 * Envía notificación al cliente cuando su cotización fue respondida
 */
const sendQuoteResponseNotification = async (quoteData) => {
  const { user, service, adminPrice, adminComment, status, notes } = quoteData;
  
  let subject = '';
  if (status === 'quoted') {
    subject = '¡Tu cotización está lista! - King\'s Nail\'s';
  } else if (status === 'declined') {
    subject = 'Actualización de tu cotización - King\'s Nail\'s';
  }
  
  await sendTemplatedEmail(
    'quote-responded',
    {
      clientName: user.name,
      service,
      adminPrice,
      adminComment,
      status,
      notes
    },
    user.email,
    subject
  );
};

module.exports = {
  sendTemplatedEmail,
  sendNewAppointmentNotification,
  sendNewAppointmentAdminNotification,
  sendAppointmentConfirmation,
  sendAppointmentCancelledByAdmin,
  sendAppointmentCancelledByClientAdmin,
  sendAppointmentRescheduled,
  sendAppointmentRescheduledByClientAdmin,
  sendNewQuoteAdminNotification,
  sendQuoteResponseNotification
};