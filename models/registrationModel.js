const pool = require('../config/db');

const RegistrationModel = {
  async create(eventId, userId) {
    const [result] = await pool.query(
      'INSERT INTO registrations (event_id, user_id) VALUES (?, ?)',
      [eventId, userId]
    );
    return result.insertId;
  },

  async findByEventAndUser(eventId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM registrations WHERE event_id = ? AND user_id = ? LIMIT 1',
      [eventId, userId]
    );
    return rows[0] || null;
  },

  async deleteByEventAndUser(eventId, userId) {
    await pool.query(
      'DELETE FROM registrations WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );
  },

  async countByEvent(eventId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM registrations WHERE event_id = ?',
      [eventId]
    );
    return rows[0].total;
  },

  async findByEvent(eventId) {
    const [rows] = await pool.query(
      `SELECT r.*, u.name, u.email
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = ?
       ORDER BY r.created_at ASC`,
      [eventId]
    );
    return rows;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
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
