import { api } from "./client";

export async function getCategories() {
  const res = await api.get("/api/Category"); 

  return res.data;
}
