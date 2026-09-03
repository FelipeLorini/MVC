const pool = require('../config/db');

/**
 * Acesso a dados de usuarios. Nenhuma regra de negocio aqui —
 * apenas leitura/escrita na tabela `users`, sempre via prepared
 * statements (?) para evitar SQL Injection.
 */
const UserModel = {
  /**
   * @param {{name: string, email: string, passwordHash: string, role: string}} data
   * @returns {Promise<number>} ID do usuario criado
   */
  async create({ name, email, passwordHash, role }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  },

  /** @param {string} email @returns {Promise<object|null>} */
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  /** @param {number} id @returns {Promise<object|null>} usuario sem o hash da senha */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }
};

module.exports = UserModel;
