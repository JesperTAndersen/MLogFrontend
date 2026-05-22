import { apiRequest } from "./apiClient";

export function getLogsForAsset(id, status = null, taskType = null) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (taskType) params.set("taskType", taskType);

  const qs = params.toString();
  const url = `/assets/${id}/logs${qs ? `?${qs}` : ""}`;
  return apiRequest(url);
}

export function createLog(assetId, logBody) {
  if (assetId === undefined || assetId === null || assetId === "") {
    throw new Error("createLog(assetId, logBody) requires an assetId");
  }

  return apiRequest(`/assets/${assetId}/logs`, {
    method: "POST",
    body: logBody,
  });
}

export function getLogsForEmployee(employeeId) {
  const url = `/logs/employee/${employeeId}`;
  return apiRequest(url);
}

export function getLogById(logId) {
  if (logId === undefined || logId === null || logId === "") {
    throw new Error("getLogById(logId) requires a logId");
  }

  return apiRequest(`/logs/${logId}`);
}
