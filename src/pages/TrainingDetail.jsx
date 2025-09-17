import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTraining, deleteTraining } from "../api/trainings";

export default function TrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const t = await getTraining(Number(id));
        setTraining(t);
      } catch (e) {
        setError("Eğitim bulunamadı");
      }
    })();
  }, [id]);

  async function handleDelete() {
    if (window.confirm("Bu eğitimi silmek istiyor musunuz?")) {
      await deleteTraining(Number(id));
      navigate("/");
    }
  }

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!training) return <p>Yükleniyor…</p>;

  const start = training.startDate ? new Date(training.startDate).toLocaleString() : null;
  const end = training.endDate ? new Date(training.endDate).toLocaleString() : null;
  const categoryName = training.category?.categoryName || training.categoryName || null;

  return (
    <div className="training-detail training-detail--spaced">
      <div className="training-detail__grid">
        {/* Sol: Hero görsel (geniş ekranda solda) */}
        <div className="training-detail__hero">
          {training.imageUrl ? (
            <img src={training.imageUrl} alt={training.title} />
          ) : (
            /* Görsel yoksa basit bir placeholder */
            <img
              src={`https://picsum.photos/seed/${training.id || "training"}/960/540`}
              alt="placeholder"
            />
          )}
        </div>

        {/* Sağ: Başlık + meta + açıklama + aksiyonlar */}
        <div className="training-detail__content">
          <h1 className="training-detail__title">{training.title}</h1>

          <div className="training-detail__meta">
            {categoryName && <span className="badge">{categoryName}</span>}


          </div>
          {start && (
            <span>
              <strong>Başlangıç:</strong> {start}
            </span>
          )}
          {end && (
            <span>
              <strong>Bitiş:</strong> {end}
            </span>
          )}
          <span className={`state ${training.isPublished ? "ok" : "draft"}`}>
            {training.isPublished ? "Yayınlandı" : "Taslak"}
          </span>
          {training.shortDescription && (
            <p style={{ color: "#555", margin: "4px 0 2px" }}>
              {training.shortDescription}
            </p>
          )}

          <div className="training-detail__desc">
            {training.longDescription}
          </div>

          <div className="training-detail__actions">
            <Link to={`/trainings/${id}/edit`} className="btn btn-primary">Düzenle</Link>
            <button onClick={handleDelete} className="btn btn-danger">Sil</button>
          </div>
        </div>
      </div>
    </div>
  );
}
