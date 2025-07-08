import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("Token no válido o expirado.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Contraseña actualizada correctamente. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Restablecer Contraseña</h2>

        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
