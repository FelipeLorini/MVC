const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Middleware central de tratamento de erros.
 *
 * - AppError (erro de dominio esperado): mostra a mensagem via flash
 *   e redireciona para o local mais adequado — elimina a repeticao de
 *   try/catch + flash + redirect em cada controller.
 * - Qualquer outro erro (bug/imprevisto): loga com detalhes e mostra
 *   uma pagina 500 generica, sem vazar detalhes internos ao usuario.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    req.flash('error', err.message);
    return res.redirect(err.redirectTo || '/events');
  }

  logger.error('Erro não tratado', err);
  return res.status(500).render('500', { title: 'Erro interno' });
}

module.exports = errorHandler;
