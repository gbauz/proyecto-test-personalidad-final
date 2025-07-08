import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, RegisterPayload, RoleOption, fetchRoles } from "./apiRegister";
import SweetAlertLike from "../../components/SweetAlertLike";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [rolDeUsuario, setRolDeUsuario] = useState<string>("");

  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    roleId: 0,
  });

  const [alert, setAlert] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await fetchRoles();
        if (response.isSuccess) {
          setRoles(response.data);
        } else {
          console.error('Error del backend:', response.message);
        }
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    const rol = localStorage.getItem("rolName");
    setRolDeUsuario(rol || "");
    loadRoles();
  }, []);
useEffect(() => {
  if (rolDeUsuario === "") {
    // Si es registro normal (sin estar logueado), se asigna automáticamente "Postulante"
    const postulanteRole = roles.find(role => role.label === "Postulante");
    if (postulanteRole) setSelectedRole(postulanteRole.value);
  } else {
    // Si el registro lo hace un admin (u otro rol), selecciona "Administrador" por defecto
    const adminRole = roles.find(role => role.label === "Administrador");
    if (adminRole) setSelectedRole(adminRole.value);
  }
}, [roles, rolDeUsuario]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const payload: RegisterPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        roleId: selectedRole,
      };

      const result = await registerUser(payload);

      if (!result.isSuccess) {
        setAlert({
          type: 'error',
          title: 'Error al registrar',
          message: result.message || 'Intenta nuevamente.',
        });
        return;
      }


console.log("hola")
      setForm({ name: "", email: "", password: "", roleId: 0 });
      setConfirmPassword("");
      setSelectedRole(0);
      setError("");

      setAlert({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada correctamente.',
      });

    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        title: 'Error de servidor',
        message: 'No se pudo registrar el usuario.',
      });
    }
  };

  const handleAlertConfirm = () => {
    setAlert(null);
    if (alert?.type === 'success') {
      if (rolDeUsuario === "") {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 py-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl rounded-xl overflow-hidden">

        {/* Izquierda */}
        <div className="relative bg-black text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-4">Humanalyze</h2>
          <p className="text-xl font-semibold mb-6 leading-snug">
            Regístrate y accede a tu perfil de personalidad
          </p>
          <p className="text-sm text-gray-300 mb-6">
            Explora tus habilidades y conecta con oportunidades.
          </p>
          <img
            src="https://i.ibb.co/Y7m6dMdv/Pngtree-people-connecting-puzzle-for-teamwork-4185481.png"
            alt="Team working"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Derecha */}
        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Crear cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Correo electrónico Gmail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
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
                required
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
              />
            </div>

            {rolDeUsuario !== "Postulante" && rolDeUsuario !== "" && (
              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="role"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(Number(e.target.value))}
                >
                  <option value="" disabled>Seleccione un rol</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition duration-300"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>

      {/* Alerta visual */}
    {alert && (
 <SweetAlertLike
  title="Registro exitoso"
  message="Tu cuenta ha sido creada correctamente."
  icon="https://cdn.jsdelivr.net/gh/ionic-team/ionicons@5.5.2/src/svg/checkmark-circle-outline.svg"
  onConfirm={handleAlertConfirm}
  autoCloseDelay={3000}
/>

)}
    </div>
  );
};

export default Register;
