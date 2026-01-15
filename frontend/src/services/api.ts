import axios from "axios";
import { useAuth } from "react-oidc-context";
import { User, UserFormData, Group, GroupSettings } from "../types/admin.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Attach token from react-oidc-context
api.interceptors.request.use((config) => {
  // Use window.auth for token (set in ProtectedRoute)
  const token = (window as any).authToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally trigger logout
    }
    return Promise.reject(error);
  }
);

// User Management
export const getUsers = async (page = 1, limit = 10): Promise<User[]> => {
  const res = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/api/admin/users/${id}`);
  return res.data;
};

export const createUser = async (data: UserFormData): Promise<User> => {
  const res = await api.post("/api/admin/users", data);
  return res.data;
};

export const updateUser = async (id: string, data: Partial<UserFormData>): Promise<User> => {
  const res = await api.patch(`/api/admin/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/users/${id}`);
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const res = await api.get(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

// Group Management
export const getGroups = async (): Promise<Group[]> => {
  const res = await api.get("/api/groups");
  return res.data;
};

export const getGroupById = async (id: string): Promise<Group> => {
  const res = await api.get(`/api/groups/${id}`);
  return res.data;
};

export const getGroupMembers = async (id: string): Promise<User[]> => {
  const res = await api.get(`/api/groups/${id}/members`);
  return res.data;
};

export const updateGroupSettings = async (id: string, settings: GroupSettings): Promise<Group> => {
  const res = await api.patch(`/api/groups/${id}/settings`, settings);
  return res.data;
};

export const addUserToGroup = async (groupId: string, userId: string): Promise<void> => {
  await api.post(`/api/groups/${groupId}/members`, { userId });
};

export const removeUserFromGroup = async (groupId: string, userId: string): Promise<void> => {
  await api.delete(`/api/groups/${groupId}/members/${userId}`);
};

export const testUserRoles = async (): Promise<string[]> => {
  const res = await api.get("/api/users/me");
  // Debug: print roles from API response
  console.debug("API /api/users/me roles:", res.data.roles);
  return res.data.roles;
};

export const createGroup = async (data: GroupFormData): Promise<Group> => {
  const res = await api.post("/api/groups", data);
  return res.data;
};

export default api;
