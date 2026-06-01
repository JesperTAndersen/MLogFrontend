import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getEmployeeById } from "../utils/employeeApi";
import { getLogsForEmployee } from "../utils/logApi";
import LogCard from "../components/logsComponents/LogCard";
import Select from "../components/shared/Select";
import styles from "./AssetDetail.module.css";
import feedbackStyles from "../styles/feedback.module.css";

const LOG_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "FAILED", label: "Failed" },
  { value: "DONE", label: "Done" },
];

const LOG_TASK_TYPE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "PRODUCTION", label: "Production" },
  { value: "ERROR", label: "Error" },
];

function EmployeeLogList() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [taskTypeFilter, setTaskTypeFilter] = useState(null);
  const [assetNameFilter, setAssetNameFilter] = useState(null);

  const assetNameOptions = Array.from(
    new Set(logs.map((log) => log?.assetName).filter(Boolean)),
  )
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((name) => ({ value: name, label: name }));

  const visibleLogs = logs
    .filter((log) => (statusFilter ? log.status === statusFilter : true))
    .filter((log) => (taskTypeFilter ? log.taskType === taskTypeFilter : true))
    .filter((log) =>
      assetNameFilter ? log.assetName === assetNameFilter : true,
    );

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);

        const [employeeData, logsData] = await Promise.all([
          getEmployeeById(id),
          getLogsForEmployee(id),
        ]);

        setEmployee(employeeData);
        setLogs(logsData);
      } catch (err) {
        setError(err?.message ?? "Failed to load employee logs");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [id]);

  function handleTaskTypeChange(e) {
    const value = e.target.value;
    setTaskTypeFilter(value === "" ? null : value);
  }

  function handleStatusChange(e) {
    const value = e.target.value;
    setStatusFilter(value === "" ? null : value);
  }

  function handleAssetNameChange(e) {
    const value = e.target.value;
    setAssetNameFilter(value === "" ? null : value);
  }

  if (loading) return <h1>Loading logs…</h1>;
  if (error)
    return (
      <div className={styles.page}>
        <section className={feedbackStyles.card}>
          <p className={feedbackStyles.errorText}>{error}</p>
        </section>
      </div>
    );

  const fullName = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.page}>
      <section className={styles.summary}>
        <p className={styles.name}>
          Performed Logs{fullName ? ` by ${fullName}` : ""}
        </p>
      </section>

      <section className={styles.logs}>
        <>
          <div className={styles.toolbar}>
            <Select
              labelText="Status"
              value={statusFilter ?? ""}
              onChange={handleStatusChange}
              options={LOG_STATUS_FILTER_OPTIONS}
            />

            <Select
              labelText="Task type"
              value={taskTypeFilter ?? ""}
              onChange={handleTaskTypeChange}
              options={LOG_TASK_TYPE_FILTER_OPTIONS}
            />

            <Select
              labelText="Asset"
              value={assetNameFilter ?? ""}
              onChange={handleAssetNameChange}
              options={[{ value: "", label: "All" }, ...assetNameOptions]}
            />
          </div>

          {visibleLogs.length === 0 ? (
            <p className={styles.empty}>
              {statusFilter || taskTypeFilter || assetNameFilter
                ? "No logs match those filters."
                : "No logs performed by this employee yet."}
            </p>
          ) : (
            visibleLogs.map((log) => (
              <LogCard key={log.id} log={log} showAssetName />
            ))
          )}
        </>
      </section>
    </div>
  );
}

export default EmployeeLogList;
