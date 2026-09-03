const eventService = require('../services/eventService');
const asyncHandler = require('../utils/asyncHandler');

/** Lista todos os eventos. */
const index = asyncHandler(async (req, res) => {
  const events = await eventService.listEvents();
  res.render('events/index', { title: 'Eventos', events });
});

/** Exibe os detalhes de um evento. */
const show = asyncHandler(async (req, res) => {
  const data = await eventService.getEventDetail(req.params.id, req.session.user);
  res.render('events/show', { title: data.event.title, ...data });
});

/** Exibe o formulario de criacao de evento. */
function showNew(req, res) {
  res.render('events/new', { title: 'Novo evento' });
}

/** Cria um novo evento vinculado ao organizador logado. */
const create = asyncHandler(async (req, res) => {
  const id = await eventService.createEvent(req.body, req.session.user.id);
  req.flash('success', 'Evento criado com sucesso!');
  res.redirect(`/events/${id}`);
});

/** Exibe o formulario de edicao de um evento. */
const showEdit = asyncHandler(async (req, res) => {
  const event = await eventService.getEventForEdit(req.params.id, req.session.user.id);
  res.render('events/edit', { title: 'Editar evento', event });
});

/** Atualiza um evento existente. */
const update = asyncHandler(async (req, res) => {
  await eventService.updateEvent(req.params.id, req.body, req.session.user.id);
  req.flash('success', 'Evento atualizado com sucesso!');
  res.redirect(`/events/${req.params.id}`);
});

/** Remove um evento. */
const destroy = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.session.user.id);
  req.flash('success', 'Evento removido.');
  res.redirect('/events');
});

module.exports = { index, show, showNew, create, showEdit, update, destroy };
