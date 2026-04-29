import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/AddAllocation.css";

export const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const [formData, setFormData] = useState({
    day: "ראשון",
    start: "",
    end: "",
    teacher: "",
    lesson: "",
    isPermanent: true,
    date: "",
  });

  const API_ROOMS = "http://localhost:3000/api/rooms";
  const API_PLACEMENTS = "http://localhost:3000/api/placements";

  const dayOrder = { ראשון: 1, שני: 2, שלישי: 3, רביעי: 4, חמישי: 5, שישי: 6 };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_ROOMS);
      setRooms(res.data.data?.rooms || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) return Swal.fire("שגיאה", "חובה לבחור חדר", "error");
    try {
      const payload = { ...formData, room: selectedRoomId };
      await axios.post(API_PLACEMENTS, payload);
      Swal.fire("בוצע!", "השיבוץ נקלט בהצלחה", "success");
    } catch (err) {
      Swal.fire(
        "חדר תפוס",
        err.response?.data?.message || "חפיפת שעות",
        "warning",
      );
    }
  };

  const showFullSchedule = async () => {
    if (!selectedRoomId) return Swal.fire("שימי לב", "בחרי חדר לצפייה", "info");
    setIsChecking(true);
    try {
      const res = await axios.get(API_PLACEMENTS);
      const roomPlacements = res.data.filter(
        (p) => (p.room?._id || p.room) === selectedRoomId,
      );

      if (roomPlacements.length === 0)
        return Swal.fire("חדר פנוי", "אין שיבוצים", "success");

      const sorted = roomPlacements.sort(
        (a, b) =>
          dayOrder[a.day] - dayOrder[b.day] || a.start.localeCompare(b.start),
      );

      let htmlContent = "";
      const daysFound = [...new Set(sorted.map((p) => p.day))];

      daysFound.forEach((day) => {
        const dayShifts = sorted.filter((p) => p.day === day);
        htmlContent += `
          <div style="margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: #2c3e50; color: white; padding: 5px 10px; font-weight: bold;">יום ${day}</div>
            <table style="width: 100%; text-align: right; border-collapse: collapse; font-size: 13px;">
              <tr style="background: #f9f9f9;">
                <th style="padding: 5px;">שעות</th><th style="padding: 5px;">שיעור</th><th style="padding: 5px;">מורה</th>
              </tr>
              ${dayShifts
                .map(
                  (p) => `
                <tr style="border-top: 1px solid #eee;">
                  <td style="padding: 5px;">${p.start}-${p.end}</td>
                  <td style="padding: 5px;">${p.lesson}</td>
                  <td style="padding: 5px;">${p.teacher}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </div>
        `;
      });

      Swal.fire({
        title: `מערכת שעות - חדר ${rooms.find((r) => r._id === selectedRoomId)?.roomNumber}`,
        html: `<div style="max-height: 500px; overflow-y: auto; padding-left: 5px;">${htmlContent}</div>`,
        width: "600px",
        confirmButtonColor: "#5bc0de",
      });
    } catch (err) {
      Swal.fire("שגיאה", "תקלה בטעינה", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const smartDelete = async (scope) => {
    const roomName =
      rooms.find((r) => r._id === selectedRoomId)?.roomNumber || "הנבחר";

    const result = await Swal.fire({
      title: "אישור מחיקה חכמה",
      text: `האם למחוק את ${scope === "day" ? "היום" : "השבוע"} לכל המוסד או רק לחדר ${roomName}?`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "לכל החדרים 🌎",
      denyButtonText: `רק לחדר ${roomName} 🏛️`,
      cancelButtonText: "ביטול",
      confirmButtonColor: "#d33",
      denyButtonColor: "#3085d6",
    });

    let url = "";
    if (result.isConfirmed) {
      url =
        scope === "day"
          ? `${API_PLACEMENTS}/day/${formData.day}`
          : `${API_PLACEMENTS}/all`;
    } else if (result.isDenied) {
      if (!selectedRoomId) return Swal.fire("שגיאה", "חובה לבחור חדר", "error");
      url =
        scope === "day"
          ? `${API_PLACEMENTS}/day/${formData.day}?room=${selectedRoomId}`
          : `${API_PLACEMENTS}/all?room=${selectedRoomId}`;
    } else {
      return;
    }

    try {
      await axios.delete(url);
      Swal.fire("נמחק!", "הנתונים הוסרו בהצלחה", "success");
    } catch (err) {
      Swal.fire("שגיאה", "המחיקה נכשלה", "error");
    }
  };

  const openDeleteInterface = async () => {
    if (!selectedRoomId) return Swal.fire("שימי לב", "בחרי חדר", "info");
    try {
      const res = await axios.get(API_PLACEMENTS);
      const roomPlacements = res.data.filter(
        (p) => (p.room?._id || p.room) === selectedRoomId,
      );
      if (roomPlacements.length === 0)
        return Swal.fire("אין מה לבטל", "החדר ריק", "info");

      const listHtml = roomPlacements
        .sort((a, b) => dayOrder[a.day] - dayOrder[b.day])
        .map(
          (p) => `
        <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; align-items: center;">
          <div style="text-align: right;"><strong>${p.day}</strong> | ${p.start}-${p.end}<br/><small>${p.lesson}</small></div>
          <button class="swal-del-btn" data-id="${p._id}" style="background: none; border: none; color: #ff4d4d; font-size: 18px; cursor: pointer;">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      `,
        )
        .join("");

      Swal.fire({
        title: "מחיקה פרטנית",
        html: `<div style="max-height: 350px; overflow-y: auto;">${listHtml}</div>`,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
          document.querySelectorAll(".swal-del-btn").forEach((btn) => {
            btn.onclick = async () => {
              const id = btn.getAttribute("data-id");
              Swal.close();
              try {
                await axios.delete(`${API_PLACEMENTS}/${id}`);
                Swal.fire("בוטל!", "השיבוץ הוסר", "success");
              } catch (e) {
                Swal.fire("שגיאה", "הביטול נכשל", "error");
              }
            };
          });
        },
      });
    } catch (err) {
      Swal.fire("שגיאה", "תקלה בטעינה", "error");
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  const currentRoom = rooms.find((r) => r._id === selectedRoomId);

  return (
    <div className="allocation-page fade-in">
      <h1 className="page-header text-green">מערכת שיבוץ וניהול חדרים</h1>
      <div className="main-layout">
        <section className="card form-section border-orange">
          <h2 className="section-title text-orange">פרטי השיבוץ</h2>
          <form onSubmit={handleFormSubmit} className="styled-form">
            <div className="field-group">
              <label>בחר חדר:</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                required
              >
                <option value="">-- בחר חדר מהרשימה --</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    חדר {r.roomNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="field-group">
                <label>יום:</label>
                <select
                  value={formData.day}
                  onChange={(e) =>
                    setFormData({ ...formData, day: e.target.value })
                  }
                >
                  {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="field-group">
                <label>סוג שיבוץ:</label>
                <select
                  value={formData.isPermanent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPermanent: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">קבוע</option>
                  <option value="false">זמני</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="field-group">
                <label>התחלה:</label>
                <input
                  type="time"
                  value={formData.start}
                  onChange={(e) =>
                    setFormData({ ...formData, start: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field-group">
                <label>סיום:</label>
                <input
                  type="time"
                  value={formData.end}
                  onChange={(e) =>
                    setFormData({ ...formData, end: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="field-group">
              <label>שם המורה:</label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) =>
                  setFormData({ ...formData, teacher: e.target.value })
                }
                required
              />
            </div>
            <div className="field-group">
              <label>שם השיעור:</label>
              <input
                type="text"
                value={formData.lesson}
                onChange={(e) =>
                  setFormData({ ...formData, lesson: e.target.value })
                }
                required
              />
            </div>
            {!formData.isPermanent && (
              <div className="field-group">
                <label>תאריך:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            )}
            <div
              className="button-container"
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button type="submit" className="action-btn bg-orange">
                ✅ אישור שיבוץ במערכת
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={showFullSchedule}
                  className="action-btn"
                  style={{ backgroundColor: "#5bc0de", flex: 1 }}
                >
                  {isChecking ? "טוען..." : "📅 מערכת שעות"}
                </button>
                <button
                  type="button"
                  onClick={openDeleteInterface}
                  className="action-btn"
                  style={{ backgroundColor: "#ff4d4d", flex: 1 }}
                >
                  <i className="fas fa-trash-can"></i> ביטול פרטני
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => smartDelete("day")}
                  className="action-btn"
                  style={{
                    backgroundColor: "#95a5a6",
                    flex: 1,
                    fontSize: "12px",
                  }}
                >
                  🗑️ מחק יום {formData.day}
                </button>
                <button
                  type="button"
                  onClick={() => smartDelete("all")}
                  className="action-btn"
                  style={{
                    backgroundColor: "#34495e",
                    flex: 1,
                    fontSize: "12px",
                  }}
                >
                  🚨 מחק מערכת שבועית
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className="card info-section border-pink">
          <h2 className="text-pink">סטטוס תשתית חדר</h2>
          {currentRoom ? (
            <div className="room-preview">
              <div className="icon-circle bg-pink">🏛️</div>
              <p>
                חדר: <strong>{currentRoom.roomNumber}</strong>
              </p>
              <p>
                👥 קיבולת: <strong>{currentRoom.capacity}</strong>
              </p>
              <p>
                📍 קומה: <strong>{currentRoom.floor || "1"}</strong>
              </p>
              <p>
                📽️ מקרן:{" "}
                <strong>{currentRoom.hasProjector ? "קיים" : "אין"}</strong>
              </p>
            </div>
          ) : (
            <div className="empty-state">בחרי חדר לנתוני קומה ומקרן</div>
          )}
        </section>
      </div>
    </div>
  );
};
