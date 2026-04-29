const Room = require("../models/Rooms"); // וודאי שהנתיב למודל שיצרת נכון

// 1. יצירת חדר חדש (Create)
exports.createRoom = async (req, res) => {
  try {
    const newRoom = await Room.create(req.body);
    res.status(201).json({
      status: "success",
      data: { room: newRoom },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// 2. קבלת רשימת כל החדרים (Read - All)
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({
      status: "success",
      results: rooms.length,
      data: { rooms },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// 3. קבלת חדר ספציפי לפי ID (Read - One)
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("placements") // מציג את נתוני השיבוצים במקום רק ID
      .populate("cancellations"); // מציג את נתוני הביטולים

    if (!room) {
      return res.status(404).json({ status: "fail", message: "חדר לא נמצא" });
    }

    res.status(200).json({
      status: "success",
      data: { room },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// 4. עדכון פרטי חדר (Update)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after", //  מחזיר את האובייקט המעודכן(כתוב בגרסה מתקדמת)
      runValidators: true, // מפעיל את הולידציות שהגדרת בסכמה גם בעדכון
    });

    if (!room) {
      return res.status(404).json({ status: "fail", message: "חדר לא נמצא" });
    }

    res.status(200).json({
      status: "success",
      data: { room },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// 5. מחיקת חדר (Delete)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ status: "fail", message: "חדר לא נמצא" });
    }

    res.status(204).json({
      status: "success",
      data: null, // במחיקה מקובל לא להחזיר תוכן
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
