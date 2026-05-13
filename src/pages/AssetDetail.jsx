import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAssetById, getLogsForAsset } from "../utils/apiReader";
import LogCard from "../components/logsComponents/LogCard";
import Select from "../components/shared/Select";
import "./AssetDetail.css";
import { formatDateTime } from "../utils/formatDateTime";
import { useAuth } from "../context/authContext";

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

function AssetDetail() {
  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [taskTypeFilter, setTaskTypeFilter] = useState(null);

  const { hasRole } = useAuth();

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [assetData, logsData] = await Promise.all([
          getAssetById(id),
          getLogsForAsset(id, statusFilter, taskTypeFilter),
        ]);
        setAsset(assetData);
        setLogs(logsData);
      } catch (err) {
        setError(err?.message ?? "Failed to load asset details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, taskTypeFilter, statusFilter]);

  function handleTaskTypeChange(e) {
    const value = e.target.value;
    setTaskTypeFilter(value === "" ? null : value);
  }

  function handleStatusChange(e) {
    const value = e.target.value;
    setStatusFilter(value === "" ? null : value);
  }

  if (loading) return <h1>Loading assets…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div className="asset-detail-page">
      <section className="asset-detail-summary">
        <p className="asset-detail-name">{asset?.name}</p>
        {asset?.description ? (
          <p className="asset-detail-description">{asset.description}</p>
        ) : null}

        <div className="asset-detail-meta">
          {asset?.active === true ? (
            <span className="asset-detail-status asset-detail-status--active">
              Active
            </span>
          ) : asset?.active === false ? (
            <span className="asset-detail-status asset-detail-status--inactive">
              Inactive
            </span>
          ) : null}

          {asset?.lastLogDate ? (
            <span className="asset-detail-last-log">
              Last log: {formatDateTime(asset.lastLogDate)}
            </span>
          ) : null}
        </div>

        {hasRole("TECHNICIAN") ? (
          <div className="asset-detail-actions">
            <Link to={`/assets/${id}/createlog`} className="asset-detail-create-log">
              Create log
            </Link>
          </div>
        ) : null}
      </section>

      <section className="asset-detail-logs">
        <>
          <div className="asset-detail-toolbar">
            <Select
              labelClassName="asset-detail-filter"
              labelText="Status"
              selectClassName="asset-detail-filter-select"
              value={statusFilter ?? ""}
              onChange={handleStatusChange}
              options={LOG_STATUS_FILTER_OPTIONS}
            />

            <Select
              labelClassName="asset-detail-filter"
              labelText="Task type"
              selectClassName="asset-detail-filter-select"
              value={taskTypeFilter ?? ""}
              onChange={handleTaskTypeChange}
              options={LOG_TASK_TYPE_FILTER_OPTIONS}
            />
          </div>

          {logs.length === 0 ? (
            <p className="asset-detail-empty">
              {statusFilter || taskTypeFilter
                ? "No logs match those filters."
                : "No logs for this asset yet."}
            </p>
          ) : (
            logs.map((log) => <LogCard key={log.id} log={log} />)
          )}
        </>
      </section>
    </div>
  );
}

export default AssetDetail;
