import { useNavigate } from "react-router";
import "./AssetCard.css";
import { formatDaDateTime } from "../../utils/formatDaDateTime";

function AssetCard({ asset }) {
  const navigate = useNavigate();

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
