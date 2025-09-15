import { api } from "./client";

export async function getTrainings(params) {
  const res = await api.get("/api/Training", { params });
  return res.data;
}

export async function getTraining(id) {
  const res = await api.get(`/api/Training/${id}`);
  return res.data;
}

export async function createTraining(dto) {
  const res = await api.post("/api/Training", dto);
  return res.data;
}

export async function updateTraining(id, dto) {
  await api.put(`/api/Training/${id}`, dto);
}

export async function deleteTraining(id) {
  await api.delete(`/api/Training/${id}`);
}
