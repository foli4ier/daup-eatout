import { Navigate, Route, Routes } from "react-router-dom";
import Confirmation from "./pages/Confirmation";
import Eatery from "./pages/Eatery";
import Home from "./pages/Home";
import Review from "./pages/Review";

export default function App() {
  return (
    <div className="shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<Eatery />} />
        <Route path="/place/:id/review" element={<Review />} />
        <Route path="/booked/:id" element={<Confirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
