export const LOG_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "FAILED", label: "Pending" },
  { value: "DONE", label: "Approved" },
];

//THIS IS A QUICK FIX, no approvement flow setup from backend yet.
export const LOG_STATUS_CREATING = [
  { value: "", label: "All" },
  { value: "FAILED", label: "Pending" },
];

export const LOG_TASK_TYPE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "PRODUCTION", label: "Production" },
  { value: "ERROR", label: "Error" },
];

export const ASSET_STATUS_FILTER_OPTIONS = [
  { value: "null", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const EMPLOYEE_STATUS_FILTER_OPTIONS = [
  { value: "null", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const EMPLOYEE_ROLE_FILTER_OPTIONS = [
  { value: "null", label: "All" },
  { value: "AUTHENTICATED", label: "Auth Employee" },
  { value: "TECHNICIAN", label: "Technician" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
];