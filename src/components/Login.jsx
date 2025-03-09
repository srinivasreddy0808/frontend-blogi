import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        }
      );
      const Data = await response.json();

      if (response.ok) {
        navigate("/");
        console.log(Data);
        localStorage.setItem("user", JSON.stringify(Data));
        console.log("Login successful");
      } else {
        setError(Data.message);
        console.log(Data.message, "errorData");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("failed to fetch check internet connection");
    }
  };

  const handleSwitchToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Login</h2>
          <input
            type="text"
            placeholder="Email"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
          <p className={styles.link} onClick={handleSwitchToRegister}>
            Don't have an account? Register
          </p>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
};

export default Login;
