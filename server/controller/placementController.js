const Placement = require('../models/Placement');

// 1. משיכת כל השיבוצים מהדאטהבייס
exports.getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find().populate('room');
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. הוספת שיבוץ חדש
exports.createPlacement = async (req, res) => {
    try {
        const newPlacement = await Placement.create(req.body);
        res.status(201).json(newPlacement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. מחיקת כל המערכת (השבוע)
exports.deleteAllPlacements = async (req, res) => {
    try {
        await Placement.deleteMany({}); // מוחק את הכל מה-DB
        res.json({ message: "כל המערכת נמחקה בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. מחיקת יום ספציפי
exports.deleteByDay = async (req, res) => {
    try {
        const { day } = req.params;
        await Placement.deleteMany({ day: day });
        res.json({ message: `כל השיבוצים ליום ${day} נמחקו` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. מציאת שעות פנויות (הלוגיקה המורכבת שהיא כתבה)
exports.getFreeSlots = async (req, res) => {
    try {
        const { day } = req.params;
        const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
        
        // שליפה מהדאטאבייס ומיון
        const dayShifts = await Placement.find({ day: day }).sort({ start: 1 });

        let freeSlots = [];
        let currentTime = hours[0];

        dayShifts.forEach(shift => {
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