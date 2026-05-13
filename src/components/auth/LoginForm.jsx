import Button from "../shared/Button";
import InputField from "../shared/InputField";
import { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router";
import { loginAPI } from "../../utils/apiReader";
import { useAuth } from "../../context/authContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { authUser } = await loginAPI({ email, password });
      login(authUser);
      navigate("/assets");
    } catch (err) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleLogin}>
        <InputField
          label="Email"
          type="text"
          value={email}
          onChange={setEmail}
          placeholder="Employee@mail.com"
          required
        ></InputField>
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="***********"
          required
        ></InputField>
        <Button className="login-btn" buttonText="Login"></Button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </>
  );
}

export default LoginForm;
