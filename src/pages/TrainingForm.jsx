import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTraining, createTraining, updateTraining } from "../api/trainings";
import { getCategories } from "../api/categories";

export default function TrainingForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [cats, setCats] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    (async () => {
      try {
        const list = await getCategories();
        setCats(Array.isArray(list) ? list : []);
      } catch {
        setCats([]);
      }
    })();
  }, []);


  useEffect(() => {
    if (!editing) return;
    (async () => {
      try {
        const t = await getTraining(Number(id));
        setTitle(t.title ?? "");
        setShortDescription(t.shortDescription ?? "");
        setLongDescription(t.longDescription ?? "");
        setCategoryId(t.categoryId ? String(t.categoryId) : "");
        setImageUrl(t.imageUrl ?? "");
        setStartDate(t.startDate ?? "");
        setEndDate(t.endDate ?? "");
        setIsPublished(!!t.isPublished);
      } catch (e) {
        setError(e?.response?.data?.title || e.message || "Hata oluştu");
      }
    })();
  }, [id, editing]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title || title.length > 120) return;
    if (!shortDescription || shortDescription.length > 280) return;
    if (!longDescription) return;

    const payload = {
      title,
      shortDescription,
      longDescription,
      categoryId: categoryId ? Number(categoryId) : null,
      imageUrl: imageUrl || null,
      startDate: startDate || null,
      endDate: endDate || null,
      isPublished,
    };

    try {
      if (editing) await updateTraining(Number(id), payload);
      else await createTraining(payload);
      navigate("/");
    } catch (e) {
      setError(e?.response?.data?.title || e.message || "Hata oluştu");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="training-form">
        <h1>{editing ? "Eğitimi Düzenle" : "Yeni Eğitim Ekle"}</h1>

        {error && <p className="error">{error}</p>}

        <label>
          Başlık
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
          <small>{title.length}/120 karakter</small>
        </label>

        <label>
          Kısa Açıklama
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            maxLength={280}
          />
          <small>{shortDescription.length}/280 karakter</small>
        </label>

        <label>
          Uzun Açıklama
          <textarea
            rows={6}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Kategori
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">(Seçilmedi)</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Görsel URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            pattern="https?://.+"
            title="Geçerli bir URL giriniz (http/https)"
          />
        </label>

        <label>
          Başlangıç Tarihi
          <input
            type="datetime-local"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          Bitiş Tarihi
          <input
            type="datetime-local"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />{" "}
          Yayınlansın mı?
        </label>

        <div className="actions">
          <button type="submit">{editing ? "Kaydet" : "Oluştur"}</button>
          <Link to="/" className="cancel-link">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
