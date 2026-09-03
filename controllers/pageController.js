const eventService = require('../services/eventService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Pagina inicial publica: destaca os proximos eventos.
 */
const home = asyncHandler(async (req, res) => {
  const events = await eventService.listEvents();
  res.render('home', {
    title: 'EventHub',
    featuredEvents: events.slice(0, 3),
    totalEvents: events.length
  });
});

module.exports = { home };
