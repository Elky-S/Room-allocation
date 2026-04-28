const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ייבוא הראוטרים
const roomRouter = require('./Routes/roomRoutes'); 
const placementRouter = require('./Routes/placementRoutes');

const app = express();
const port = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); 

// --- חיבור למסד נתונים ---
const dbURI = "mongodb+srv://nechami:fullstack123@db-room-allocation.6m8852d.mongodb.net/SchoolDB?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true";

mongoose
  .connect(dbURI)
  .then(() => console.log("✅ מחובר בהצלחה ל-MongoDB!"))
  .catch((err) => console.error("❌ שגיאת חיבור:", err));

// --- ניתובים (Routes) ---
app.use('/api/rooms', roomRouter);
app.use('/api/placements', placementRouter);

// נתיב בדיקה כללי
app.get("/", (req, res) => {
  res.send("השרת פועל כשורה!");
});

// --- הפעלת השרת ---
app.listen(port, () => {
  console.log(`🚀 השרת רץ בכתובת: http://localhost:${port}`);
});