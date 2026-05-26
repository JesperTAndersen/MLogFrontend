import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_MESSAGE_KEY,
} from "./sessionMessages";

const AUTH_URL = "https://maintenancelog.heltsort.dk/api/v1/auth";
const BASE_URL = "https://maintenancelog.heltsort.dk/api/v1";
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

function redirectToLoginWithSessionExpiredMessage() {
  removeToken();

  try {
    sessionStorage.setItem(
      SESSION_EXPIRED_MESSAGE_KEY,
      SESSION_EXPIRED_MESSAGE,
    );
  } catch {
    // ignore errors
  }

  if (typeof window === "undefined") return;
  const path = window.location?.pathname ?? "";
  if (path === "/login") return;

  window.location.assign("/login");
}

async function readBackendErrorMessage(response) {
  const rawText = await response.text().catch(() => "");
  const text = String(rawText ?? "").trim();
  if (!text) return "";

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      const message = String(parsed.message ?? "").trim();
      if (message) return message;
    }
  } catch {
    // ignore parse errors
  }

  return text;
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
    redirectToLoginWithSessionExpiredMessage();
    await new Promise(() => {}); // hang forever, redirect will happen
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
    if (response.status === 401) {
      redirectToLoginWithSessionExpiredMessage();
      await new Promise(() => {}); // hang forever, redirect will happen
    }

    if (response.status === 403)
      throw new Error("You don't have permission to do that.");

    if (response.status === 404)
      throw new Error("The requested resource was not found.");

    if (response.status === 409) {
      const backendMessage = await readBackendErrorMessage(response);
      throw new Error(
        backendMessage || "That request conflicted with existing data.",
      );
    }
    if (response.status === 400) {
      const backendMessage = await readBackendErrorMessage(response);
      throw new Error(backendMessage || "That request was invalid.");
    }

    if (response.status === 503)
      throw new Error(
        "Service is temporarily unavailable. Please try again later.",
      );
      
    if (response.status >= 500)
      throw new Error(
        "Something went wrong. Please try again later or contact support.",
      );

    const backendMessage = await readBackendErrorMessage(response);
    throw new Error(
      backendMessage ||
        `Request failed (${response.status}). Please try again.`,
    );
  }

  if (response.status === 204) return null;
  return response.json();
}
