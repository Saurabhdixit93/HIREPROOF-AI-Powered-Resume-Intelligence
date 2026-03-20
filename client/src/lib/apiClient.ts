import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  // Use the Next.js proxy — same origin, no CORS
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 120 seconds for AI generation
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    const backendToken = (session as any)?.backendToken;
    if (backendToken) {
      config.headers.Authorization = `Bearer ${backendToken}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { apiClient };
export default apiClient;
