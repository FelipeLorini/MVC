const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateEvent } = require('../middlewares/validators');
const { ROLES } = require('../config/constants');

router.get('/', eventController.index);
router.get('/new', requireAuth, requireRole(ROLES.ORGANIZER), eventController.showNew);
router.post('/', requireAuth, requireRole(ROLES.ORGANIZER), validateEvent, eventController.create);
router.get('/:id', eventController.show);
router.get('/:id/edit', requireAuth, requireRole(ROLES.ORGANIZER), eventController.showEdit);
router.put('/:id', requireAuth, requireRole(ROLES.ORGANIZER), validateEvent, eventController.update);
router.delete('/:id', requireAuth, requireRole(ROLES.ORGANIZER), eventController.destroy);

router.post('/:id/register', requireAuth, registrationController.register);
router.delete('/:id/register', requireAuth, registrationController.unregister);

module.exports = router;
