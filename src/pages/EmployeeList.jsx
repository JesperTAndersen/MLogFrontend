import { useEffect, useState } from "react";
import EmployeeCard from "../components/employees/EmployeeCard";
import Select from "../components/shared/Select";
import styles from "./AssetList.module.css";
import { getEmployees } from "../utils/employeeApi";
import FeedbackMessage from "../components/shared/FeedbackMessage";
import {
  EMPLOYEE_STATUS_FILTER_OPTIONS,
  EMPLOYEE_ROLE_FILTER_OPTIONS,
} from "../utils/constants/filterOptions";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);

  const visibleEmployees = employees.filter((emp) =>
    roleFilter ? emp.role === roleFilter : true,
  );

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
    setRoleFilter(value === "null" ? null : value);
  }

  if (loading)
    return <FeedbackMessage type="loading" message="Loading employees..." />;
  if (error) return <FeedbackMessage type="error" message={error} />;

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
          labelText="Filter by role"
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
