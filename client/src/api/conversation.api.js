import axiosInstance from "../utils/axiosInstance";

export const listConversations = (params) => {
  return axiosInstance.get("/conversations", { params });
};

export const createConversation = (payload) => {
  return axiosInstance.post("/conversations", payload);
};

export const getConversation = (id) => {
  return axiosInstance.get(`/conversations/${id}`);
};

export const deleteConversation = (id) => {
  return axiosInstance.delete(`/conversations/${id}`);
};
