import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", pass1: "", pass2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.pass1 !== form.pass2) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.pass1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      alert("Usuario registrado con éxito");
      onRegister?.();
      navigate("/");
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
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1rem" }}>Crear cuenta</h2>

            <input
              name="name"
              placeholder="Nombre y Apellido"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="pass1"
              type="password"
              placeholder="Contraseña"
              value={form.pass1}
              onChange={handleChange}
              required
            />

            <input
              name="pass2"
              type="password"
              placeholder="Repetir contraseña"
              value={form.pass2}
              onChange={handleChange}
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
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {error && <p className="error">{error}</p>}

            <p style={{ marginTop: "1rem" }}>
              ¿Ya tenés cuenta?{" "}
              <span
                style={{ color: "var(--button-blue)", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Iniciá sesión aquí
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
            Empezá a organizarte desde hoy.
          </h2>
          <p style={{ color: "#d0d0d0", lineHeight: "1.6", fontSize: "1.1rem" }}>
            Registrate gratis y accedé a una plataforma donde tus tareas y notas se sincronizan para simplificar tu día a día. Tomá el control de tu tiempo y hacé que cada momento cuente.
          </p>
        </div>
      </div>
    </div>
  );
}
