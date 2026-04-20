const mongoose = require('mongoose'); // ייבוא ספריית mongoose לצורך עבודה עם מסד הנתונים

const roomSchema = new mongoose.Schema({ // הגדרת מבנה הנתונים (Schema) עבור חדר
  roomNumber: { // הגדרת שדה מספר/שם החדר
    type: String, // סוג הנתון הוא מחרוזת (טקסט) כדי לתמוך גם ב"מחשבים 1" או "אולם"
    required: [true, 'חובה להזין שם או מספר חדר'], // שדה חובה, מחזיר שגיאה אם חסר
    unique: true, // מבטיח שלא יהיו שני חדרים עם אותו שם במערכת
    trim: true // מסיר רווחים מיותרים בטעות מהתחלה ומהסוף
  },
  roomType: { // הגדרת סוג החדר
    type: String, // סוג הנתון הוא טקסט
    enum: ['רגיל', 'מחשבים', 'אולם'], // מגביל את האפשרויות רק לערכים האלו
    default: 'רגיל', // אם לא נבחר סוג, המערכת תניח שזה חדר רגיל
    required: true // שדה חובה לבחירה
  },
  floor: { // הגדרת שדה הקומה (מוזן ידנית מה-Frontend)
    type: Number, // סוג הנתון הוא מספר
    required: [true, 'חובה להזין קומה'] // שדה חובה
  },
  side: { // הגדרת שדה האגף או הצד (אמצע/ימין/שמאל)
    type: String, // סוג הנתון הוא טקסט
    enum: ['אמצע', 'ימין', 'שמאל'], // מגביל את הבחירה לאפשרויות הללו בלבד
    required: [true, 'חובה להזין אגף/צד'] // שדה חובה
  },
  wing: { // הגדרת מספר החדר בתוך האגף (מוזן ידנית)
    type: Number, // סוג הנתון הוא מספר
    required: [true, 'חובה להזין מספר באגף'] // שדה חובה
  },
  hasProjector: { // שדה המציין האם קיים מקרן בחדר
    type: Boolean, // סוג הנתון הוא בוליאני (אמת/שקר)
    default: false // ברירת המחדל היא שאין מקרן
  },
  isSafeRoom: { // שדה המציין האם החדר הוא מרחב מוגן (ממ"ד)
    type: Boolean, // סוג הנתון הוא בוליאני
    default: false // ברירת המחדל היא שלא
  },
  capacity: { // הגדרת כמות האנשים המקסימלית שהחדר מכיל
    type: Number, // סוג הנתון הוא מספר
    required: [true, 'חובה להזין כמות אנשים'] // שדה חובה
  },
  placements: [{ // מערך המכיל קישורים לשיבוצים של החדר
    type: mongoose.Schema.Types.ObjectId, // שומר רק את המזהה הייחודי (ID) של השיבוץ
    ref: 'Placement' // מצביע לסכמת ה-Placement (תיבנה בהמשך על ידי בת אחרת)
  }],
  cancellations: [{ // מערך המכיל קישורים לביטולים של החדר
    type: mongoose.Schema.Types.ObjectId, // שומר רק את המזהה הייחודי (ID) של הביטול
    ref: 'Cancellation' // מצביע לסכמת ה-Cancellation (תיבנה בהמשך)
  }]
}, { 
  timestamps: true // מוסיף אוטומטית שדות זמן יצירה (createdAt) וזמן עדכון (updatedAt)
});

const Room = mongoose.model('Room', roomSchema); // יצירת המודל מתוך הסכמה כדי שנוכל לבצע פעולות ב-DB
module.exports = Room; // ייצוא המודל כדי שיהיה זמין לשימוש ב-Controller ובנתיבים (Routes)

