import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
};

export async function loginLocal(email: string, password: string) {
  const { data } = await api.post<SafeUser>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerLocal(name: string, email: string, password: string) {
  const { data } = await api.post<SafeUser>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<SafeUser>("/auth/me");
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export const googleLoginUrl = "/api/auth/login/google";
export const facebookLoginUrl = "/api/auth/login/facebook";
