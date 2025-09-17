import { Routes, Route, Link, Navigate } from "react-router-dom";
import TrainingsList from "./pages/TrainingsList.jsx";
import TrainingDetail from "./pages/TrainingDetail.jsx";
import TrainingForm from "./pages/TrainingForm.jsx";

export default function App() {
  return (
    <div className="container page-content">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Link to="/"><h2>EAKSOFT</h2></Link>

      </header>
      <Routes>
        <Route path="/" element={<TrainingsList />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/trainings/new" element={<TrainingForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/trainings/:id/edit" element={<TrainingForm />} />
      </Routes>

      <footer>
        © {new Date().getFullYear()} EAKSOFT — Eğitim Kataloğu
      </footer>
    </div>
  );
}
