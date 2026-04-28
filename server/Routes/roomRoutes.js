const express = require('express');
const roomController = require('../controller/roomController');

const router = express.Router();

// נתיבים עבור הכתובת הבסיסית של חדרים (יחסי ל- /api/rooms)
router
  .route('/')
  .get(roomController.getAllRooms)   // GET http://localhost:3000/api/rooms
  .post(roomController.createRoom);  // POST http://localhost:3000/api/rooms

// נתיבים עבור חדר ספציפי לפי מזהה
router
  .route('/:id')
  .get(roomController.getRoom)       
  .patch(roomController.updateRoom)  
  .delete(roomController.deleteRoom); 

module.exports = router;