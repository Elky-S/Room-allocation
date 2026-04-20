const express = require("express"); // ייבוא הספריה
const app = express();
const port = 3000; // הגדרת פורט (נמל) להאזנה
const Rooms = require("./models/Rooms");
const cors = require("cors");
app.use(cors());
// הגדרת נתיב ראשי - מה קורה כשנכנסים לאתר
app.get("/", (req, res) => {
  res.send("ברוכים הבאים לשרת ה-Node.js החדש שלי!");
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`השרת רץ בכתובת: http://localhost:${port}`);
});

const mongoose = require("mongoose");

// מחרוזת החיבור שלך (שימי לב להוסיף את הפרמטר לנטפרי אם צריך)
const dbURI =
  "mongodb+srv://nechami:fullstack123@db-room-allocation.6m8852d.mongodb.net/SchoolDB?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true";

mongoose
  .connect(dbURI)
  .then(() => console.log("מחובר בהצלחה ל-MongoDB!"))
  .catch((err) => console.error("שגיאת חיבור:", err));

app.get("/test-rooms", async (req, res) => {
  try {
    console.log("מנסה לשלוף נתונים מהדאטא...");
    const data = await Rooms.find(); // Rooms הוא המודל שייבאת
    console.log("נתונים שנמצאו:", data);
    res.json(data);
  } catch (err) {
    console.error("שגיאה בשליפה:", err);
    res.status(500).send(err.message);
  }
});

// נתיב שמחזיר את כל החדרים מהדאתא
app.get("/all-rooms", async (req, res) => {
  try {
    // שליפת כל המסמכים מהאוסף (Collection)
    const rooms = await Rooms.find();

    // שליחת הנתונים חזרה ללקוח בפורמט JSON
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send("שגיאת שרת בשליפת הנתונים");
  }
  app.disable("etag");
});
