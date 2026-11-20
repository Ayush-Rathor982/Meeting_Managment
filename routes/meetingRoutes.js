const express = require('express');
const router = express.Router();

const meetingController = require('../controllers/meetingControllers');

router.get('/',meetingController.getMeetings)
router.post('/',meetingController.addMeeting);
router.delete('/:id',meetingController.deleteMeeting)
router.put('/:id',meetingController.updateMeeting)

module.exports = router;