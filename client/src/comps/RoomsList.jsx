import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Rooms.css";

export const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/api/rooms";

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const roomsData = res.data.data?.rooms || res.data;
      if (Array.isArray(roomsData)) setRooms(roomsData);
    } catch (err) {
      console.error("שגיאה בטעינה:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // סינון חדרים לפי חיפוש
  const filteredRooms = rooms.filter((room) =>
    (room.roomNumber || "").toString().includes(searchTerm),
  );

  const handleUpdate = async (room) => {
    const { value: formValues } = await Swal.fire({
      title: `עריכת תשתית חדר ${room.roomNumber}`,
      html: `
        <div style="text-align: right; direction: rtl;">
          <label style="font-weight: 600;">קיבולת חדר:</label>
          <input id="swal-cap" class="swal2-input" type="number" value="${room.capacity}">
          
          <label style="font-weight: 600; margin-top: 15px; display: block;">קומה (נעול):</label>
          <input class="swal2-input" type="text" value="${room.floor || "1"}" disabled style="background: #f0f0f0;">
          
          <div style="margin-top: 20px; display: flex; align-items: center; gap: 10px;">
            <input id="swal-proj" type="checkbox" ${room.hasProjector ? "checked" : ""} style="width: 20px; height: 20px;">
            <label style="font-weight: 600;">מקרן תקין</label>
          </div>
        </div>
      `,
      confirmButtonText: "עדכן נתונים",
      confirmButtonColor: "#4CAF50",
      showCancelButton: true,
      cancelButtonText: "ביטול",
      preConfirm: () => ({
        capacity: document.getElementById("swal-cap").value,
        hasProjector: document.getElementById("swal-proj").checked,
      }),
    });

    if (formValues) {
      try {
        await axios.patch(`${API_URL}/${room._id}`, formValues);
        Swal.fire({
          icon: "success",
          title: "הנתונים עודכנו",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchRooms();
      } catch (err) {
        Swal.fire("שגיאה", "העדכון נכשל", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="management-container fade-in">
      <header className="mgmt-header">
        <h1 className="mgmt-title">ניהול תשתיות מוסדי</h1>
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="חפשי מספר חדר..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="rooms-modern-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room._id} className="modern-card">
              <div className="card-accent"></div>
              <div className="card-header">
                <span className="room-label">חדר</span>
                <h2 className="room-num">{room.roomNumber}</h2>
              </div>
              <div className="card-body">
                <div className="data-row">
                  <span className="label">👥 קיבולת</span>
                  <span className="val">{room.capacity}</span>
                </div>
                <div className="data-row">
                  <span className="label">📍 קומה</span>
                  <span className="val">{room.floor || "1"}</span>
                </div>
                <div className="data-row">
                  <span className="label">📽️ מקרן</span>
                  <span
                    className={`status-tag ${room.hasProjector ? "tag-green" : "tag-red"}`}
                  >
                    {room.hasProjector ? "מותקן" : "חסר"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleUpdate(room)}
                className="edit-glow-btn"
              >
                ערוך תשתית
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">לא נמצאו חדרים התואמים את החיפוש...</p>
        )}
      </div>
    </div>
  );
};
