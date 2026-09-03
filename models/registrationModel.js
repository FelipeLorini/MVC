const pool = require('../config/db');

/**
 * Acesso a dados de inscricoes. Nenhuma regra de negocio aqui —
 * apenas leitura/escrita na tabela `registrations`, sempre via
 * prepared statements (?) para evitar SQL Injection.
 */
const RegistrationModel = {
  async create(eventId, userId) {
    const [result] = await pool.execute(
      'INSERT INTO registrations (event_id, user_id) VALUES (?, ?)',
      [eventId, userId]
    );
    return result.insertId;
  },

  async findByEventAndUser(eventId, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM registrations WHERE event_id = ? AND user_id = ? LIMIT 1',
      [eventId, userId]
    );
    return rows[0] || null;
  },

  async deleteByEventAndUser(eventId, userId) {
    await pool.execute(
      'DELETE FROM registrations WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );
  },

  /** @returns {Promise<number>} */
  async countByEvent(eventId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM registrations WHERE event_id = ?',
      [eventId]
    );
    return rows[0].total;
  },

  /** Lista os inscritos de um evento, com nome e e-mail. */
  async findByEvent(eventId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.name, u.email
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = ?
       ORDER BY r.created_at ASC`,
      [eventId]
    );
    return rows;
  },

  /** Lista as inscricoes de um usuario, com dados do evento. */
  async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT r.*, e.title, e.event_date, e.location
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = ?
       ORDER BY e.event_date ASC`,
      [userId]
    );
    return rows;
  }
};

module.exports = RegistrationModel;
