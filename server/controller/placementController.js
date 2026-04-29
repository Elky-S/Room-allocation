const Placement = require("../models/Placement");

// 1. משיכת כל השיבוצים מהדאטהבייס
exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().populate("room");
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. הוספת שיבוץ חדש עם בדיקת חפיפה
exports.createPlacement = async (req, res) => {
  const { room, day, start, end } = req.body;

  try {
    // --- לוגיקה לבדיקת חפיפת שעות ---
    // מחפשים שיבוץ קיים באותו חדר ובאותו יום
    const existingPlacement = await Placement.findOne({
      room: room,
      day: day,
      $or: [
        {
          // מקרה 1: השיבוץ החדש מתחיל בתוך טווח של שיבוץ קיים
          start: { $lte: start },
          end: { $gt: start },
        },
        {
          // מקרה 2: השיבוץ החדש מסתיים בתוך טווח של שיבוץ קיים
          start: { $lt: end },
          end: { $gte: end },
        },
        {
          // מקרה 3: השיבוץ החדש "עוטף" שיבוץ קיים (מתחיל לפני ומסתיים אחרי)
          start: { $gte: start },
          end: { $lte: end },
        },
      ],
    });

    if (existingPlacement) {
      return res.status(400).json({
        message: `החדר כבר תפוס ביום ${day} בין השעות ${existingPlacement.start}-${existingPlacement.end}`,
      });
    }
    // --- סוף בדיקת חפיפה ---

    // אם לא נמצאה חפיפה, יוצרים את השיבוץ
    const newPlacement = await Placement.create(req.body);
    res.status(201).json(newPlacement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. מחיקת המערכת (שבועית) - תומך בכלל המערכת או בחדר ספציפי
exports.deleteAllPlacements = async (req, res) => {
  try {
    const { room } = req.query; // קבלת החדר מה-Query String
    let filter = {};

    if (room) {
      filter.room = room; // אם נשלח חדר, נמחק רק את השיבוצים שלו
    }

    await Placement.deleteMany(filter);

    const message = room
      ? `המערכת השבועית לחדר נמחקה בהצלחה`
      : "כל המערכת המוסדית נמחקה בהצלחה";
    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. מחיקת יום ספציפי
// דוגמה לתיקון בשרת עבור מחיקת יום
exports.deleteByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const { room } = req.query; // בדיקה אם שלחנו חדר ספציפי

    let filter = { day: day };
    if (room) filter.room = room; // אם יש חדר, מוסיפים אותו לפילטר

    await Placement.deleteMany(filter);
    res.json({ message: `נמחקו השיבוצים` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// מחיקת שיבוץ ספיציפי
exports.deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "השיבוץ בוטל בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 5. מציאת שעות פנויות (הלוגיקה המורכבת שהיא כתבה)
exports.getFreeSlots = async (req, res) => {
  try {
    const { day } = req.params;
    const hours = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // שליפה מהדאטאבייס ומיון
    const dayShifts = await Placement.find({ day: day }).sort({ start: 1 });

    let freeSlots = [];
    let currentTime = hours[0];

    dayShifts.forEach((shift) => {
      if (shift.start > currentTime) {
        freeSlots.push(`${currentTime} - ${shift.start}`);
      }
      if (shift.end > currentTime) {
        currentTime = shift.end;
      }
    });

    if (currentTime < hours[hours.length - 1]) {
      freeSlots.push(`${currentTime} - ${hours[hours.length - 1]}`);
    }

    res.json(freeSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
