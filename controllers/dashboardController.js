const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

/** Exibe o painel do usuario logado. */
const show = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardData(req.session.user);
  res.render('dashboard', { title: 'Meu painel', ...data });
});

module.exports = { show };
