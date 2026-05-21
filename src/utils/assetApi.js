import { apiRequest } from "./apiClient";

export function getAssets(active = null) {
  const url = active !== null ? `/assets?active=${active}` : "/assets";
  return apiRequest(url);
}

export function getAssetById(id) {
  return apiRequest(`/assets/${id}`);
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
