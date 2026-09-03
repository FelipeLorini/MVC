const pool = require('../config/db');

const EventModel = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS organizer_name
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       ORDER BY e.event_date ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS organizer_name
       FROM events e
       JOIN users u ON u.id = e.organizer_id
       WHERE e.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByOrganizer(organizerId) {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE organizer_id = ? ORDER BY event_date DESC',
      [organizerId]
    );
    return rows;
  },

  async create({ title, description, eventDate, location, capacity, organizerId }) {
    const [result] = await pool.query(
      `INSERT INTO events (title, description, event_date, location, capacity, organizer_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, eventDate, location, capacity, organizerId]
    );
    return result.insertId;
  },

  async update(id, { title, description, eventDate, location, capacity }) {
    await pool.query(
      `UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, capacity = ?
       WHERE id = ?`,
      [title, description, eventDate, location, capacity, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
  }
};

module.exports = EventModel;
