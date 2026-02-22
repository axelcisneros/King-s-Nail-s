const { createEmailTemplate } = require('./emailTemplate');
const {
  appointmentConfirmedTemplate,
  appointmentCancelledByAdminTemplate,
  appointmentRescheduledTemplate,
  newAppointmentRequestTemplate
} = require('./appointmentTemplates');

const {
  newAppointmentAdminTemplate,
  appointmentCancelledByClientAdminTemplate,
  appointmentRescheduledByClientAdminTemplate
} = require('./adminTemplates');

const {
  quoteRespondedTemplate,
  newQuoteAdminTemplate
} = require('./quoteTemplates');

module.exports = {
  // Template base
  createEmailTemplate,
  
  // Templates for clients
  appointmentConfirmedTemplate,
  appointmentCancelledByAdminTemplate,
  appointmentRescheduledTemplate,
  newAppointmentRequestTemplate,
  quoteRespondedTemplate,
  
  // Templates for admin
  newAppointmentAdminTemplate,
  appointmentCancelledByClientAdminTemplate,
  appointmentRescheduledByClientAdminTemplate,
  newQuoteAdminTemplate
};