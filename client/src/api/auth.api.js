import axiosInstance from "../utils/axiosInstance";

export const loginWithGoogle = (credential) => {
  return axiosInstance.post("/auth/google", { credential });
};

export const getMe = () => {
  return axiosInstance.get("/auth/me");
};
