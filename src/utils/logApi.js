import { apiRequest, assertPositiveIntegerId } from "./apiClient";

export function getLogsForAsset(id, status = null, taskType = null) {
  assertPositiveIntegerId("id", id, "getLogsForAsset");
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (taskType) params.set("taskType", taskType);

  const qs = params.toString();
  const url = `/assets/${id}/logs${qs ? `?${qs}` : ""}`;
  return apiRequest(url);
}

export function createLog(assetId, logBody) {
  assertPositiveIntegerId("assetId", assetId, "createLog");

  return apiRequest(`/assets/${assetId}/logs`, {
    method: "POST",
    body: logBody,
  });
}

export function getLogsForEmployee(employeeId) {
  assertPositiveIntegerId("employeeId", employeeId, "getLogsForEmployee");
  const url = `/logs/employee/${employeeId}`;
  return apiRequest(url);
}

export function getLogById(logId) {
  assertPositiveIntegerId("logId", logId, "getLogById");

  return apiRequest(`/logs/${logId}`);
}
