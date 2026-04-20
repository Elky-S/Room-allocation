import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Rooms.css"; // ניצור קובץ עיצוב בהמשך

export const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // פותר את אזהרה 7:22
  const [viewMode, setViewMode] = useState("cards"); // פותר את אזהרה 8:20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const [response] = await Promise.all([
          axios.get("http://localhost:3000/all-rooms"),
          timer,
        ]);
        setRooms(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // סינון חדרים לפי שורת החיפוש
  const filteredRooms = rooms.filter((room) =>
    (room.roomNumber || room.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>טוען נתונים מהמסד...</p>
      </div>
    );

  return (
    <div className="rooms-page">
      <h1 className="page-header text-green">ניהול חדרים</h1>

      {/* אזור הבקרה - פותר את האזהרות על ידי שימוש בפונקציות */}
      <div className="controls-bar">
        <input
          type="text"
          placeholder="חפשי חדר..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="view-buttons">
          <button
            className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            🎴 כרטיסיות
          </button>
          <button
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            📊 טבלה
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="rooms-grid">
          {filteredRooms.map((room, index) => {
            const colors = [
              "border-pink",
              "border-orange",
              "border-yellow",
              "border-green",
            ];
            const cardColor = colors[index % colors.length];
            return (
              <div key={room._id} className={`room-card-modern ${cardColor}`}>
                <div className="card-emoji">🏛️</div>
                <h3>חדר {room.roomNumber || room.name}</h3>
                <div className="card-details">
                  <p>
                    👥 קיבולת: <strong>{room.capacity}</strong>
                  </p>
                  <p>
                    📍 קומה: <strong>{room.floor || "1"}</strong>
                  </p>
                </div>
                <button className="btn-manage">נהל חדר</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>מספר חדר</th>
                <th>קיבולת</th>
                <th>קומה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.roomNumber || room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.floor || "1"}</td>
                  <td>
                    <button className="small-btn">ערוך</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
