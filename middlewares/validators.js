const AppError = require('../utils/AppError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida os campos do formulario de cadastro. */
function validateRegistration(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return next(new AppError('Preencha todos os campos obrigatórios.', 400, '/auth/register'));
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return next(new AppError('Informe um e-mail válido.', 400, '/auth/register'));
  }
  if (password.length < 6) {
    return next(new AppError('A senha deve ter pelo menos 6 caracteres.', 400, '/auth/register'));
  }
  return next();
}

/** Valida os campos do formulario de login. */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !email.trim() || !password) {
    return next(new AppError('Informe e-mail e senha.', 400, '/auth/login'));
  }
  return next();
}

/** Valida os campos do formulario de evento (criacao e edicao). */
function validateEvent(req, res, next) {
  const { title, eventDate, capacity } = req.body;
  const redirectTo = req.params.id ? `/events/${req.params.id}/edit` : '/events/new';

  if (!title || !title.trim() || !eventDate) {
    return next(new AppError('Título e data são obrigatórios.', 400, redirectTo));
  }
  if (capacity !== undefined && capacity !== '' && (Number.isNaN(Number(capacity)) || Number(capacity) < 0)) {
    return next(new AppError('Capacidade deve ser um número válido (0 ou mais).', 400, redirectTo));
  }
  return next();
}

module.exports = { validateRegistration, validateLogin, validateEvent };
