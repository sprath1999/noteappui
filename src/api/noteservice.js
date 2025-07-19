import axios from "./axiosInstance";

export const fetchCategories = async () => {
  const res = await axios.get("/api/categories");
  return res.data;
};
export const createCategory = async (name) => {
  const res = await axios.post(
    `/api/categories/create?name=${encodeURIComponent(name)}`
  );
  return res.data;
};
export const addNewNote = async (formData) => {
  const res = await axios.post("/api/notes/create", formData);
  return res.data;
};
export const fetchNoteById = async (id) => {
  const res = await axios.get(`/api/notes/${id}`);
  return res.data;
};

export const deleteNoteById = async (id) => {
  const res = await axios.delete(`/api/notes/delete/${id}`);
  return res.data;
};

export const updateNote = async ({ id, formData }) => {
  await axios.put(`/api/notes/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCategoryById = async (categoryId) => {
  const res = await axios.delete(`/api/categories/delete/${categoryId}`);
  return res.data;
};
