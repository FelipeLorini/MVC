const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/** Exibe o formulario de cadastro. */
function showRegister(req, res) {
  res.render('auth/register', { title: 'Criar conta' });
}

/** Cria um novo usuario e inicia a sessao. */
const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  req.session.user = user;
  req.flash('success', 'Cadastro realizado com sucesso! Bem-vindo(a) ao EventHub.');
  res.redirect('/events');
});

/** Exibe o formulario de login. */
function showLogin(req, res) {
  res.render('auth/login', { title: 'Entrar' });
}

/** Autentica o usuario e inicia a sessao. */
const login = asyncHandler(async (req, res) => {
  const user = await authService.authenticateUser(req.body);
  req.session.user = user;
  req.flash('success', `Bem-vindo(a) de volta, ${user.name.split(' ')[0]}!`);
  res.redirect('/events');
});

/** Encerra a sessao do usuario (logout). */
function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
}

module.exports = { showRegister, register, showLogin, login, logout };
