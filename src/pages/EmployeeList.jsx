import { useEffect, useState } from "react";
import EmployeeCard from "../components/employees/EmployeeCard";
import Select from "../components/shared/Select";
import styles from "./AssetList.module.css";
import { getEmployees } from "../utils/employeeApi";

const EMPLOYEE_STATUS_FILTER_OPTIONS = [
    { value: "null", label: "All" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const EMPLOYEE_ROLE_FILTER_OPTIONS = [
    { value: "null", label: "All" },
    { value: "AUTHENTICATED", label: "Auth Employee" },
    { value: "TECHNICIAN", label: "Technician" },
    { value: "MANAGER", label: "Manager" },
    { value: "ADMIN", label: "Admin" },
  ];

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);

  const visibleEmployees = employees.filter(emp => roleFilter ? emp.role === roleFilter : true)

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees(activeFilter);
        setEmployees(data);
      } catch (err) {
        setError(err?.message ?? "Failed to load employees");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, [activeFilter]);

 function statusFilter(e) {
   const value = e.target.value;
   setActiveFilter(value === "null" ? null : value === "true");
 }

   function rolesFilter(e) {
    const value = e.target.value;
    if (value === "null") setRoleFilter(null);
    else setRoleFilter(value === "null" ? null : value);
  }

  if (loading) return <h1>Loading employees…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <>
      <div className={styles.toolbar}>
        <Select
          labelText="Filter by status"
          value={activeFilter ?? "null"}
          onChange={statusFilter}
          options={EMPLOYEE_STATUS_FILTER_OPTIONS}
        />
        <Select
          labelText="Filter by status"
          value={roleFilter ?? "null"}
          onChange={rolesFilter}
          options={EMPLOYEE_ROLE_FILTER_OPTIONS}
        />
      </div>
      {visibleEmployees.length === 0 ? (
        <p className={styles.empty}>No employees match those filters.</p>
      ) : (
        visibleEmployees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))
      )}
    </>
  );
}

export default EmployeeList;
