import { useNavigate } from "react-router";
import "./AssetCard.css";

function AssetCard({ asset }) {
  const navigate = useNavigate();

  const formatDaDateTime = (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <>
      <section
        className="asset-card"
        onClick={() => navigate(`/assets/${asset.id}/logs`)}
      >
        <p className="asset-card-name">{asset.name}</p>
        <p className="asset-card-description">{asset.description}</p>
        <p className="asset-card-status-line">
          {asset.active ? (
            <span className="asset-card-status asset-card-status--active">
              Active
            </span>
          ) : (
            <span className="asset-card-status asset-card-status--inactive">
              Inactive
            </span>
          )}
        </p>
        <p className="asset-card-date">{formatDaDateTime(asset.lastLogDate)}</p>
      </section>
    </>
  );
}

export default AssetCard;
