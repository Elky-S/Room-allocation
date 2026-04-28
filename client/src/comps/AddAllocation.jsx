import { useState, useEffect } from "react";
import axios from "axios";
import "../css/AddAllocation.css";

export const AddAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // טעינת החדרים מהשרת
    axios
      .get("http://localhost:3000/all-rooms")
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRoomChange = (e) => {
    const room = rooms.find((r) => r._id === e.target.value);
    setSelectedRoom(room);
  };
  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  return (
    <div className="allocation-page">
      <h1 className="page-header text-green">שיבוץ וניהול חדרים</h1>

      <div className="main-layout">
        {/* אזור הטופס - צד ימין */}
        <section className="card form-section border-orange">
          <h2 className="section-title text-orange">פרטי השיבוץ</h2>
          <form className="styled-form">
            <div className="field-group">
              <label>בחר חדר:</label>
              <select onChange={handleRoomChange} defaultValue="">
                <option value="" disabled>
                  -- בחר חדר מהרשימה --
                </option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNumber || room.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>שם האחראי:</label>
              <input type="text" placeholder="הכנס שם מלא..." />
            </div>

            <div className="row">
              <div className="field-group">
                <label>תאריך:</label>
                <input type="date" />
              </div>
              <div className="field-group">
                <label>שעה:</label>
                <input type="time" />
              </div>
            </div>

            <button type="button" className="action-btn bg-orange">
              אישור שיבוץ
            </button>
          </form>
        </section>

        {/* אזור התצוגה - צד שמאל */}
        <section
          className={`card info-section ${selectedRoom ? "border-pink" : "border-gray"}`}
        >
          {selectedRoom ? (
            <div className="room-info-display">
              <div className="icon-circle bg-pink">🏛️</div>
              <h2 className="text-pink">
                חדר {selectedRoom.roomNumber || selectedRoom.name}
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">קיבולת:</span>
                  <span className="info-value">
                    {selectedRoom.capacity} מקומות
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">קומה:</span>
                  <span className="info-value">
                    {selectedRoom.floor || "קרקע"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">זמינות:</span>
                  <span className="status-badge bg-green">פנוי לשיבוץ</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p>אנא בחרו חדר כדי לראות את פרטיו</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
