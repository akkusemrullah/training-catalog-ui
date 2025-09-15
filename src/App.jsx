import TrainingsList from "./pages/TrainingsList";

export default function App() {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: 16 }}>
      <h2>Training Catalog</h2>
      <TrainingsList />
    </div>
  );
}
