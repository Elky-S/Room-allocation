import { Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { RoomsManagement } from "./RoomsList";
import { RoomAllocation } from "./AddAllocation";
export const Routing = () => {
  return (
    <Routes>
      {/* כאן את מגדירה את הנתיבים - הם חייבים להיות בתוך Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomsManagement />} />{" "}
      <Route path="/add-allocation" element={<RoomAllocation />} />
      {/* הנתיב לניהול החדרים */}{" "}
    </Routes>
  );
};
