const mongoose = require('mongoose'); // ייבוא ספריית mongoose לעבודה עם ה-DB

// הגדרת המבנה (Schema) של ביטול שיבוץ
const cancellationSchema = new mongoose.Schema({
  
  // קישור לחדר הספציפי שבו בוטל השיעור
  room: {
    type: mongoose.Schema.Types.ObjectId, // שמירת ה-ID הייחודי של החדר
    ref: 'Room',                          // הצבעה למודל ה-Room שחברה אחרת יצרה
    required: [true, 'חובה לציין איזה חדר מבוטל'] // שדה חובה
  },

  // התאריך המדויק שבו הביטול קורה (למשל: 2024-05-20)
  date: {
    type: Date,                           // סוג הנתון הוא תאריך
    required: [true, 'חובה להזין את תאריך הביטול'] // שדה חובה
  },

  // שעת תחילת הזמן שהתפנה (למשל: "08:00")
  start: {
    type: String,                         // נשמר כטקסט לצורך השוואה קלה
    required: [true, 'חובה להזין שעת התחלה של הביטול']
  },

  // שעת סיום הזמן שהתפנה (למשל: "09:30")
  end: {
    type: String,                         // נשמר כטקסט
    required: [true, 'חובה להזין שעת סיום של הביטול']
  },

  // הערה אופציונלית לסיבת הביטול (למשל: "מורה חולה")
  reason: {
    type: String,                         // סוג נתון: טקסט
    trim: true                            // ניקוי רווחים מיותרים מהצדדים
  }

}, { 
  timestamps: true // הוספה אוטומטית של זמן יצירת ועדכון הרשומה
});

// יצירת המודל מתוך הסכמה
const Cancellation = mongoose.model('Cancellation', cancellationSchema);

// ייצוא המודל לשימוש ב-Controller שלך
module.exports = Cancellation;