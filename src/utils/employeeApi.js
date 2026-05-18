import { apiRequest } from "./apiClient";

export function getMe() {
  return apiRequest("/employees/me");
}

export function getEmployeeById(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("getEmployeeById(id) requires an id");
  }

  return apiRequest(`/employees/${id}`);
}

export function getEmployees() {
  return apiRequest("/employees");
}
