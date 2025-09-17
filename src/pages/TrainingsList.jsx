import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrainings } from "../api/trainings";
import { getCategories } from "../api/categories";

export default function TrainingsList() {
  const [data, setData] = useState(null);     // { items, page, pageSize, totalItems, totalPages }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sayfalama
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtreler
  const [search, setSearch] = useState("");
  const [searchLocal, setSearchLocal] = useState(""); // input için (debounce)
  const [categoryId, setCategoryId] = useState("");   // select value
  const [cats, setCats] = useState([]);

  // Kategoriler
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

  // Debounce: 400ms sonra search'e yaz (3. sayfadaysan 1'e dönmek istemiyorsan setPage(1)'i kaldır)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchLocal.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchLocal]);

  // Veri çek
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await getTrainings({
          page,
          pageSize,
          search,
          categoryId: categoryId ? Number(categoryId) : undefined,
          // isPublished: true, // backend default true yapıyorsa göndermeyebilirsin
        });
        setData(res);
      } catch (e) {
        setError(e?.response?.data?.title || e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize, search, categoryId]);

  if (loading && !data) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div>
      <h1>Eğitimler</h1>

    
      {/* Filtreler */}
      <div className="toolbar">
        <input
          placeholder="Ara..."
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          style={{ minWidth: 220 }}
        />

        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
        >
          <option value="">Hepsi</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <select
          value={String(pageSize)}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <Link to="/trainings/new" className="new-training-btn">
          + Yeni Eğitim Ekle
        </Link>
    
      </div>

      {/* Liste */}
      {items.length === 0 ? (
        <p>Sonuç bulunamadı.</p>
      ) : (
        <ul className="card-grid">
          {items.map((t) => (
            <li key={t.id} className="card">
              <Link to={`/trainings/${t.id}`}>
                <h3>{t.title}</h3>
              </Link>
              {t.shortDescription && <p>{t.shortDescription}</p>}
              {t.imageUrl && (
                <img
                  src={t.imageUrl}
                  alt={t.title}
                  style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="pager-fixed">
        <button disabled={!hasPrev} onClick={() => setPage((p) => p - 1)}>‹ Önceki</button>
        <span>Sayfa <strong>{page}</strong> / {totalPages}</span>
        <button disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>Sonraki ›</button>
        <span style={{ opacity: 0.8 }}>Toplam Kayıt: {totalItems}</span>
      </div>
    </div>
  );
}
