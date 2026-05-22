import { useEffect, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import formStyles from "../styles/forms.module.css";
import styles from "./Login.module.css";

import { SESSION_EXPIRED_MESSAGE_KEY } from "../utils/sessionMessages";

function Login() {
  const [flashMessage] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!flashMessage) return;
    try {
      sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
    } catch {
      // ignore
    }
  }, [flashMessage]);

  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <h1 className={styles.brandTitle}>Rapid Maintenance</h1>
        <p className={styles.brandSubtitle}>Maintenance Log</p>
      </div>

      <LoginForm />
      {flashMessage ? (
        <p className={`${formStyles.message} ${formStyles.error}`}>
          {flashMessage}
        </p>
      ) : null}
    </div>
  );
}

export default Login;
