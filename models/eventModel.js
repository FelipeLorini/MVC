const pool = require('../config/db');

/**
 * Acesso a dados de eventos. Nenhuma regra de negocio aqui —
 * apenas leitura/escrita na tabela `events`, sempre via prepared
 * statements (?) para evitar SQL Injection.
 */
const EventModel = {
  /** Lista todos os eventos, com o nome do organizador, ordenados por data. */
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT e.*, u.name AS organizer_name
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       ORDER BY e.event_date ASC`
    );
    return rows;
  },

  /** @param {number} id @returns {Promise<object|null>} */
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.name AS organizer_name
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       WHERE e.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /** @param {number} organizerId @returns {Promise<object[]>} */
  async findByOrganizer(organizerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM events WHERE organizer_id = ? ORDER BY event_date DESC',
      [organizerId]
    );
    return rows;
  },

  /** @returns {Promise<number>} ID do evento criado */
  async create({ title, description, eventDate, location, capacity, organizerId }) {
    const [result] = await pool.execute(
      `INSERT INTO events (title, description, event_date, location, capacity, organizer_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, eventDate, location, capacity, organizerId]
    );
    return result.insertId;
  },

  async update(id, { title, description, eventDate, location, capacity }) {
    await pool.execute(
      `UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, capacity = ?
       WHERE id = ?`,
      [title, description, eventDate, location, capacity, id]
    );
  },

  async delete(id) {
    await pool.execute('DELETE FROM events WHERE id = ?', [id]);
  }
};

module.exports = EventModel;
