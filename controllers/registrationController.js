const registrationService = require('../services/registrationService');
const asyncHandler = require('../utils/asyncHandler');

/** Inscreve o usuario logado em um evento. */
const register = asyncHandler(async (req, res) => {
  await registrationService.registerForEvent(req.params.id, req.session.user.id);
  req.flash('success', 'Inscrição realizada com sucesso!');
  res.redirect(`/events/${req.params.id}`);
});

/** Cancela a inscricao do usuario logado em um evento. */
const unregister = asyncHandler(async (req, res) => {
  await registrationService.cancelRegistration(req.params.id, req.session.user.id);
  req.flash('success', 'Inscrição cancelada.');
  res.redirect(`/events/${req.params.id}`);
});

module.exports = { register, unregister };
