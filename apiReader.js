const AUTH_URL = "http://localhost:7070/api/v1/auth";
const BASE_URL = "http://localhost:7070/api/v1";
const TOKEN_KEY = "jwt";

function setToken(jwt) {
  localStorage.setItem(TOKEN_KEY, jwt);
}

function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function login(credentials) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Invalid email or password");
    throw new Error("Login failed");
  }

  const { token, authUser } = await response.json();

  if (!token) {
    throw new Error("Login response did not contain a JWT token");
  }
  if (!authUser) {
    throw new Error("Login response did not contain authUser");
  }

  setToken(token);
  return { authUser };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(url, { method = "GET", body } = {}) {
  const headers = {};
  const token = readToken();

  if (!token) {
    throw new Error("No JWT token available. Login first or provide a token.");
  }
  headers.Authorization = `Bearer ${token}`;

  let requestBody = undefined;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const finalUrl = /^https?:\/\//.test(url)
    ? url
    : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const response = await fetch(finalUrl, {
    method,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Request failed (${method} ${finalUrl}): ${response.status} ${errorText}`.trim(),
    );
  }

  return response.json();
}

export function getMe() {
  return apiRequest("/employees/me");
}

export function getAssets() {
  return apiRequest("/assets");
}