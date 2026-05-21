import { apiRequest } from "./apiClient";

export function getAssets(active = null) {
  const url = active !== null ? `/assets?active=${active}` : "/assets";
  return apiRequest(url);
}

export function getAssetById(id) {
  return apiRequest(`/assets/${id}`);
}

export function createAsset(assetBody) {
  if (!assetBody || typeof assetBody !== "object") {
    throw new Error("Asset body is required");
  }

  return apiRequest(`/assets`, {
    method: "POST",
    body: assetBody,
  });
}

export function deactivateAsset(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Asset id is required");
  }

  return apiRequest(`/assets/${id}`, {
    method: "DELETE",
  });
}

export function reactivateAsset(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Asset id is required");
  }

  return apiRequest(`/assets/${id}`, {
    method: "PATCH",
  });
}
