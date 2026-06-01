import { apiRequest, assertPositiveIntegerId } from "./apiClient";

export function getAssets(active = null) {
  const url = active !== null ? `/assets?active=${active}` : "/assets";
  return apiRequest(url);
}

export function getAssetById(id) {
  assertPositiveIntegerId("id", id, "getAssetById");
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
  assertPositiveIntegerId("id", id, "deactivateAsset");

  return apiRequest(`/assets/${id}`, {
    method: "DELETE",
  });
}

export function reactivateAsset(id) {
  assertPositiveIntegerId("id", id, "reactivateAsset");

  return apiRequest(`/assets/${id}`, {
    method: "PATCH",
  });
}
