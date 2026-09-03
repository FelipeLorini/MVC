/**
 * Envolve uma controller/middleware assincrona e encaminha qualquer
 * rejeicao de Promise para o next(err), sem precisar repetir
 * try/catch em cada funcao assincrona da aplicacao.
 *
 * Uso: router.get('/eventos', asyncHandler(eventController.index));
 *
 * @param {Function} fn Funcao (req, res, next) => Promise
 * @returns {Function}
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
