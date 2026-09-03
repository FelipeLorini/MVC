/**
 * Erro de dominio esperado (nao e um bug), usado por services/middlewares
 * para sinalizar falhas de negocio (nao encontrado, sem permissao, etc).
 *
 * O middleware central de erros (middlewares/errorHandler.js) sabe
 * transformar esse erro em uma mensagem flash + redirecionamento,
 * evitando repetir try/catch + flash + redirect em cada controller.
 */
class AppError extends Error {
  /**
   * @param {string} message Mensagem amigavel exibida ao usuario (flash).
   * @param {number} statusCode Codigo HTTP semantico (400, 401, 403, 404, 409...).
   * @param {string|null} redirectTo Para onde redirecionar apos o erro.
   */
  constructor(message, statusCode = 400, redirectTo = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.redirectTo = redirectTo;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
