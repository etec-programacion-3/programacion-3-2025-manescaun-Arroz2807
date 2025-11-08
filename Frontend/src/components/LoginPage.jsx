// src/components/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📩 Respuesta del backend:", data);

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      if (!data.user_id) {
        setError("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      // Creamos objeto user consistente
      const userObj = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
      };

      // Guardamos en localStorage y avisamos a App
      localStorage.setItem("user", JSON.stringify(userObj));
      if (onLogin) onLogin(userObj);

      // Redirigimos a la vista principal (tasks)
      navigate("/tasks");
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        ¿No tienes cuenta?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  );
}
