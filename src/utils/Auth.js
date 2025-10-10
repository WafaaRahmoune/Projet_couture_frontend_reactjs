

export async function getAccessToken() {
  let access = localStorage.getItem("accessToken")
  const refresh = localStorage.getItem("refreshToken")

  if (!access && refresh) {
    const res = await fetch("https://api.kadi-inv.store/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("accessToken", data.access)
      access = data.access
    } else {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  return access
}

// petit helper fetch qui ajoute automatiquement le token
export async function authFetch(url, options = {}) {
  const token = await getAccessToken()
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, { ...options, headers })
}

// src/utils/auth.js
import axios from "axios";

export async function checkInitialAuth() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken) return false;

  try {
    // 🔍 Verify access token validity
    await axios.post("https://api.kadi-inv.store/api/token/verify/", { token: accessToken });
    return true;
  } catch {
    if (refreshToken) {
      try {
        // 🔄 Try to refresh access token
        const res = await axios.post("https://api.kadi-inv.store/api/token/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("accessToken", res.data.access);
        return true;
      } catch {
        localStorage.clear();
      }
    }
    return false;
  }
}
