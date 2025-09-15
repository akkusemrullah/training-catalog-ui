import { useEffect, useState } from "react";
import { getTrainings } from "../api/trainings";

export default function TrainingsList() {
  const [data, setData] = useState(null);      // API cevabı (dizi veya paged)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Şimdilik sabit: ilk sayfa, 10 kayıt, sadece yayınlananlar
        const res = await getTrainings({ pageNumber: 1, pageSize: 10, isPublished: true });
        setData(res);
      } catch (e) {
        setError(e?.response?.data?.title || e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: "crimson" }}>{error}</p>;

  // API'niz { items: [] } döndürüyorsa:
  const items = Array.isArray(data) ? data : data?.items || [];

  if (!items.length) return <p>No results.</p>;

  return (
    <div>
      <h1>Trainings</h1>
      <ul style={{ display: "grid", gap: 8, paddingLeft: 18 }}>
        {items.map(t => (
          <li key={t.id}>
            <strong>{t.title}</strong>
            {t.shortDescription ? <> — {t.shortDescription}</> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
