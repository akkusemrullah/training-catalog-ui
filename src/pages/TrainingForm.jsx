import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTraining, createTraining, updateTraining } from "../api/trainings";
import { getCategories } from "../api/categories";

export default function TrainingForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  // form state
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

  // kategoriler
  useEffect(() => {
    (async () => {
      try {
        const list = await getCategories();
        setCats(Array.isArray(list) ? list : []);
      } catch { setCats([]); }
    })();
  }, []);

  // edit ise veriyi çek
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
        setError(e?.response?.data?.title || e.message || "Error");
      }
    })();
  }, [id, editing]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // HTML5 doğrulama dışında basit guard
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
      setError(e?.response?.data?.title || e.message || "Error");
    }
  }

  return (
    <div>
      <h1>{editing ? "Edit Training" : "New Training"}</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSubmit} className="grid" style={{ maxWidth: 640 }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
        </label>
        <small>{title.length}/120</small>

        <label>
          Short Description
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            maxLength={280}
          />
        </label>
        <small>{shortDescription.length}/280</small>

        <label>
          Long Description
          <textarea
            rows={6}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">(none)</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            pattern="https?://.+"
            title="Valid URL (http/https)"
          />
        </label>

        <label>
          Start Date
          <input
            type="datetime-local"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date
          <input
            type="datetime-local"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />{" "}
          Published
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editing ? "Save" : "Create"}</button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
