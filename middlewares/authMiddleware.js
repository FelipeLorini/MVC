const AppError = require('../utils/AppError');

/** Bloqueia o acesso de quem nao estiver logado. */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return next(new AppError('Você precisa estar logado para acessar esta página.', 401, '/auth/login'));
  }
  return next();
}

/** Bloqueia o acesso de quem nao tiver o papel (role) informado. */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return next(new AppError('Você precisa estar logado.', 401, '/auth/login'));
    }
    if (req.session.user.role !== role) {
      return next(new AppError('Você não tem permissão para acessar esta página.', 403, '/events'));
    }
    return next();
  };
}

/** Disponibiliza o usuario logado (ou null) para todas as views via res.locals. */
function attachUser(req, res, next) {
  res.locals.currentUser = (req.session && req.session.user) || null;
  next();
}

module.exports = { requireAuth, requireRole, attachUser };
