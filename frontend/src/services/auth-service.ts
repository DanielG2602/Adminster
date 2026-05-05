import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

const ACCESS_TOKEN_KEY = "adminster.accessToken";
const USER_KEY = "adminster.user";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  persistSession(data);
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    clearSession();
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function hasLegacyMockSession() {
  return getAccessToken()?.startsWith("mock-token") ?? false;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function persistSession(response: AuthResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}
