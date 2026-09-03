const EventModel = require('../models/eventModel');
const RegistrationModel = require('../models/registrationModel');
const { ROLES } = require('../config/constants');

/**
 * Monta os dados do painel do usuario logado: eventos criados
 * (quando organizador) e inscricoes feitas.
 */
async function getDashboardData(user) {
  const myEvents = user.role === ROLES.ORGANIZER
    ? await EventModel.findByOrganizer(user.id)
    : [];
  const registrations = await RegistrationModel.findByUser(user.id);
  return { myEvents, registrations };
}

module.exports = { getDashboardData };
