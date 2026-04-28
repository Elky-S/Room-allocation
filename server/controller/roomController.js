const Room = require('../models/Rooms'); // וודאי שהנתיב למודל שיצרת נכון

// 1. יצירת חדר חדש (Create)
exports.createRoom = async (req, res) => {
  try {
    const newRoom = await Room.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { room: newRoom }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// 2. קבלת רשימת כל החדרים (Read - All)
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({
      status: 'success',
      results: rooms.length,
      data: { rooms }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// 3. קבלת חדר ספציפי לפי ID (Read - One)
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('placements')    // מציג את נתוני השיבוצים במקום רק ID
      .populate('cancellations'); // מציג את נתוני הביטולים

    if (!room) {
      return res.status(404).json({ status: 'fail', message: 'חדר לא נמצא' });
    }

    res.status(200).json({
      status: 'success',
      data: { room }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// 4. עדכון פרטי חדר (Update)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // מחזיר את האובייקט המעודכן
      runValidators: true // מפעיל את הולידציות שהגדרת בסכמה גם בעדכון
    });

    if (!room) {
      return res.status(404).json({ status: 'fail', message: 'חדר לא נמצא' });
    }

    res.status(200).json({
      status: 'success',
      data: { room }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// 5. מחיקת חדר (Delete)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ status: 'fail', message: 'חדר לא נמצא' });
    }

    res.status(204).json({
      status: 'success',
      data: null // במחיקה מקובל לא להחזיר תוכן
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// פונקציה לחיפוש חדר פנוי לפי פרמטרים וזמינות
exports.searchAvailableRooms = async (req, res) => {
  try {
    // 1. חילוץ הפרמטרים שנשלחו מהמשתמש (בשאילתה - Query)
    const { day, start, end, roomType, capacity, hasProjector, isSafeRoom } = req.query;

    // 2. יצירת אובייקט סינון עבור התכונות הפיזיות של החדר
    let roomFilters = {};
    
    // אם המשתמש ביקש סוג חדר ספציפי - נוסיף לסינון
    if (roomType) roomFilters.roomType = roomType;
    
    // אם ביקש קיבולת - נחפש חדר שגדול או שווה (gte) לכמות המבוקשת
    if (capacity) roomFilters.capacity = { $gte: Number(capacity) };
    
    // אם ביקש מקרן - נסנן לפי חדרים שיש בהם מקרן (true)
    if (hasProjector) roomFilters.hasProjector = hasProjector === 'true';
    
    // אם ביקש ממ"ד - נסנן בהתאם
    if (isSafeRoom) roomFilters.isSafeRoom = isSafeRoom === 'true';

    // 3. מציאת כל השיבוצים שתופסים חדרים ביום ובשעות המבוקשים
    // אנחנו מחפשים כל שיבוץ שחופף לטווח הזמנים (מתחיל לפני הסיום ומסתיים אחרי ההתחלה)
    const busyPlacements = await Placement.find({
      day: day,
      $or: [
        { start: { $lt: end }, end: { $gt: start } }
      ]
    });

    // 4. יצירת רשימה של ה-ID של כל החדרים התפוסים כרגע
    const busyRoomIds = busyPlacements.map(p => p.room);

    // 5. השלב הסופי: חיפוש חדרים שעונים על הסינון ואינם ברשימת התפוסים
    const availableRooms = await Room.find({
      ...roomFilters,             // פירוק התכונות הפיזיות לתוך השאילתה
      _id: { $nin: busyRoomIds }  // בחירת חדרים שה-ID שלהם "לא נמצא" ($nin) ברשימת התפוסים
    });

    // 6. החזרת התוצאה למשתמש
    res.status(200).json({
      status: 'success',
      results: availableRooms.length,
      data: { rooms: availableRooms }
    });

  } catch (err) {
    // טיפול בשגיאות במקרה שמשהו השתבש
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};