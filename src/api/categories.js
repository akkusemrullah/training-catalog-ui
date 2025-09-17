import { api } from "./client";

export async function getCategories() {
  const res = await api.get("/api/Category"); // Sende /api/Categories ise onu yaz
  // Beklenen: [{ id, categoryName, trainings: [] }]
  return res.data;
}
