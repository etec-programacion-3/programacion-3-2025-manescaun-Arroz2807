import { useState } from "react";
import { registerUser } from "../services/api";

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", pass1: "", pass2: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.pass1 !== form.pass2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await registerUser({ name: form.name, email: form.email, password: form.pass1 });
      alert("Usuario registrado con éxito");
      onRegister();
    } catch (err) {
      setError("Error al registrarse o email en uso");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Nombre y Apellido" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <input name="pass1" type="password" placeholder="Contraseña" value={form.pass1} onChange={handleChange} required />
        <input name="pass2" type="password" placeholder="Repetir contraseña" value={form.pass2} onChange={handleChange} required />
        <button type="submit">Crear cuenta</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  error: { color: "red" },
};
