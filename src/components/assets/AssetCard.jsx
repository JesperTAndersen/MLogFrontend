import { useNavigate } from "react-router";
import styles from "./AssetCard.module.css";
import { formatDateTime } from "../../utils/formatDateTime";

function AssetCard({ asset }) {
  const navigate = useNavigate();

  return (
    <>
      <section
        className={styles.card}
        onClick={() => navigate(`/assets/${asset.id}/logs`)}
      >
        <p className={styles.name}>{asset.name}</p>
        <p className={styles.description}>{asset.description}</p>
        <p className={styles.statusLine}>
          {asset.active ? (
            <span className={`${styles.status} ${styles.statusActive}`}>
              Active
            </span>
          ) : (
            <span className={`${styles.status} ${styles.statusInactive}`}>
              Inactive
            </span>
          )}
        </p>
        <p className={styles.date}>{formatDateTime(asset.lastLogDate)}</p>
      </section>
    </>
  );
}

export default AssetCard;
