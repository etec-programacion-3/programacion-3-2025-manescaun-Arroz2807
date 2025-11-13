import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";

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
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
      if (!data.user_id) throw new Error("Respuesta inválida del servidor");

      const userObj = { user_id: data.user_id, name: data.name, email: data.email };
      localStorage.setItem("user", JSON.stringify(userObj));
      onLogin?.(userObj);
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* --- Columna izquierda: formulario (60%) --- */}
      <div
        className="auth-form"
        style={{
          flex: "0 0 60%",
          backgroundColor: "var(--gray-light)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div className="auth-form-content">
          <form onSubmit={handleLogin}>
            <h2 style={{ marginBottom: "1rem" }}>Iniciar sesión</h2>

            <input
              type="email"
              placeholder="Correo electrónico"
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

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "var(--button-green)",
                color: "white",
                padding: "0.6rem",
                border: "none",
                borderRadius: "6px",
                marginTop: "0.5rem",
                width: "100%",
              }}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {error && <p className="error">{error}</p>}

            <p style={{ marginTop: "1rem" }}>
              ¿No tenés cuenta?{" "}
              <span
                style={{ color: "var(--button-blue)", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Registrate aquí
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* --- Columna derecha: descripción (90%) --- */}
      <div
        className="auth-right"
        style={{
          flex: "0 0 90%",
          backgroundColor: "var(--gray-bg)",
          display: "flex-right",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div className="auth-right-content" style={{ maxWidth: "5000x", textAlign: "left" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "white" }}>Flownote</h1>
          <h2 style={{ color: "var(--text-color)", marginBottom: "1rem" }}>
            Organizá tu día, simplificá tu vida.
          </h2>
          <p style={{ color: "#d0d0d0", lineHeight: "1.6", fontSize: "1.1rem" }}>
            Tu espacio personal para gestionar tareas y apuntes de forma simple y eficiente.
            Accedé a tus pendientes, tomá notas y mantené todo sincronizado.
            Ingresá ahora y empezá a organizarte mejor.
          </p>
        </div>
      </div>
    </div>
  );
}
