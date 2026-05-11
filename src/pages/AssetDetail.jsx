import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAssetById, getLogsForAsset } from "../utils/apiReader";
import LogCard from "../components/logsComponents/LogCard";
import "./AssetDetail.css";
import { formatDaDateTime } from "../utils/formatDaDateTime";

function AssetDetail() {
  const [asset, setAsset] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [taskTypeFilter, setTaskTypeFilter] = useState(null);

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
              Last log: {formatDaDateTime(asset.lastLogDate)}
            </span>
          ) : null}
        </div>
      </section>

      <section className="asset-detail-logs">
        <>
          <div className="asset-detail-toolbar">
            <label className="asset-detail-filter">
              Status
              <select
                className="asset-detail-filter-select"
                value={statusFilter ?? ""}
                onChange={handleStatusChange}
              >
                <option value="">All</option>
                <option value="FAILED">Failed</option>
                <option value="DONE">Done</option>
              </select>
            </label>

            <label className="asset-detail-filter">
              Task type
              <select
                className="asset-detail-filter-select"
                value={taskTypeFilter ?? ""}
                onChange={handleTaskTypeChange}
              >
                <option value="">All</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="PRODUCTION">Production</option>
                <option value="ERROR">Error</option>
              </select>
            </label>
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
