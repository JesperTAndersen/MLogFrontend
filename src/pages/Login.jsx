import LoginForm from "../components/auth/LoginForm";
import styles from "./Login.module.css";

function Login() {
  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>Rapid Maintenance</h1>
        <p className={styles.brandSubtitle}>Maintenance Log</p>
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;