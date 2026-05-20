const AUTH_URL = "http://localhost:7070/api/v1/auth";
const BASE_URL = "http://localhost:7070/api/v1";
const TOKEN_KEY = "jwt";

function isFetchNetworkError(err) {
  return err instanceof TypeError; //what browser return for fetch/cors errors
}

function setToken(jwt) {
  localStorage.setItem(TOKEN_KEY, jwt);
}

function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginAPI(credentials) {
  let response;
  try {
    response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch (err) {
    if (isFetchNetworkError(err)) {
      throw new Error("Unable to reach server. Please contact support.", {
        cause: err,
      });
    }
    throw err;
  }

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

  let response;
  try {
    response = await fetch(finalUrl, {
      method,
      headers,
      body: requestBody,
    });
  } catch (err) {
    if (isFetchNetworkError(err)) {
      throw new Error(
        `Unable to reach the server (${method} ${finalUrl}). Please try again later.`,
        { cause: err },
      );
    }
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Request failed (${method} ${finalUrl}): ${response.status} ${errorText}`.trim(),
    );
  }

  if (response.status === 204) return null;
  return response.json();
}
