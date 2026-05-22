import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/shared/Button";
import InputField from "../components/shared/InputField";
import Select from "../components/shared/Select";
import { useAuth } from "../context/authContext";
import formStyles from "../styles/forms.module.css";
import styles from "./CreateEmployee.module.css";
import { createEmployee } from "../utils/employeeApi";

function CreateEmployee() {
	const navigate = useNavigate();
	const { hasRole } = useAuth();

	const roleOptions = useMemo(() => {
		const base = [
			{ value: "AUTHENTICATED", label: "Auth Employee" },
			{ value: "TECHNICIAN", label: "Technician" },
		];

		if (hasRole?.("ADMIN") === true) {
			base.push(
				{ value: "MANAGER", label: "Manager" },
				{ value: "ADMIN", label: "Admin" },
			);
		}

		return base;
	}, [hasRole]);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [role, setRole] = useState("TECHNICIAN");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	async function submit(e) {
		e?.preventDefault?.();
		setError(null);

		if (submitting) return;

		const trimmedFirst = String(firstName ?? "").trim();
		const trimmedLast = String(lastName ?? "").trim();
		const trimmedEmail = String(email ?? "").trim();
		const trimmedPhone = String(phone ?? "").trim();
		const trimmedPassword = String(password ?? "");

		if (!trimmedFirst) return setError("First name is required.");
		if (!trimmedLast) return setError("Last name is required.");
		if (!trimmedEmail) return setError("Email is required.");
		if (!trimmedPhone) return setError("Phone is required.");
		if (!role) return setError("Role is required.");
		if (!trimmedPassword) return setError("Password is required.");

		const employeeBody = {
			firstName: trimmedFirst,
			lastName: trimmedLast,
			email: trimmedEmail,
			phone: trimmedPhone,
			role,
			password: trimmedPassword,
		};

		try {
			setSubmitting(true);
			const created = await createEmployee(employeeBody);
			if (created?.id !== undefined && created?.id !== null) {
				navigate(`/employees/${created.id}`, { replace: true });
			} else {
				navigate("/employees", { replace: true });
			}
		} catch (err) {
			setError(err?.message ?? "Failed to create employee");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={submit} className={styles.form}>
			<InputField
				label="First name"
				type="text"
				value={firstName}
				onChange={setFirstName}
				placeholder="John"
				required
			/>

			<InputField
				label="Last name"
				type="text"
				value={lastName}
				onChange={setLastName}
				placeholder="Doe"
				required
			/>

			<InputField
				label="Email"
				type="email"
				value={email}
				onChange={setEmail}
				placeholder="john.doe@example.com"
				required
			/>

			<InputField
				label="Phone"
				type="tel"
				value={phone}
				onChange={setPhone}
				placeholder="12345678"
				required
			/>

			<Select
				labelText="Role"
				value={role}
				onChange={(e) => setRole(e.target.value)}
				options={roleOptions}
				required
			/>

			<InputField
				label="Password"
				type="password"
				value={password}
				onChange={setPassword}
				placeholder="securePassword123"
				required
			/>

			{error ? (
				<p className={`${formStyles.message} ${formStyles.error}`}>{error}</p>
			) : null}

			<Button buttonText={submitting ? "Creating…" : "Create employee"} />
		</form>
	);
}

export default CreateEmployee;
