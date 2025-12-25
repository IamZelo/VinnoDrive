import { useState, useEffect, type FormEvent } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // If already login redirect to home
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && token != undefined) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/user/token/obtain/", { username, password });

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      navigate("/", { replace: true });
    } catch (error: any) {
      alert(error.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Login</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
