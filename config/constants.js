/**
 * Constantes compartilhadas pela aplicacao.
 * Centralizar aqui evita "magic strings" espalhadas pelo codigo.
 */

const ROLES = Object.freeze({
  ORGANIZER: 'organizador',
  PARTICIPANT: 'participante'
});

module.exports = { ROLES };
