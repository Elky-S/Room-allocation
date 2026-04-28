import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title text-green">ניהול חדרים חכם</h1>
        <p className="hero-description">
          המערכת הצבעונית והיעילה ביותר לשיבוץ וניהול מרחבי למידה. הכל במקום
          אחד, פשוט ומהיר.
        </p>
        <div className="hero-actions">
          <button className="btn-rooms" onClick={() => navigate("/rooms")}>
            לניהול החדרים
          </button>
          <button
            className="btn-add"
            onClick={() => navigate("/add-allocation")}
          >
            שיבוץ חדש
          </button>
        </div>
      </section>

      {/* כרטיסיות תכונות עם הצבעים המבוקשים */}
      <div className="features-container">
        <div className="feat-card border-pink">
          <div className="feat-icon">🌸</div>
          <h3>קל לשימוש</h3>
          <p>ממשק נקי ופשוט שחוסך לכם זמן יקר בכל יום.</p>
        </div>
        <div className="feat-card border-orange">
          <div className="feat-icon">🍊</div>
          <h3>סדר בבלגן</h3>
          <p>ניהול חכם שמונע כפילויות בשיבוץ החדרים.</p>
        </div>
        <div className="feat-card border-yellow">
          <div className="feat-icon">💛</div>
          <h3>מהירות שיא</h3>
          <p>שליפת נתונים מהירה ישירות ממסד הנתונים.</p>
        </div>
        <div className="feat-card border-green">
          <div className="feat-icon">🍀</div>
          <h3>זמינות</h3>
          <p>בדקו זמינות חדרים בכל רגע ומכל מכשיר.</p>
        </div>
      </div>
    </div>
  );
};
