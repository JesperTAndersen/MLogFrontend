import LoginForm from "../components/auth/LoginForm";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-brand">
        <h1 className="login-brand-title">Rapid Maintenance</h1>
        <p className="login-brand-subtitle">Maintenance Log</p>
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;