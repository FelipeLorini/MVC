const EventModel = require('../models/eventModel');
const RegistrationModel = require('../models/registrationModel');
const AppError = require('../utils/AppError');

/**
 * Inscreve um usuario em um evento, respeitando duplicidade e capacidade maxima.
 */
async function registerForEvent(eventId, userId) {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new AppError('Evento não encontrado.', 404, '/events');
  }

  const already = await RegistrationModel.findByEventAndUser(eventId, userId);
  if (already) {
    throw new AppError('Você já está inscrito neste evento.', 409, `/events/${eventId}`);
  }

  if (event.capacity > 0) {
    const total = await RegistrationModel.countByEvent(eventId);
    if (total >= event.capacity) {
      throw new AppError('Este evento já atingiu a capacidade máxima.', 409, `/events/${eventId}`);
    }
  }

  await RegistrationModel.create(eventId, userId);
}

/** Cancela a inscricao de um usuario em um evento. */
async function cancelRegistration(eventId, userId) {
  await RegistrationModel.deleteByEventAndUser(eventId, userId);
}

module.exports = { registerForEvent, cancelRegistration };
