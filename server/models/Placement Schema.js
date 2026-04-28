const mongoose = require('mongoose');

// הגדרת הסכמה עבור שיבוץ (Placement)
const placementSchema = new mongoose.Schema({
  
  // קישור ייחודי לחדר מתוך מסד הנתונים (מחבר בין השיבוץ לחדר ספציפי)
  room: {
    type: mongoose.Schema.Types.ObjectId, // שומר את המזהה (ID) של החדר
    ref: 'Room',                          // מצביע למודל שנקרא 'Room'
    required: [true, 'חובה לקשר חדר לשיבוץ'] 
  },
  
  // היום בשבוע בו מתקיים השיבוץ
  day: {
    type: String,                         // סוג נתון: טקסט
    required: [true, 'חובה להזין יום'],    // שדה חובה
    enum: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'] // מגביל את הבחירה לימים אלו בלבד
  },

  // שעת תחילת השיעור/השיבוץ (בפורמט "HH:mm")
  start: {
    type: String,                         // שומרים כטקסט (למשל "08:00")
    required: [true, 'חובה להזין שעת התחלה']
  },

  // שעת סיום השיעור/השיבוץ (בפורמט "HH:mm")
  end: {
    type: String,                         // שומרים כטקסט (למשל "09:30")
    required: [true, 'חובה להזין שעת סיום']
  },

  // שם המורה המלמד בחדר בזמן זה
  teacher: {
    type: String,                         // סוג נתון: טקסט
    required: [true, 'חובה להזין שם מורה'],
    trim: true                            // מנקה רווחים מיותרים מהשוליים
  },

  // שם המקצוע או השיעור שנלמד
  lesson: {
    type: String,                         // סוג נתון: טקסט
    required: [true, 'חובה להזין שם שיעור'],
    trim: true
  },

  // הגדרה האם זה שיבוץ קבוע במערכת השעות או משהו חד פעמי
  isPermanent: {
    type: Boolean,                        // סוג נתון: אמת/שקר (true/false)
    default: true                         // ברירת המחדל היא שהשיבוץ קבוע
  },

  // תאריך ספציפי (רלוונטי רק אם השיבוץ זמני/חד-פעמי)
  date: {
    type: Date,                           // סוג נתון: תאריך מלא
    // פונקציה שבודקת: אם השיבוץ לא קבוע (isPermanent: false), אז חובה להזין תאריך
    required: function() { return !this.isPermanent; } 
  }

}, { 
  // מוסיף אוטומטית שדות של זמן יצירת השיבוץ וזמן עדכון אחרון
  timestamps: true 
});

// יצירת המודל מתוך הסכמה כדי שנוכל לבצע פעולות (שמירה, מחיקה, חיפוש)
const Placement = mongoose.model('Placement', placementSchema);

// ייצוא המודל כדי שנוכל להשתמש בו בקבצים אחרים (כמו ב-Controller שלך)
module.exports = Placement;