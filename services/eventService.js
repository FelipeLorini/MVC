const EventModel = require('../models/eventModel');
const RegistrationModel = require('../models/registrationModel');
const AppError = require('../utils/AppError');

/** Lista todos os eventos cadastrados. */
async function listEvents() {
  return EventModel.findAll();
}

/**
 * Garante que o evento existe e pertence ao usuario informado.
 * Lanca AppError (404/403) quando a condicao nao e atendida.
 * @returns {Promise<object>} o proprio evento, quando valido
 */
async function assertOwnedEvent(eventId, currentUserId) {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new AppError('Evento não encontrado.', 404, '/events');
  }
  if (event.organizer_id !== currentUserId) {
    throw new AppError('Você não tem permissão para essa ação.', 403, '/events');
  }
  return event;
}

/**
 * Monta os dados completos da pagina de detalhe de um evento:
 * o evento em si, total de inscritos, se o usuario logado esta
 * inscrito e (somente para o organizador dono) a lista de inscritos.
 */
async function getEventDetail(eventId, currentUser) {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new AppError('Evento não encontrado.', 404, '/events');
  }

  const totalRegistrations = await RegistrationModel.countByEvent(event.id);

  let isRegistered = false;
  if (currentUser) {
    const registration = await RegistrationModel.findByEventAndUser(event.id, currentUser.id);
    isRegistered = !!registration;
  }

  let attendees = [];
  if (currentUser && currentUser.id === event.organizer_id) {
    attendees = await RegistrationModel.findByEvent(event.id);
  }

  return { event, totalRegistrations, isRegistered, attendees };
}

/** Cria um evento vinculado ao organizador informado. @returns {Promise<number>} ID criado */
async function createEvent(data, organizerId) {
  return EventModel.create({
    title: data.title,
    description: data.description,
    eventDate: data.eventDate,
    location: data.location,
    capacity: data.capacity ? parseInt(data.capacity, 10) : 0,
    organizerId
  });
}

/** Retorna o evento para edicao, garantindo que pertence ao usuario logado. */
async function getEventForEdit(eventId, currentUserId) {
  return assertOwnedEvent(eventId, currentUserId);
}

/** Atualiza um evento, garantindo que pertence ao usuario logado. */
async function updateEvent(eventId, data, currentUserId) {
  await assertOwnedEvent(eventId, currentUserId);
  await EventModel.update(eventId, {
    title: data.title,
    description: data.description,
    eventDate: data.eventDate,
    location: data.location,
    capacity: data.capacity ? parseInt(data.capacity, 10) : 0
  });
}

/** Remove um evento, garantindo que pertence ao usuario logado. */
async function deleteEvent(eventId, currentUserId) {
  await assertOwnedEvent(eventId, currentUserId);
  await EventModel.delete(eventId);
}

module.exports = {
  listEvents,
  getEventDetail,
  createEvent,
  getEventForEdit,
  updateEvent,
  deleteEvent
};
