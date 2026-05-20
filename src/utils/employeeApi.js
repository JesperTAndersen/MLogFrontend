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

export function getEmployees(active = null) {
  const url = active !==null ? `/employees?active=${active}` : "/employees";
  return apiRequest(url);
}

export function changeEmployeePassword(id, oldPassword, newPassword) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Employee id is required");
  }
  if (!oldPassword) {
    throw new Error("Old password is required");
  }
  if (!newPassword) {
    throw new Error("New password is required");
  }

  return apiRequest(`/employees/${id}/password`, {
    method: "PATCH",
    body: { oldPassword, newPassword },
  });
}

export function updateEmployee(id, employeeBody) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Employee id is required");
  }

  return apiRequest(`/employees/${id}`, {
    method: "PUT",
    body: employeeBody,
  });
}

export function deactivateEmployee(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Employee id is required");
  }

  return apiRequest(`/employees/${id}`, {
    method: "DELETE",
  });
}

export function reactivateEmployee(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Employee id is required");
  }

  return apiRequest(`/employees/${id}`, {
    method: "PATCH",
  });
}
