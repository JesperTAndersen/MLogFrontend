import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/shared/Button";
import InputField from "../components/shared/InputField";
import Select from "../components/shared/Select";
import formStyles from "../styles/forms.module.css";
import styles from "./CreateAsset.module.css";
import { createAsset } from "../utils/assetApi";

const ACTIVE_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function CreateAsset() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState("true");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e?.preventDefault?.();
    setError(null);

    if (submitting) return;

    const trimmedName = String(name ?? "").trim();
    const trimmedDescription = String(description ?? "").trim();

    if (!trimmedName) return setError("Name is required.");
    if (!trimmedDescription) return setError("Description is required.");

    const assetBody = {
      name: trimmedName,
      description: trimmedDescription,
      active: active === "true",
    };

    try {
      setSubmitting(true);
      const created = await createAsset(assetBody);
      if (created?.id !== undefined && created?.id !== null) {
        navigate(`/assets/${created.id}/logs`, { replace: true });
      } else {
        navigate("/assets", { replace: true });
      }
    } catch (err) {
      setError(err?.message ?? "Failed to create asset");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <InputField
        label="Name"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Hydraulic Press #3"
        required
      />

      <label className={formStyles.label}>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Main production line hydraulic press"
          rows={5}
          required
          className={`${formStyles.control} ${formStyles.textarea}`}
        />
      </label>

      <Select
        labelText="Status"
        value={active}
        onChange={(e) => setActive(e.target.value)}
        options={ACTIVE_OPTIONS}
      />

      {error ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>{error}</p>
      ) : null}

      <Button buttonText={submitting ? "Creating…" : "Create asset"} />
    </form>
  );
}

export default CreateAsset;
