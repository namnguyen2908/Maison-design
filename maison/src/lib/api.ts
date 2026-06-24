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

// Role management API
export async function getRoles(): Promise<RoleItem[]> {
  const { data } = await api.get("/roles");
  return data;
}

export type RoleItem = {
  id: string;
  name: string;
  label: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
};

export async function createRole(data: { name: string; label: string; description?: string }) {
  const { data: res } = await api.post("/roles", data);
  return res;
}

export async function updateRole(id: string, data: { label?: string; description?: string; isActive?: boolean }) {
  const { data: res } = await api.patch(`/roles/${id}`, data);
  return res;
}

export async function deleteRole(id: string) {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
}

// User management API
export type UserItem = {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; label: string };
  provider: string;
  isActive: boolean;
  createdAt: string;
};

export async function getUsers(): Promise<UserItem[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function assignRole(userId: string, roleName: string) {
  const { data } = await api.patch(`/users/${userId}/role`, { roleName });
  return data;
}

// Project management API
export async function getProjects() {
  const { data } = await api.get("/projects");
  return data;
}

export async function getProject(id: string) {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function createProject(projectData: {
  name: string;
  description?: string;
  clientId: string;
  assignedDesignerId?: string;
}) {
  const { data } = await api.post("/projects", projectData);
  return data;
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  const { data: res } = await api.patch(`/projects/${id}`, data);
  return res;
}

// Room management API
export async function getRooms(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/rooms`);
  return data;
}

export async function getRoom(id: string) {
  const { data } = await api.get(`/rooms/${id}`);
  return data;
}

// Design management API
export async function getDesignVersions(roomId: string) {
  const { data } = await api.get(`/rooms/${roomId}/designs`);
  return data;
}

// Annotation management API
export async function getAnnotations(designId: string) {
  const { data } = await api.get(`/designs/${designId}/annotations`);
  return data;
}

export async function createAnnotation(designId: string, annotation: {
  x: number;
  y: number;
  targetImageId?: string;
  referenceImageUrl?: string;
  content: string;
}) {
  const { data } = await api.post(`/designs/${designId}/annotations`, annotation);
  return data;
}

export async function resolveAnnotation(id: string) {
  const { data } = await api.patch(`/annotations/${id}/status`, { status: "resolved" });
  return data;
}

export async function reopenAnnotation(id: string) {
  const { data } = await api.patch(`/annotations/${id}/status`, { status: "reopened" });
  return data;
}