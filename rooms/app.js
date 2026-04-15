const express = require('express'); // ייבוא הספריה
const app = express();
const port = 3000; // הגדרת פורט (נמל) להאזנה

// הגדרת נתיב ראשי - מה קורה כשנכנסים לאתר
app.get('/', (req, res) => {
  res.send('ברוכים הבאים לשרת ה-Node.js החדש שלי!');
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`השרת רץ בכתובת: http://localhost:${port}`);
});