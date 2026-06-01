import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_MESSAGE_KEY,
} from "./sessionMessages";

const IS_DEPLOYED = window.location.hostname !== "localhost";
const BASE_URL = IS_DEPLOYED
  ? "https://maintenancelog.heltsort.dk/api/v1"
  : "http://localhost:7070/api/v1";

const AUTH_URL = IS_DEPLOYED
  ? "https://maintenancelog.heltsort.dk/api/v1/auth"
  : "http://localhost:7070/api/v1/auth";

const TOKEN_KEY = "jwt";

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

      const userMessage = isUserSafeBackendMessage(backendMessage)
        ? backendMessage
        : "That request conflicted with existing data.";
      throw new Error(userMessage, {
        cause: {
          type: "API_ERROR",
          status: response.status,
          backendMessage,
          method,
          url: finalUrl,
        },
      });
    }
    if (response.status === 400) {
      const backendMessage = await readBackendErrorMessage(response);
      const userMessage = isUserSafeBackendMessage(backendMessage)
        ? backendMessage
        : "That request was invalid.";
      throw new Error(userMessage, {
        cause: {
          type: "API_ERROR",
          status: response.status,
          backendMessage,
          method,
          url: finalUrl,
        },
      });
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
    const fallbackMessage = `Request failed (${response.status}). Please try again.`;
    const userMessage = isUserSafeBackendMessage(backendMessage)
      ? backendMessage
      : fallbackMessage;
    throw new Error(userMessage, {
      cause: {
        type: "API_ERROR",
        status: response.status,
        backendMessage,
        method,
        url: finalUrl,
      },
    });
  }

  if (response.status === 204) return null;
  return response.json();
}

function isFetchNetworkError(err) {
  return err instanceof TypeError; //what browser return for fetch/cors errors
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

function isUserSafeBackendMessage(message) {
  const trimmed = String(message ?? "").trim();
  if (!trimmed) return false;
  if (trimmed.length > 160) return false;

  const lower = trimmed.toLowerCase();
  const blockedSubstrings = [
    "for input string",
    "numberformatexception",
    "nullpointerexception",
    "illegalargumentexception",
    "constraintviolationexception",
    "stacktrace",
    "org.",
    "java.",
    "exception",
  ];
  if (blockedSubstrings.some((s) => lower.includes(s))) return false;
  return true;
}

function isMissingRequiredValue(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
}

function assertRequiredParam(paramName, value, context = "function") {
  if (!paramName || typeof paramName !== "string") {
    throw new Error(
      "Something went wrong. Please refresh the page and try again.",
      {
        cause: {
          type: "CLIENT_VALIDATION_ERROR",
          reason: "assertRequiredParam called without a valid paramName",
          context,
          paramName,
        },
      },
    );
  }

  if (isMissingRequiredValue(value)) {
    throw new Error("Required ID is missing. Please go back and try again.", {
      cause: {
        type: "CLIENT_VALIDATION_ERROR",
        reason: "MISSING_REQUIRED_PARAM",
        context,
        paramName,
      },
    });
  }
}

function isPositiveIntegerLike(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) return false;
    const parsed = Number.parseInt(trimmed, 10);
    return parsed > 0;
  }
  return false;
}

export function assertPositiveIntegerId(
  paramName,
  value,
  context = "function",
) {
  assertRequiredParam(paramName, value, context);

  if (!isPositiveIntegerLike(value)) {
    throw new Error("Invalid ID. Please check the link and try again.", {
      cause: {
        type: "CLIENT_VALIDATION_ERROR",
        reason: "INVALID_ID_FORMAT",
        context,
        paramName,
      },
    });
  }
}
