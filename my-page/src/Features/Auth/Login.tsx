import React, { useState } from "react";
import { LoginPayload, loginUser } from "./apiLogin";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(form);

      if (!result.isSuccess) {
        setError(result.message || "Credenciales incorrectas");
        return;
      }

      const { token, user } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', user.nombre);
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('rolName', user.roleName);
      localStorage.setItem('testCompleted', user.testCompleted ? 'true' : 'false');

      window.dispatchEvent(new Event('authChanged'));

      if (user.roleName === "Postulante") {
        navigate('/dashboard');
      } else {
        navigate('/dashboardAdmin');
      }
    } catch (err) {
      console.error(err);
      setError("Error de servidor o credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
  if (!recoveryEmail) {
    setRecoveryMessage("Por favor ingresa un correo.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: recoveryEmail }),
    });

    const data = await response.json();
    setRecoveryMessage(data.message);

    // ⏳ Cierra el modal después de 20 segundos
    setTimeout(() => {
      setShowForgot(false);
      setRecoveryEmail("");
      setRecoveryMessage("");
    }, 20000); // 20000 ms = 20 segundos

  } catch (err) {
    console.error(err);
    setRecoveryMessage("Error al enviar el correo de recuperación.");
  }
};


  const redirigir = () => {
    navigate('/registerPublic');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl rounded-xl overflow-hidden">

        {/* Izquierda */}
        <div className="relative bg-black text-white p-10 flex flex-col justify-center">
          <h2 className="text-white mb-4" style={{ color: '#EA4711' }}>Humanize</h2>
          <p className="text-white mb-4">¿Listo para descubrir tu perfil de personalidad?</p>
          <p className="text-white mb-4">Evalúa, conecta y contrata con inteligencia emocional.</p>
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=80"
            alt="Team working"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Derecha */}
        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Correo electrónico 
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
                placeholder="usuario@correo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                onClick={redirigir}
                className="text-orange-600 hover:underline text-sm"
              >
                <strong><u>Registrar</u></strong>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 ${
                loading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
              } text-white font-semibold py-2.5 rounded-lg transition duration-300`}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>

          {/* Enlace de recuperación */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm text-orange-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>

      {/* Modal de recuperación */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">Recuperar contraseña</h2>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
            >
              Enviar correo de recuperación
            </button>
            {recoveryMessage && (
              <p className="text-sm text-center mt-3 text-gray-600">{recoveryMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
