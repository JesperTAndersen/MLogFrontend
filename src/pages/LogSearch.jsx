import { useState } from "react";
import InputField from "../components/shared/InputField";
import Button from "../components/shared/Button";
import LogCard from "../components/logsComponents/LogCard";
import formStyles from "../styles/forms.module.css";
import styles from "./LogSearch.module.css";
import { getLogById } from "../utils/logApi";

function LogSearch() {
	const [logIdInput, setLogIdInput] = useState("");
	const [log, setLog] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	async function submit(e) {
		e?.preventDefault?.();

		if (loading) return;

		const trimmed = String(logIdInput ?? "").trim();
		setError(null);
		setLog(null);

		if (!trimmed) {
			setError("Enter a log ID.");
			return;
		}

		if (!/^\d+$/.test(trimmed)) {
			setError("Log ID must be a whole number.");
			return;
		}

		const parsed = Number.parseInt(trimmed, 10);
		if (parsed <= 0) {
			setError("Log ID must be greater than 0.");
			return;
		}

		try {
			setLoading(true);
			const data = await getLogById(parsed);
			setLog(data);
		} catch (err) {
			setError(err?.message ?? "Failed to fetch log");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={styles.page}>
			<form onSubmit={submit} className={styles.form}>
				<InputField
					label="Search log by ID"
					type="number"
					value={logIdInput}
					onChange={setLogIdInput}
					placeholder="123"
					required
				/>

				{error ? (
					<p className={`${formStyles.message} ${formStyles.error}`}>{error}</p>
				) : null}

				<Button buttonText={loading ? "Searching…" : "Search"} />
			</form>

			{log ? (
				<section className={styles.result}>
					<LogCard log={log} showAssetName />
				</section>
			) : null}
		</div>
	);
}

export default LogSearch;
