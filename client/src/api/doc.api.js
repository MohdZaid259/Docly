import axiosInstance from "../utils/axiosInstance";

export const uploadDocument = (formData) => {
  return axiosInstance.post("/documents/upload", formData);
};

export const getDocuments = () => {
  return axiosInstance.get("/documents");
};

export const getDocumentById = (id) => {
  return axiosInstance.get(`/documents/${id}`);
};

export const deleteDocument = (id) => {
  return axiosInstance.delete(`/documents/${id}`);
};
