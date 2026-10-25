import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const persistedState = localStorage.getItem("ecom-store");
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        const token = parsed?.state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Failed to parse auth token from store", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

// Response interceptor: handle 401 token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/refresh" && originalRequest.url !== "/login") {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const res = await axios.post(`${API_BASE_URL}/refresh`, {}, { withCredentials: true });
              const token = res.data?.token;
              if (!token) throw new Error("No token returned");
              try {
                const { default: useEcomStore } = await import("../store/ecom-store");
                useEcomStore.setState({ token });
              } catch {
                const persisted = localStorage.getItem("ecom-store");
                if (persisted) {
                  const parsed = JSON.parse(persisted);
                  parsed.state.token = token;
                  localStorage.setItem("ecom-store", JSON.stringify(parsed));
                }
              }
              return token;
            } finally {
              refreshPromise = null;
            }
          })();
        }
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, clear token
        try {
          const { default: useEcomStore } = await import("../store/ecom-store");
          useEcomStore.setState({ user: null, token: null });
        } catch {
          const persisted = localStorage.getItem("ecom-store");
          if (persisted) {
            const parsed = JSON.parse(persisted);
            parsed.state.user = null;
            parsed.state.token = null;
            localStorage.setItem("ecom-store", JSON.stringify(parsed));
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
