// // src/api/axiosInstance.js
// import axios from "axios";
// const publicEndpoints = ["/login/", "/signup/","/forgot-password","/forgot-password/" ,"forgot-password", "/landing/"];

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
//   headers: { "Content-Type": "application/json" },
// });

// axiosInstance.interceptors.request.use(

// async (config) => {
//     if (publicEndpoints.some((url) => config.url.includes(url))) {
//       return config; 
//     }

//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         await axios.post("/token/verify/", { token });
//         config.headers.Authorization = `Bearer ${token}`;
//       } catch (err) {
//         console.warn("Invalid token");
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token");

//         const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
//           refresh: refreshToken,
//         });

//         localStorage.setItem("accessToken", res.data.access);
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${res.data.access}`;

//         return axiosInstance(originalRequest);
//       } catch (err) {
//         console.error("Refresh failed:", err);
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
// src/api/axiosInstance.js
import axios from "axios";

const publicEndpoints = [
  "/login",
  "/signup",
  "/forgot-password",
  "/landing",
   "/registerclient",
  "/SignupDropshipper"
];

const axiosInstance = axios.create({
  baseURL: "https://api.kadi-inv.store/api",
  headers: { "Content-Type": "application/json" },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("📤 Request to:", config.url);

    // Vérifie si l’URL est publique → pas besoin de token
    if (publicEndpoints.some((url) => config.url.startsWith(url))) {
      return config;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (SIMPLE) ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error on:", error.config?.url, error.response?.status);
    // 👉 Pas de redirection automatique
    return Promise.reject(error);
  }
);

export default axiosInstance;
