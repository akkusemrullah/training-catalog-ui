import { Routes, Route, Link, Navigate } from "react-router-dom";
import TrainingsList from "./pages/TrainingsList.jsx";
import TrainingDetail from "./pages/TrainingDetail.jsx";
import TrainingForm from "./pages/TrainingForm.jsx";

export default function App() {
  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Link to="/"><h2>Training Catalog</h2></Link>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">List</Link>
          <Link to="/trainings/new">+ New</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<TrainingsList />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/trainings/new" element={<TrainingForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/trainings/:id/edit" element={<TrainingForm />} />
      </Routes>
    </div>
  );
}
