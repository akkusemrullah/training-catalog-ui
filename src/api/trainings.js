import { api } from "./client";

export async function getTrainings(params = {}) {
  const { page, pageSize, search, categoryId } = params;

  const query = {
    pageNumber: page ?? 1,
    pageSize: pageSize ?? 10,
    ...(search ? { search } : {}),
    ...(categoryId ? { categoryId } : {}),
     isPublished: true
  };

  console.log("[getTrainings] ->", query);
  const res = await api.get("/api/Training", { params: query });
  console.log("[getTrainings] <-", {
    page: res.data?.page,
    pageSize: res.data?.pageSize,
    totalItems: res.data?.totalItems,
    totalPages: res.data?.totalPages,
    count: Array.isArray(res.data?.items) ? res.data.items.length : 0,
  });
  return res.data; 
}

export async function getTraining(id) {
  const res = await api.get(`/api/Training/${id}`);
  return res.data;
}

export async function deleteTraining(id) {
  await api.delete(`/api/Training/${id}`);
}


export async function createTraining(dto) {
  const res = await api.post("/api/Training", dto);
  return res.data;
}

export async function updateTraining(id, dto) {
  await api.put(`/api/Training/${id}`, dto);
}