import { NavLink } from "react-router-dom";
import "../css/style.css";
export const Nav = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">RoomMaster 🏫</div>
      <div className="nav-links">
        <NavLink to="/" className="link">
          דף הבית
        </NavLink>
        <NavLink to="/rooms" className="link">
          ניהול חדרים
        </NavLink>
        <NavLink to="/add-allocation" className="link">
          שיבוץ חדש
        </NavLink>
      </div>
    </nav>
  );
};
