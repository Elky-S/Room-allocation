import { Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { RoomsList } from "./RoomsList";
import { AddAllocation } from "./AddAllocation";
export const Routing = () => {
  return (
    <Routes>
      {/* כאן את מגדירה את הנתיבים - הם חייבים להיות בתוך Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomsList />} />{" "}
      <Route path="/add-allocation" element={<AddAllocation />} />
      {/* הנתיב לניהול החדרים */}{" "}
    </Routes>
  );
};
