const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const { ROLES } = require('../config/constants');

const SALT_ROUNDS = 10;

/**
 * Registra um novo usuario garantindo e-mail unico e senha hasheada com bcrypt.
 * @param {{name: string, email: string, password: string, role: string}} data
 * @returns {Promise<{id: number, name: string, email: string, role: string}>}
 */
async function registerUser({ name, email, password, role }) {
  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw new AppError('Este e-mail já está cadastrado.', 409, '/auth/register');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const finalRole = role === ROLES.ORGANIZER ? ROLES.ORGANIZER : ROLES.PARTICIPANT;
  const id = await UserModel.create({ name, email, passwordHash, role: finalRole });

  return { id, name, email, role: finalRole };
}

/**
 * Autentica um usuario comparando a senha informada com o hash bcrypt armazenado.
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<{id: number, name: string, email: string, role: string}>}
 */
async function authenticateUser({ email, password }) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError('E-mail ou senha inválidos.', 401, '/auth/login');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError('E-mail ou senha inválidos.', 401, '/auth/login');
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = { registerUser, authenticateUser };
