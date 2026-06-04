import { useState } from "react";
import Button from "../shared/Button";
import Select from "../shared/Select";
import formStyles from "../../styles/forms.module.css";
import styles from "../../pages/UserProfile.module.css";
import { updateEmployee } from "../../utils/employeeApi";
import ProfileFieldRow from "./ProfileFieldRow";
import ProfileValueRow from "./ProfileValueRow";
import { useAuth } from "../../context/authContext";

function EditProfileForm({ user, isEditing, onCancelEditing, onUserUpdated }) {
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const { hasRole } = useAuth();

  const isAdmin = hasRole?.("ADMIN") === true;

  const roleOptions = [
    { value: "AUTHENTICATED", label: "Auth Employee" },
    { value: "TECHNICIAN", label: "Technician" },
    ...(isAdmin
      ? [
          { value: "MANAGER", label: "Manager" },
          { value: "ADMIN", label: "Admin" },
        ]
      : []),
  ];

  async function saveEdits(e) {
    e?.preventDefault?.();
    setEditError(null);

    if (saving) return;
    if (!user?.id) return;

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    if (!firstName) return setEditError("First name is required.");
    if (!lastName) return setEditError("Last name is required.");
    if (!email) return setEditError("Email is required.");
    if (!role) return setEditError("Role is required.");

    try {
      setSaving(true);
      const updated = await updateEmployee(user.id, {
        id: user.id,
        firstName,
        lastName,
        email,
        phone,
        role,
        active: user.active,
      });
      onUserUpdated?.(updated);
      onCancelEditing?.();
    } catch (err) {
      setEditError(err?.message ?? "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  if (!isEditing) {
    return (
      <section className={styles.details}>
        <ProfileValueRow label="First name" value={user.firstName} />
        <ProfileValueRow label="Last name" value={user.lastName} />
        <ProfileValueRow label="Email" value={user.email} />
        <ProfileValueRow label="Phone" value={user.phone} />
      </section>
    );
  }

  return (
    <form className={styles.details} onSubmit={saveEdits}>
      <ProfileFieldRow
        label="First name"
        type="text"
        name="firstName"
        defaultValue={user.firstName ?? ""}
        required
      />

      <ProfileFieldRow
        label="Last name"
        type="text"
        name="lastName"
        defaultValue={user.lastName ?? ""}
        required
      />

      <ProfileFieldRow
        label="Email"
        type="email"
        name="email"
        defaultValue={user.email ?? ""}
        required
      />

      <ProfileFieldRow
        label="Phone"
        type="tel"
        name="phone"
        defaultValue={user.phone ?? ""}
      />

      <Select
        labelText="Role"
        name="role"
        defaultValue={user.role ?? ""}
        options={roleOptions}
        required
      />

      {editError ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>
          {editError}
        </p>
      ) : null}

      <div className={styles.editActions}>
        <Button buttonText={saving ? "Saving…" : "Save"} />
        <Button
          type="button"
          className={styles.secondaryButton}
          handler={onCancelEditing}
          disabled={saving}
          buttonText="Cancel"
        />
      </div>
    </form>
  );
}

export default EditProfileForm;
