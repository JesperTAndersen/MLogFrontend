import { apiRequest } from "./apiClient";

export function getAssets(active = null) {
  const url = active !== null ? `/assets?active=${active}` : "/assets";
  return apiRequest(url);
}

export function getAssetById(id) {
  return apiRequest(`/assets/${id}`);
}
