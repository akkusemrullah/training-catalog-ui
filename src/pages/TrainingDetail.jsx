import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTraining, deleteTraining } from "../api/trainings";

export default function TrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await getTraining(Number(id));
        setData(res);
      } catch (e) {
        setError(e?.response?.data?.title || e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading && !data) return <p>Loading…</p>;
  if (error) return <p style={{ color:"crimson" }}>{error}</p>;
  if (!data) return null;

  return (
    <div>
      <h1>{data.title}</h1>
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.title} style={{ maxWidth: 640, width: "100%", borderRadius: 8 }} />
      )}
      <p><strong>Short:</strong> {data.shortDescription}</p>
      <p><strong>Long:</strong> {data.longDescription}</p>
      <p><strong>Dates:</strong> {data.startDate ?? "-"} → {data.endDate ?? "-"}</p>

      <div style={{ display:"flex", gap:10 }}>
        {/* Düzenleme sayfasını sonra ekleyebiliriz */}
        <button
          onClick={async () => {
            if (confirm("Delete this training?")) {
              await deleteTraining(data.id);
              navigate("/");
            }
          }}
        >
          Delete
        </button>
        <Link to={`/trainings/${data.id}/edit`}>Edit</Link>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}
